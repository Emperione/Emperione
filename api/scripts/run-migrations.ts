import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const MIGRATIONS_DIR = path.resolve(__dirname, '..', '..', 'supabase', 'migrations');
const connectionString = process.env['DATABASE_URL'] || process.env['SUPABASE_DATABASE_URL'] || process.env['SUPABASE_DB_URL'] || process.env['SUPABASE_URL'];
const client = new Client({ connectionString });

// Simple CLI flags
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const BACKUP_BEFORE = args.includes('--backup');
const LOCK_KEY = 1234567890; // arbitrary big int for pg_advisory_lock

if (DRY_RUN) {
  // In dry-run mode we don't connect to the DB (useful for CI validation)
  try {
    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();
    console.log('[dry-run] Found migration files:');
    for (const f of files) console.log('  -', f);
    console.log('[dry-run] No DB connection attempted.');
    process.exit(0);
  } catch (err) {
    console.error('[dry-run] Failed to read migrations directory:', err);
    process.exit(2);
  }
}

async function ensureMigrationsTable() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id serial PRIMARY KEY,
      filename text UNIQUE NOT NULL,
      applied_at timestamptz DEFAULT now()
    );
  `);
}

async function tryAdvisoryLock() {
  // Try to obtain advisory lock; returns true if obtained
  const res = await client.query('SELECT pg_try_advisory_lock($1) as locked', [LOCK_KEY]);
  return res.rows[0]?.locked === true;
}

async function releaseAdvisoryLock() {
  await client.query('SELECT pg_advisory_unlock($1)', [LOCK_KEY]);
}

function runPgDumpBackup(outFile: string) {
  const dbUrl = connectionString;
  if (!dbUrl) throw new Error('No DATABASE_URL available for backup');
  console.log('Running pg_dump to', outFile);
  const res = spawnSync('pg_dump', ['--format=plain', '--no-owner', '--no-privileges', dbUrl], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(`pg_dump failed: ${res.stderr || res.stdout}`);
  fs.writeFileSync(outFile, res.stdout, 'utf8');
}

async function getApplied() {
  const res = await client.query('SELECT filename FROM migrations');
  return new Set(res.rows.map((r: any) => r.filename));
}

async function applyMigration(filename: string, sql: string) {
  console.log('Applying', filename);
  if (DRY_RUN) {
    console.log('[dry-run] would apply', filename);
    return;
  }
  await client.query('BEGIN');
  try {
    await client.query(sql);
    await client.query('INSERT INTO migrations(filename) VALUES($1)', [filename]);
    await client.query('COMMIT');
    console.log('Applied', filename);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}

async function main() {
  if (!process.env['DATABASE_URL'] && !process.env['SUPABASE_URL']) {
    console.error('No DATABASE_URL or SUPABASE_URL provided in env. Set SUPABASE_URL or DATABASE_URL.');
    process.exit(2);
  }
  await client.connect();
  // Attempt to obtain advisory lock to avoid concurrent migration runs
  const locked = await tryAdvisoryLock();
  if (!locked) {
    console.error('Another migration process is running (advisory lock held). Aborting.');
    process.exit(3);
  }

  try {
    console.log('Acquired advisory lock for migrations.');

    if (BACKUP_BEFORE) {
      try {
        const outFile = path.resolve(process.cwd(), `migration-backup-${Date.now()}.sql`);
        runPgDumpBackup(outFile);
        console.log('Backup saved to', outFile);
      } catch (err) {
        console.error('Backup failed:', err);
        // decide whether to abort; by default abort to be safe
        await releaseAdvisoryLock();
        process.exit(4);
      }
    }

    await ensureMigrationsTable();
    const applied = await getApplied();

    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();
    for (const f of files) {
      if (applied.has(f)) {
        console.log('Skipping', f);
        continue;
      }
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf8');
      await applyMigration(f, sql);
    }

    console.log('Migrations complete');
  } finally {
    await releaseAdvisoryLock();
    await client.end();
    console.log('Released advisory lock and closed DB connection.');
  }
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
