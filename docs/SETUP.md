# Emperione Setup Guide

Complete guide to installing and configuring Emperione Discord Community Management Suite.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Discord Bot Setup](#discord-bot-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Starting the Application](#starting-the-application)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing Emperione, ensure you have:

### Required Software
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- **Docker** >= 20.10.0 ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

### Required Accounts
- **Discord Account** with server administrator permissions
- **Discord Developer Application** (see [Discord Bot Setup](#discord-bot-setup))
- **OpenAI API Key** (optional, for AI features) ([Get API Key](https://platform.openai.com/))

### System Requirements
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 1GB free space
- **OS**: macOS, Linux, or Windows with WSL2

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/emperione-discord.git
cd emperione-discord
```

### 2. Install Dependencies

```bash
npm install
```

This will install dependencies for all three workspaces (bot, api, dashboard).

**Expected output:**
```
added XXX packages in XXs
```

---

## Discord Bot Setup

See [Discord Bot Setup Guide](DISCORD_SETUP.md) for detailed instructions on:
- Creating a Discord application
- Configuring bot permissions and intents
- Generating OAuth2 URL
- Inviting bot to your server

---

## Environment Configuration

### 1. Create Environment File

```bash
cp .env.example .env
```

### 2. Configure Required Variables

Edit `.env` and fill in the following required values:

```env
# Discord Configuration
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/emperione_db
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=generate_random_32_char_string_here
SESSION_SECRET=generate_random_32_char_string_here
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# API
API_PORT=8000
API_BASE_URL=http://localhost:8000

# Frontend
DASHBOARD_PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Generate Secure Secrets

**For JWT_SECRET and SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**For NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Optional: Configure AI Features

If using OpenAI for AI-powered features:
```env
OPENAI_API_KEY=sk-...your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo
AI_FEATURES_ENABLED=true
```

---

## Database Setup

### 1. Start Database Services

```bash
docker-compose up -d
```

This starts PostgreSQL and Redis containers.

**Verify services are running:**
```bash
docker-compose ps
```

Expected output:
```
NAME                    STATUS
emperione-postgres      Up
emperione-redis         Up
```

### 2. Run Database Migrations

```bash
cd api
npm run prisma:generate
npm run prisma:migrate
cd ..
```

**Expected output:**
```
✔ Generated Prisma Client
✔ Database migration applied
```

### 3. (Optional) Seed Test Data

```bash
cd api
npm run prisma:seed
cd ..
```

---

## Starting the Application

### Development Mode

Start all services simultaneously:
```bash
npm run dev
```

This starts:
- 🤖 **Discord Bot** - Connects to Discord
- 🔌 **API Server** - http://localhost:8000
- 🌐 **Dashboard** - http://localhost:3000

### Individual Services

Start services separately:
```bash
# Terminal 1: Start bot
npm run dev:bot

# Terminal 2: Start API
npm run dev:api

# Terminal 3: Start dashboard
npm run dev:dashboard
```

---

## Verification

### 1. Check Bot is Online

- Open Discord
- Verify your bot appears online in your server
- Try a command: `/stats`

### 2. Access Dashboard

- Open browser to http://localhost:3000
- Click "Login with Discord"
- Authorize the application
- You should see the dashboard

### 3. Check API Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-03T12:00:00.000Z"
}
```

### 4. Verify Database Connection

```bash
docker-compose exec postgres psql -U postgres -d emperione_db -c "\dt"
```

Should list all database tables.

---

## Troubleshooting

### Bot Won't Start

**Issue**: Bot shows offline in Discord

**Solutions**:
1. Verify `DISCORD_BOT_TOKEN` is correct
2. Check bot has required intents enabled
3. Ensure bot is invited to server with correct permissions
4. Check logs: `npm run dev:bot`

### Database Connection Errors

**Issue**: Cannot connect to PostgreSQL

**Solutions**:
1. Verify Docker is running: `docker ps`
2. Check database container: `docker-compose logs postgres`
3. Verify `DATABASE_URL` matches docker-compose settings
4. Restart containers: `docker-compose restart`

### Dashboard Won't Load

**Issue**: Dashboard shows error or won't load

**Solutions**:
1. Check API is running: `curl http://localhost:8000/health`
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Check browser console for errors
4. Clear browser cache and cookies
5. Verify OAuth redirect URI matches Discord settings

### Port Already in Use

**Issue**: Error: Port 3000/8000 is already in use

**Solutions**:
```bash
# Find process using port
lsof -ti:3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env
API_PORT=8001
DASHBOARD_PORT=3001
```

### Prisma Client Errors

**Issue**: Prisma client generation errors

**Solutions**:
```bash
cd api
rm -rf node_modules/.prisma
npm run prisma:generate
cd ..
```

### Redis Connection Failed

**Issue**: Cannot connect to Redis

**Solutions**:
1. Check Redis container: `docker-compose logs redis`
2. Test connection: `docker-compose exec redis redis-cli ping`
3. Verify `REDIS_URL` is correct
4. Restart Redis: `docker-compose restart redis`

---

## Next Steps

After successful setup:

1. **Configure Moderation Rules** - Set up automated moderation
2. **Customize Dashboard** - Adjust analytics widgets
3. **Invite More Servers** - Connect additional Discord servers
4. **Enable AI Features** - Configure AI-powered insights
5. **Set Up Monitoring** - Configure logging and alerts

See the [API Documentation](API.md) and [Architecture Guide](ARCHITECTURE.md) for more details.

---

## Getting Help

- **Documentation**: Check other guides in `/docs`
- **Discord Community**: [Join our server](https://discord.gg/your-invite)
- **GitHub Issues**: [Report problems](https://github.com/yourusername/emperione-discord/issues)
- **GitHub Discussions**: [Ask questions](https://github.com/yourusername/emperione-discord/discussions)

---

**Last Updated**: October 3, 2025
