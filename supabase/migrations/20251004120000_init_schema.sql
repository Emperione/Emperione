-- Initial schema for Emperione (Supabase migration)
-- Add clear, small migrations and explain any non-obvious choices in comments.

-- Ensure pgcrypto is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text UNIQUE NOT NULL,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Servers (Discord guilds)
CREATE TABLE IF NOT EXISTS servers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text UNIQUE NOT NULL,
  name text,
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS) and add example policy — contributors should tailor these policies.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_self_read" ON users
  FOR SELECT USING (id = auth.uid()::uuid);

-- Notes: auth.uid() is provided by Supabase Postgres auth via JWT; adjust policy to match your auth strategy.
