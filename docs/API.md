# Emperione API Documentation

REST API reference for the Emperione Discord Community Management Suite.

## 📋 Base URL

```
Development: http://localhost:8000
Production: https://api.yourdomain.com
```

## 🔐 Authentication

All API endpoints (except auth endpoints) require authentication via JWT token.

### Getting a Token

```http
POST /api/auth/discord/callback
```

Returns JWT token after Discord OAuth flow.

### Using the Token

Include the token in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 📚 API Endpoints

### Authentication

#### Discord OAuth Login
```http
GET /api/auth/discord
```
Redirects to Discord OAuth page.

#### OAuth Callback
```http
GET /api/auth/discord/callback?code=<auth_code>
```
**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123456789",
    "username": "User#1234",
    "avatar": "https://..."
  }
}
```

---

### Servers

#### List User's Servers
```http
GET /api/servers
```
**Response**:
```json
{
  "servers": [
    {
      "id": "server_id",
      "name": "Server Name",
      "icon": "https://...",
      "memberCount": 1250,
      "connected": true
    }
  ]
}
```

#### Get Server Details
```http
GET /api/servers/:serverId
```

---

### Analytics

#### Get Growth Metrics
```http
GET /api/servers/:serverId/analytics/growth?period=7d
```
**Query Parameters**:
- `period`: `24h`, `7d`, `30d`, `90d`, `all`

**Response**:
```json
{
  "totalMembers": 1250,
  "newJoins": 45,
  "leaves": 12,
  "netGrowth": 33,
  "retentionRate": 0.92,
  "timeline": [
    {
      "date": "2025-10-01",
      "members": 1217,
      "joins": 15,
      "leaves": 3
    }
  ]
}
```

#### Get Engagement Metrics
```http
GET /api/servers/:serverId/analytics/engagement?period=7d
```

#### Get Sentiment Analysis
```http
GET /api/servers/:serverId/analytics/sentiment?period=7d
```

#### Get Health Score
```http
GET /api/servers/:serverId/analytics/health
```

---

### Moderation

#### List Moderation Rules
```http
GET /api/servers/:serverId/moderation/rules
```

#### Create Moderation Rule
```http
POST /api/servers/:serverId/moderation/rules
```
**Body**:
```json
{
  "name": "Spam Detection",
  "type": "spam",
  "enabled": true,
  "action": "timeout",
  "duration": 3600,
  "threshold": 5
}
```

#### Get Audit Log
```http
GET /api/servers/:serverId/moderation/logs?limit=50&offset=0
```

---

### Members

#### List Members
```http
GET /api/servers/:serverId/members?search=username&role=moderator&limit=50
```

#### Get Member Profile
```http
GET /api/servers/:serverId/members/:memberId
```

#### Assign Role
```http
POST /api/servers/:serverId/members/:memberId/roles
```
**Body**:
```json
{
  "roleId": "role_id",
  "action": "add"
}
```

---

## 🚨 Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

- `401 UNAUTHORIZED` - Missing or invalid authentication
- `403 FORBIDDEN` - Insufficient permissions
- `404 NOT_FOUND` - Resource not found
- `429 RATE_LIMITED` - Too many requests
- `500 INTERNAL_ERROR` - Server error

---

**Last Updated**: October 3, 2025

*Note: This is a placeholder. Full API documentation will be generated automatically using tools like Swagger/OpenAPI.*
