import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const MIGRATIONS_DIR = path.resolve(__dirname, '..', '..', 'supabase', 'migrations');
const connectionString = process.env['DATABASE_URL'] || process.env['SUPABASE_DATABASE_URL'] || process.env['SUPABASE_DB_URL'] || process.env['SUPABASE_URL'];
const client = new Client({ connectionString });

async function ensureMigrationsTable() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id serial PRIMARY KEY,
      filename text UNIQUE NOT NULL,
      applied_at timestamptz DEFAULT now()
    );
  `);
}

async function getApplied() {
  const res = await client.query('SELECT filename FROM migrations');
  return new Set(res.rows.map((r: any) => r.filename));
}

async function applyMigration(filename: string, sql: string) {
  console.log('Applying', filename);
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

  await client.end();
  console.log('Migrations complete');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
