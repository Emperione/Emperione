# Emperione Discord Community Management Suite

<div align="center">

![Emperione Logo](https://via.placeholder.com/200x200?text=Emperione)

**A unified, open-source Discord community management platform**

Combining analytics, moderation tools, member management, and growth tracking with AI-powered insights and automation.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14-blue)](https://discord.js.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Contributing](#contributing) • [License](#license)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

---

## 🌟 Overview

Emperione is a comprehensive Discord community management suite designed to help server owners, moderators, and community managers efficiently manage, moderate, and grow their Discord communities. Built with modern technologies and best practices, Emperione provides:

- **Unified Dashboard**: Centralized web interface for all community management tasks
- **Real-time Analytics**: Track member growth, engagement, sentiment, and community health
- **Automated Moderation**: AI-powered spam detection, keyword filtering, and rule enforcement
- **Member Management**: Detailed profiles, role management, and bulk operations
- **AI Insights**: Sentiment analysis, predictive analytics, and smart alerts
- **Self-Hosted**: Complete control over your data with open-source transparency

---

## ✨ Features

### 📊 Analytics & Insights
- **Member Growth Tracking**: Monitor joins, leaves, retention rates, and net growth
- **Engagement Metrics**: Track messages, active users, and per-channel activity
- **Sentiment Analysis**: Analyze community mood with positive/neutral/negative trends
- **Community Health Score**: Composite metric combining engagement, retention, and sentiment
- **Event Performance**: Track attendance and engagement during community events
- **Custom Dashboards**: Create personalized views with draggable widgets
- **Export Reports**: Generate CSV and PDF reports for stakeholders

### 🛡️ Automated Moderation
- **Spam Detection**: Pattern recognition and frequency analysis
- **Keyword Filtering**: Customizable filters with regex support
- **Automated Actions**: Configure auto-delete, warn, timeout, kick, or ban
- **Rate Limiting**: Prevent message flooding with configurable limits
- **URL Detection**: Block invite links and phishing URLs
- **Audit Logging**: Complete history of all moderation actions
- **Whitelist System**: Exempt specific users or channels from rules

### 🤖 AI-Powered Features
- **Content Recommendations**: Suggestions based on historical engagement
- **Smart Alerts**: Detect unusual activity patterns (raids, spam waves, sentiment drops)
- **Predictive Analytics**: Forecast community growth and engagement trends
- **Trending Topics**: Identify popular discussion themes
- **NLP Processing**: Natural language understanding for advanced insights
- **At-Risk Detection**: Identify members showing signs of disengagement

### 👥 Member Management
- **Detailed Profiles**: View join date, messages, roles, and activity timeline
- **Moderation History**: Track warnings, timeouts, and bans
- **Role Management**: Assign roles directly from the dashboard
- **Advanced Search**: Filter by role, activity level, join date, and tags
- **Bulk Operations**: Mass role assignment and messaging
- **Member Segmentation**: Organize members by engagement levels

### 🔧 Discord Bot Integration
- **Slash Commands**: Modern Discord command interface
- **Real-time Actions**: Execute moderation actions instantly
- **Data Collection**: Automated analytics data gathering
- **Custom Commands**: Create custom commands via dashboard
- **Event Notifications**: Configurable alerts to Discord channels

---

## 🏗️ Architecture

Emperione is built as a monorepo with three main packages:

```
emperione-discord/
├── bot/           # Discord bot (Discord.js + TypeScript)
├── api/           # Backend API (Express + Prisma + PostgreSQL)
├── dashboard/     # Web dashboard (Next.js + React + Tailwind)
├── docs/          # Documentation
└── docker-compose.yml
```

**Tech Stack:**
- **Frontend**: Next.js 14, React 18, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL 16, Redis 7
- **Bot**: Discord.js 14
- **AI/ML**: OpenAI API / Hugging Face
- **Language**: TypeScript (strict mode)
- **Testing**: Jest, Testing Library

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (or yarn/pnpm)
- **Docker** >= 20.10.0 (for PostgreSQL and Redis)
- **Discord Bot Token** (from [Discord Developer Portal](https://discord.com/developers/applications))

---

## 🚀 Quick Start

Get Emperione running in 5 minutes:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/emperione-discord.git
cd emperione-discord
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
# Edit .env with your Discord bot token and other configuration
```

### 4. Start Database Services

```bash
docker-compose up -d
```

### 5. Run Database Migrations

```bash
cd api
npm run prisma:migrate
cd ..
```

### 6. Start Development Servers

```bash
npm run dev
```

This will start:
- 🤖 Discord Bot on port (no port, connects to Discord)
- 🔌 API Server on http://localhost:8000
- 🌐 Dashboard on http://localhost:3000

---

## 📥 Installation

### Detailed Installation Steps

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/emperione-discord.git
   cd emperione-discord
   npm install
   ```

2. **Configure Discord Bot**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Navigate to "Bot" section and create a bot
   - Copy the bot token
   - Enable required intents: Server Members, Message Content, Presence
   - Generate OAuth2 URL with required permissions

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   DISCORD_BOT_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_CLIENT_SECRET=your_client_secret_here
   DATABASE_URL=postgresql://postgres:password@localhost:5432/emperione_db
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_secure_random_string_here
   NEXTAUTH_SECRET=your_nextauth_secret_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start Services**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d
   
   # Run database migrations
   cd api
   npm run prisma:migrate
   npm run prisma:generate
   cd ..
   ```

5. **Invite Bot to Server**
   - Use the OAuth2 URL generated in Discord Developer Portal
   - Select your test server
   - Grant required permissions

6. **Start Development**
   ```bash
   npm run dev
   ```

---

## ⚙️ Configuration

### Environment Variables

See [.env.example](.env.example) for a complete list of configuration options.

**Required:**
- `DISCORD_BOT_TOKEN` - Your Discord bot token
- `DISCORD_CLIENT_ID` - Discord application client ID
- `DISCORD_CLIENT_SECRET` - Discord OAuth secret
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT token signing
- `NEXTAUTH_SECRET` - NextAuth.js secret

**Optional but Recommended:**
- `OPENAI_API_KEY` - For AI-powered features
- `SENTRY_DSN` - For error tracking
- `LOG_LEVEL` - Logging verbosity (debug, info, warn, error)

### Discord Bot Permissions

Required permissions for the bot:
- Read Messages/View Channels
- Send Messages
- Manage Messages
- Embed Links
- Attach Files
- Read Message History
- Add Reactions
- Manage Roles
- Kick Members
- Ban Members
- Moderate Members (Timeout)

Required Intents:
- Server Members Intent
- Message Content Intent
- Presence Intent

---

## 💻 Usage

### Accessing the Dashboard

1. Navigate to http://localhost:3000
2. Click "Login with Discord"
3. Authorize the application
4. Select your Discord server from the dropdown

### Using Bot Commands

```
/stats          - Display server statistics
/ban @user      - Ban a user
/kick @user     - Kick a user
/warn @user     - Warn a user
/timeout @user  - Timeout a user
```

### Configuring Moderation Rules

1. Go to Dashboard → Moderation
2. Click "Add New Rule"
3. Configure conditions and actions
4. Save and activate

---

## 🔧 Development

### Project Structure

```
emperione-discord/
├── bot/
│   ├── src/
│   │   ├── commands/      # Bot commands
│   │   ├── events/        # Discord events
│   │   ├── services/      # Business logic
│   │   └── index.ts       # Bot entry point
│   └── tests/
├── api/
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   └── index.ts       # API entry point
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── tests/
├── dashboard/
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities and hooks
│   │   └── types/         # TypeScript types
│   └── tests/
└── docs/                  # Documentation
```

### Available Scripts

```bash
# Development
npm run dev              # Start all services in dev mode
npm run dev:bot         # Start bot only
npm run dev:api         # Start API only
npm run dev:dashboard   # Start dashboard only

# Building
npm run build           # Build all packages
npm run build:bot       # Build bot only
npm run build:api       # Build API only
npm run build:dashboard # Build dashboard only

# Testing
npm run test            # Run all tests
npm run test:bot        # Test bot only
npm run test:api        # Test API only
npm run test:dashboard  # Test dashboard only
npm run test:coverage   # Generate coverage report

# Code Quality
npm run lint            # Lint all packages
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio

# Docker
npm run docker:up       # Start Docker services
npm run docker:down     # Stop Docker services
npm run docker:logs     # View Docker logs
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific package tests
npm run test:bot
npm run test:api
npm run test:dashboard
```

### Writing Tests

Tests are located alongside source files:
- `*.test.ts` for unit tests
- `*.spec.ts` for integration tests

Example:
```typescript
// bot/src/services/moderationService.test.ts
import { ModerationService } from './moderationService';

describe('ModerationService', () => {
  it('should detect spam messages', () => {
    // Test implementation
  });
});
```

---

## 🚢 Deployment

### Self-Hosting with Docker

1. **Build Production Images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

3. **Start Services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Manual Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions for:
- DigitalOcean
- AWS EC2
- Heroku
- Railway
- Self-hosted VPS

---

## 📚 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed installation and setup
- [API Documentation](docs/API.md) - REST API endpoints and usage
- [Architecture Guide](docs/ARCHITECTURE.md) - System design and components
- [Database Schema](docs/DATABASE.md) - Database structure and relationships
- [Discord Setup](docs/DISCORD_SETUP.md) - Discord bot configuration
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Please read our [Contributing Guide](CONTRIBUTING.md) for detailed information.

### Development Workflow

1. Check the [issue tracker](https://github.com/yourusername/emperione-discord/issues) for open issues
2. Comment on an issue to claim it
3. Follow our code style and conventions
4. Write tests for new features
5. Update documentation as needed
6. Submit a PR with a clear description

---

## 💬 Support

### Community

- **Discord Server**: [Join our community](https://discord.gg/your-invite)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/yourusername/emperione-discord/discussions)
- **Issue Tracker**: [Report bugs and request features](https://github.com/yourusername/emperione-discord/issues)

### Getting Help

- Check the [documentation](docs/)
- Search [existing issues](https://github.com/yourusername/emperione-discord/issues)
- Join our Discord server for real-time help
- Create a new issue with detailed information

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Emperione Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - Powerful Discord API wrapper
- [Next.js](https://nextjs.org/) - React framework for production
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library

---

## 🗺️ Roadmap

- [x] Core bot functionality
- [x] Analytics dashboard
- [x] Automated moderation
- [x] Member management
- [x] AI-powered insights
- [ ] Mobile app (iOS/Android)
- [ ] Multi-platform support (Slack, Telegram)
- [ ] Advanced AI features
- [ ] Marketplace for custom modules
- [ ] Enterprise features

---

<div align="center">

**Built with ❤️ by the Emperione Team**

[Website](https://emperione.dev) • [Twitter](https://twitter.com/emperione) • [Discord](https://discord.gg/emperione)

</div>
