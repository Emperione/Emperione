-- 0002_seed.sql
-- Minimal seed data for Emperione

-- Create a sample user
INSERT INTO users (discord_id, email, display_name)
VALUES ('123456789012345678', 'dev@emperione.local', 'Dev Tester')
ON CONFLICT (discord_id) DO NOTHING;

-- Create a sample server
INSERT INTO servers (discord_id, name, owner_id)
SELECT '987654321098765432', 'Emperione Test Server', id FROM users WHERE discord_id='123456789012345678'
ON CONFLICT (discord_id) DO NOTHING;
