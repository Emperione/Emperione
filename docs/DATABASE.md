# Emperione Database Schema

Database structure and relationships for the Emperione Discord Community Management Suite.

## 📊 Database Overview

- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Schema Location**: `api/prisma/schema.prisma`

---

## 📋 Entity Relationship Diagram

```
┌─────────┐       ┌──────────┐       ┌─────────┐
│  User   │──────<│  Server  │>──────│ Member  │
└─────────┘       └──────────┘       └─────────┘
                       │                   │
                       ↓                   ↓
                  ┌──────────┐      ┌──────────────┐
                  │ Settings │      │   Message    │
                  └──────────┘      └──────────────┘
                       │                   │
                       ↓                   ↓
              ┌──────────────────┐  ┌─────────────┐
              │ ModerationRule   │  │  Analytics  │
              └──────────────────┘  └─────────────┘
                       │
                       ↓
              ┌──────────────────┐
              │ ModerationAction │
              └──────────────────┘
```

---

## 📦 Tables

### User
Stores Discord users who have authenticated with the dashboard.

```prisma
model User {
  id            String   @id @default(cuid())
  discordId     String   @unique
  username      String
  discriminator String
  avatar        String?
  email         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  servers       Server[]
}
```

### Server
Represents a Discord server (guild) connected to Emperione.

```prisma
model Server {
  id              String   @id
  name            String
  icon            String?
  ownerId         String
  memberCount     Int
  connectedAt     DateTime @default(now())
  lastSyncAt      DateTime @updatedAt
  
  owner           User     @relation(fields: [ownerId], references: [id])
  members         Member[]
  settings        Settings?
  moderationRules ModerationRule[]
  analyticsData   Analytics[]
}
```

### Member
Tracks Discord server members and their activity.

```prisma
model Member {
  id                String   @id @default(cuid())
  discordId         String
  serverId          String
  username          String
  joinedAt          DateTime
  leftAt            DateTime?
  messageCount      Int      @default(0)
  lastActiveAt      DateTime?
  
  server            Server   @relation(fields: [serverId], references: [id])
  messages          Message[]
  moderationActions ModerationAction[]
}
```

### Message
Stores message data for analytics and moderation.

```prisma
model Message {
  id          String   @id
  content     String?
  memberId    String
  channelId   String
  serverId    String
  createdAt   DateTime
  sentiment   Float?
  
  member      Member   @relation(fields: [memberId], references: [id])
}
```

### Settings
Server-specific configuration.

```prisma
model Settings {
  id                    String   @id @default(cuid())
  serverId              String   @unique
  moderationEnabled     Boolean  @default(true)
  analyticsEnabled      Boolean  @default(true)
  aiEnabled             Boolean  @default(true)
  alertsEnabled         Boolean  @default(true)
  logChannelId          String?
  alertChannelId        String?
  
  server                Server   @relation(fields: [serverId], references: [id])
}
```

### ModerationRule
Automated moderation rules.

```prisma
model ModerationRule {
  id          String   @id @default(cuid())
  serverId    String
  name        String
  type        String
  enabled     Boolean  @default(true)
  action      String
  threshold   Int?
  duration    Int?
  keywords    String[]
  whitelist   String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  server      Server   @relation(fields: [serverId], references: [id])
  actions     ModerationAction[]
}
```

### ModerationAction
Log of moderation actions taken.

```prisma
model ModerationAction {
  id          String   @id @default(cuid())
  serverId    String
  memberId    String
  ruleId      String?
  moderatorId String?
  action      String
  reason      String?
  duration    Int?
  createdAt   DateTime @default(now())
  
  member      Member   @relation(fields: [memberId], references: [id])
  rule        ModerationRule? @relation(fields: [ruleId], references: [id])
}
```

### Analytics
Periodic snapshots of server analytics.

```prisma
model Analytics {
  id                String   @id @default(cuid())
  serverId          String
  timestamp         DateTime @default(now())
  memberCount       Int
  messageCount      Int
  activeUsers       Int
  sentimentScore    Float
  healthScore       Float
  
  server            Server   @relation(fields: [serverId], references: [id])
}
```

---

## 🔄 Relationships

- **User → Server**: One-to-many (a user can own multiple servers)
- **Server → Member**: One-to-many (a server has many members)
- **Server → Settings**: One-to-one (each server has one settings object)
- **Server → ModerationRule**: One-to-many (a server can have multiple rules)
- **Server → Analytics**: One-to-many (multiple analytics snapshots per server)
- **Member → Message**: One-to-many (a member sends many messages)
- **Member → ModerationAction**: One-to-many (a member can have multiple actions)
- **ModerationRule → ModerationAction**: One-to-many (a rule can trigger multiple actions)

---

## 🗃️ Indexes

Key indexes for performance:

```sql
-- Member lookups
CREATE INDEX idx_member_discord_id ON Member(discordId);
CREATE INDEX idx_member_server_id ON Member(serverId);

-- Message queries
CREATE INDEX idx_message_server_id ON Message(serverId);
CREATE INDEX idx_message_created_at ON Message(createdAt);

-- Analytics queries
CREATE INDEX idx_analytics_server_timestamp ON Analytics(serverId, timestamp);

-- Moderation logs
CREATE INDEX idx_moderation_action_server_id ON ModerationAction(serverId);
CREATE INDEX idx_moderation_action_created_at ON ModerationAction(createdAt);
```

---

## 🔄 Migrations

### Running Migrations

```bash
cd api
npm run prisma:migrate
```

### Creating a Migration

```bash
cd api
npx prisma migrate dev --name add_new_feature
```

### Viewing Database

```bash
cd api
npm run prisma:studio
```

Opens Prisma Studio at http://localhost:5555

---

## 💾 Data Retention

- **Messages**: 90 days (configurable)
- **Analytics**: 365 days
- **Moderation Logs**: 180 days
- **Member History**: Indefinite

Archived data is moved to cold storage after retention period.

---

**Last Updated**: October 3, 2025

*Note: This is a placeholder. The actual schema is defined in `api/prisma/schema.prisma` and will be created during implementation.*
