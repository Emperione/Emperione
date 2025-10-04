Supabase migrations and policies
=================================

This directory contains SQL migrations and policy files managed with the Supabase CLI.

Developer contribution workflow
---------------------------------

1. Install the Supabase CLI: https://supabase.com/docs/guides/cli

2. Authenticate the CLI (recommended for applied migrations):
   supabase login

3. To create a new migration locally:
   supabase migration new add_my_table --project-ref your-project-ref

4. Edit the generated SQL file under `supabase/migrations/YYYYMMDDHHMMSS_add_my_table.sql`.

5. Add the SQL file to git and open a PR. Describe the migration intent and any manual steps.

6. To apply migrations locally (against your local dev DB or remote dev project):
   supabase db push --project-ref your-project-ref

Notes
-----
- Keep each migration focused, reversible where possible, and include comments explaining rationale.
- For Row-Level Security (RLS) policies, include explicit `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` and `CREATE POLICY ...` statements in the same migration to ensure reproducibility.
- CI should run `supabase migration status` or `supabase db push --dry-run` against a test DB to validate migrations.
