# Emperione Architecture

System architecture and technical design of the Emperione Discord Community Management Suite.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Components](#components)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Design Patterns](#design-patterns)
- [Scalability](#scalability)

---

## System Overview

Emperione is built as a modern monorepo with three main components working together to provide comprehensive Discord community management.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Discord API                          │
└────────────────┬────────────────────────────┬────────────────┘
                 │                            │
                 ↓                            ↓
        ┌─────────────────┐         ┌─────────────────┐
        │   Discord Bot   │←────────│   Web Dashboard │
        │   (Discord.js)  │         │   (Next.js)     │
        └────────┬────────┘         └────────┬────────┘
                 │                            │
                 ↓                            ↓
        ┌──────────────────────────────────────────┐
        │           Backend API (Express)          │
        │  ┌────────────┐      ┌────────────┐     │
        │  │ Controllers│◄────►│  Services  │     │
        │  └────────────┘      └────────────┘     │
        └────────┬─────────────────────┬──────────┘
                 │                     │
                 ↓                     ↓
        ┌─────────────────┐   ┌─────────────────┐
        │   PostgreSQL    │   │      Redis      │
        │   (Prisma ORM)  │   │   (Cache/Queue) │
        └─────────────────┘   └─────────────────┘
```

---

## Components

### 1. Discord Bot (`bot/`)

**Purpose**: Interacts with Discord API to collect data and execute actions

**Key Responsibilities**:
- Listen to Discord events (messages, members, reactions)
- Execute moderation actions (ban, kick, timeout)
- Collect analytics data
- Respond to slash commands
- Send real-time updates to backend

**Technology**: Discord.js 14, TypeScript, Node.js

**Entry Point**: `bot/src/index.ts`

### 2. Backend API (`api/`)

**Purpose**: Central business logic and data management

**Key Responsibilities**:
- RESTful API endpoints
- Database operations via Prisma ORM
- Authentication & authorization
- Analytics calculations
- AI/ML integrations
- Background job processing
- WebSocket connections for real-time updates

**Technology**: Express, Prisma, PostgreSQL, Redis, Bull Queue

**Entry Point**: `api/src/index.ts`

### 3. Web Dashboard (`dashboard/`)

**Purpose**: User interface for community management

**Key Responsibilities**:
- User authentication (Discord OAuth)
- Data visualization (charts, graphs)
- Configuration interfaces
- Member management UI
- Analytics dashboards
- Report generation

**Technology**: Next.js 14, React 18, Tailwind CSS, shadcn/ui

**Entry Point**: `dashboard/src/app/page.tsx`

### 4. PostgreSQL Database

**Purpose**: Persistent data storage

**Stores**:
- User accounts and sessions
- Server configurations
- Member data and history
- Moderation logs
- Analytics snapshots
- AI-generated insights

**Access**: Via Prisma ORM from API layer

### 5. Redis Cache

**Purpose**: Performance optimization and queue management

**Uses**:
- Session storage
- API response caching
- Rate limiting counters
- Bull queue for background jobs
- Real-time data aggregation

---

## Data Flow

### Analytics Collection Flow

```
Discord Event → Bot Listener → API Endpoint → Database
                                    ↓
                              Background Job
                                    ↓
                            Analytics Service
                                    ↓
                          Aggregated Snapshot
                                    ↓
                               Dashboard
```

### Moderation Action Flow

```
Dashboard UI → API Request → Validation → Database Update
                                              ↓
                                         Bot Service
                                              ↓
                                         Discord API
                                              ↓
                                       Action Executed
```

### User Authentication Flow

```
User → Dashboard → Discord OAuth → API Callback → JWT Token
                                         ↓
                                   Store Session
                                         ↓
                                  Redirect to Dashboard
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: React Context + SWR/React Query
- **Charts**: Recharts
- **Auth**: NextAuth.js

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM**: Prisma
- **Validation**: Zod
- **Queue**: Bull (Redis-backed)
- **WebSocket**: Socket.io

### Database
- **Primary**: PostgreSQL 16
- **Cache**: Redis 7
- **ORM**: Prisma

### Bot
- **Library**: Discord.js 14
- **Runtime**: Node.js 18+
- **TypeScript**: Strict mode

### DevOps
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Jest, Testing Library
- **Linting**: ESLint, Prettier

---

## Design Patterns

### 1. Repository Pattern

Separates data access logic from business logic.

```typescript
// api/src/repositories/memberRepository.ts
export class MemberRepository {
  async findById(id: string) {
    return prisma.member.findUnique({ where: { id } });
  }
}
```

### 2. Service Layer Pattern

Encapsulates business logic separate from controllers.

```typescript
// api/src/services/analyticsService.ts
export class AnalyticsService {
  async calculateGrowthMetrics(serverId: string, period: string) {
    // Business logic here
  }
}
```

### 3. Controller Pattern

Handles HTTP requests and responses.

```typescript
// api/src/controllers/analyticsController.ts
export class AnalyticsController {
  async getGrowth(req: Request, res: Response) {
    // Handle request
  }
}
```

### 4. Event-Driven Architecture

Bot uses event listeners for Discord events.

```typescript
// bot/src/events/messageCreate.ts
client.on('messageCreate', async (message) => {
  // Handle event
});
```

### 5. Middleware Chain

Request processing pipeline in Express.

```typescript
app.use(cors());
app.use(bodyParser.json());
app.use(authMiddleware);
app.use(rateLimitMiddleware);
```

---

## Scalability

### Horizontal Scaling

**Bot Layer**:
- Multiple bot instances with sharding
- Discord.js built-in shard manager
- Each shard handles subset of servers

**API Layer**:
- Stateless API design
- Load balancer (nginx/HAProxy)
- Multiple API instances behind load balancer

**Database Layer**:
- PostgreSQL read replicas
- Connection pooling
- Query optimization with indexes

### Caching Strategy

**Levels**:
1. **Application Cache**: In-memory caching of frequently accessed data
2. **Redis Cache**: Distributed cache for API responses
3. **CDN**: Static asset caching for dashboard

**Cache Invalidation**:
- Time-based expiration
- Event-driven invalidation
- Manual purge endpoints

### Background Jobs

**Job Types**:
- Analytics aggregation (every 15 minutes)
- Alert processing (every 2 minutes)
- Report generation (on-demand)
- Data archival (daily)

**Processing**:
- Bull queue with Redis
- Multiple worker processes
- Priority-based execution
- Retry logic with exponential backoff

---

## Security

### Authentication
- Discord OAuth 2.0
- JWT tokens for API access
- Refresh token rotation
- Session management with Redis

### Authorization
- Role-based access control (RBAC)
- Server-specific permissions
- API endpoint protection
- Rate limiting per user/IP

### Data Protection
- Encryption at rest (PostgreSQL)
- Encryption in transit (TLS/SSL)
- Environment variable management
- Secure token storage

---

## Monitoring & Logging

### Logging Levels
- **ERROR**: Critical issues requiring immediate attention
- **WARN**: Potential issues to investigate
- **INFO**: General information about system operation
- **DEBUG**: Detailed information for debugging

### Metrics
- API response times
- Database query performance
- Bot event processing time
- Cache hit/miss rates
- Queue job completion rates

### Health Checks
- Database connectivity
- Redis connectivity
- Discord API connectivity
- API endpoint health

---

**Last Updated**: October 3, 2025
