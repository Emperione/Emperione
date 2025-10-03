# Emperione Deployment Guide

Production deployment guide for the Emperione Discord Community Management Suite.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Preparation](#environment-preparation)
- [Docker Deployment](#docker-deployment)
- [Manual Deployment](#manual-deployment)
- [Platform-Specific Guides](#platform-specific-guides)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

**Minimum**:
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB SSD
- Network: Stable internet connection

**Recommended**:
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 50GB+ SSD
- Network: Low-latency connection

### Software Requirements

- Docker >= 20.10.0 (for Docker deployment)
- Node.js >= 18.0.0 (for manual deployment)
- PostgreSQL 16 (if not using Docker)
- Redis 7 (if not using Docker)
- nginx or similar reverse proxy

### Required Accounts

- Discord Bot Token and OAuth credentials
- OpenAI API Key (for AI features)
- Domain name and SSL certificate
- Server access (SSH)

---

## Environment Preparation

### 1. Domain and DNS

Set up DNS records for your domain:

```
A     api.yourdomain.com     → Your_Server_IP
A     yourdomain.com         → Your_Server_IP
CNAME www.yourdomain.com     → yourdomain.com
```

### 2. SSL Certificate

Get SSL certificate using Let's Encrypt:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

### 3. Firewall Configuration

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

---

## Docker Deployment

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/emperione-discord.git
cd emperione-discord
```

### 2. Configure Environment

```bash
cp .env.example .env.production
nano .env.production
```

Update with production values:
```env
NODE_ENV=production
API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:password@postgres:5432/emperione_db
# ... other production values
```

### 3. Build and Start

```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Run Migrations

```bash
docker-compose exec api npm run prisma:migrate deploy
```

---

## Manual Deployment

### 1. Install Dependencies

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Redis
sudo apt install redis-server
```

### 2. Setup Database

```bash
sudo -u postgres psql
CREATE DATABASE emperione_db;
CREATE USER emperione_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE emperione_db TO emperione_user;
\q
```

### 3. Clone and Build

```bash
git clone https://github.com/yourusername/emperione-discord.git
cd emperione-discord
npm install
npm run build
```

### 4. Configure PM2

```bash
npm install -g pm2

# Create ecosystem file
pm2 ecosystem
```

Edit `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'emperione-bot',
      cwd: './bot',
      script: 'dist/index.js',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'emperione-api',
      cwd: './api',
      script: 'dist/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'emperione-dashboard',
      cwd: './dashboard',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

### 5. Start Services

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Platform-Specific Guides

### DigitalOcean

1. Create a Droplet (Ubuntu 22.04, 4GB RAM minimum)
2. Add domain to Networking
3. Follow Docker or Manual deployment steps
4. Use DigitalOcean's managed PostgreSQL (optional)

### AWS EC2

1. Launch EC2 instance (t3.medium or larger)
2. Configure Security Groups (ports 80, 443, 22)
3. Attach Elastic IP
4. Follow Docker or Manual deployment steps
5. Use RDS for PostgreSQL (optional)

### Railway

1. Connect GitHub repository
2. Configure environment variables in dashboard
3. Railway auto-deploys on git push
4. Add PostgreSQL and Redis plugins

### Heroku

1. Create new app
2. Add PostgreSQL and Redis addons
3. Configure environment variables
4. Deploy via Git:
```bash
heroku git:remote -a your-app-name
git push heroku main
```

---

## Post-Deployment

### 1. Verify Services

```bash
# Check bot is running
pm2 status

# Test API
curl https://api.yourdomain.com/health

# Test dashboard
curl https://yourdomain.com
```

### 2. Setup Monitoring

Install monitoring tools:
```bash
# Install Grafana and Prometheus
# Configure error tracking (Sentry)
# Set up log aggregation
```

### 3. Configure Backups

```bash
# Database backups
crontab -e
# Add: 0 2 * * * pg_dump emperione_db > /backups/$(date +\%Y\%m\%d).sql

# Redis backups
# Configure AOF and RDB persistence
```

### 4. Update Discord OAuth

Update redirect URI in Discord Developer Portal:
```
https://yourdomain.com/auth/callback
```

---

## Monitoring

### Health Checks

```bash
# API health
curl https://api.yourdomain.com/health

# Database connection
docker exec emperione-postgres pg_isready

# Redis connection
docker exec emperione-redis redis-cli ping
```

### Logs

```bash
# Docker logs
docker-compose logs -f

# PM2 logs
pm2 logs

# nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Metrics

Monitor:
- CPU and RAM usage
- Database connections
- API response times
- Error rates
- Bot uptime

---

## Troubleshooting

### High Memory Usage

```bash
# Restart services
pm2 restart all

# Clear Redis cache
docker exec emperione-redis redis-cli FLUSHALL
```

### Database Connection Issues

```bash
# Check database status
systemctl status postgresql

# Check connections
psql -U emperione_user -d emperione_db -c "SELECT count(*) FROM pg_stat_activity;"
```

### Bot Disconnections

- Check Discord API status
- Verify bot token
- Review bot logs
- Ensure adequate resources

---

## Security Checklist

- [ ] All secrets in environment variables
- [ ] SSL/TLS enabled
- [ ] Firewall configured
- [ ] Database access restricted
- [ ] Regular security updates
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation implemented

---

## Maintenance

### Updates

```bash
git pull origin main
npm install
npm run build
pm2 restart all
```

### Database Migrations

```bash
cd api
npm run prisma:migrate deploy
```

### Scaling

Increase instances in PM2:
```bash
pm2 scale emperione-api +2
```

---

**Last Updated**: October 3, 2025
