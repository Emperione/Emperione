# Supabase migration & connectivity notes

This project uses Supabase for Postgres hosting. Migrations are stored under `/supabase/migrations/` as SQL files.

Quick commands (requires supabase CLI):

```bash
# login once
supabase login

# view migration status
supabase migration status

# apply migrations (CLI may vary by version)
supabase migration apply
```

Notes about connectivity:
- The `DATABASE_URL` in `.env` may point to a Supabase-hosted DB that has only an IPv6 address. If your machine/network does not have IPv6 connectivity, `pg` will fail with `ENETUNREACH` when attempting an IPv6 connection.
- In such cases you can:
  - Use the Supabase dashboard to generate a private or public IPv4 connection string (if available).
  - Run migrations via the Supabase CLI which performs the operation from the Supabase side.
  - Use a local Postgres instance for development (docker-compose) and point `DATABASE_URL` to it.

If you need, I can:
- Attempt to apply migrations via the supabase CLI (requires CLI + login)
- Apply migrations to the remote database if you approve and provide the necessary access
- Start a local Postgres via docker-compose and apply migrations locally
