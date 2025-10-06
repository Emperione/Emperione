-- 0001_init.sql
-- Initial schema for Emperione (Supabase/Postgres)

-- Users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text UNIQUE NOT NULL,
  email text,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Servers (Discord Guilds)
CREATE TABLE IF NOT EXISTS servers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text UNIQUE NOT NULL,
  name text,
  icon text,
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Members (server members)
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id uuid REFERENCES servers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  discord_joined_at timestamptz,
  roles text[],
  nickname text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (server_id, user_id)
);

-- Messages (raw message snapshots optionally stored)
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id uuid REFERENCES servers(id) ON DELETE CASCADE,
  channel_id text,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  content text,
  attachments jsonb,
  sent_at timestamptz,
  collected_at timestamptz NOT NULL DEFAULT now()
);

-- Moderation actions (warn, timeout, kick, ban, delete)
CREATE TABLE IF NOT EXISTS moderation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id uuid REFERENCES servers(id) ON DELETE CASCADE,
  target_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  reason text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Moderation rules
CREATE TABLE IF NOT EXISTS moderation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id uuid REFERENCES servers(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  conditions jsonb NOT NULL,
  actions jsonb NOT NULL,
  priority integer DEFAULT 100,
  enabled boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Analytics snapshots
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id uuid REFERENCES servers(id) ON DELETE CASCADE,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  metrics jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id uuid REFERENCES servers(id) ON DELETE CASCADE,
  type text NOT NULL,
  payload jsonb,
  resolved boolean DEFAULT false,
  severity text DEFAULT 'info',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_messages_server_sent_at ON messages(server_id, sent_at);
CREATE INDEX IF NOT EXISTS idx_analytics_server_period ON analytics_snapshots(server_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_server_created ON moderation_actions(server_id, created_at);
