# =============================================================================
# EMPERIONE DISCORD - DOCKER COMPOSE QUICK REFERENCE
# =============================================================================

## Starting Services

# Start core services (PostgreSQL + Redis)
docker-compose up -d

# Start with GUI tools (includes pgAdmin + Redis Commander)
docker-compose --profile tools up -d

# Start specific service
docker-compose up -d postgres
docker-compose up -d redis

## Stopping Services

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v

## Viewing Logs

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f postgres
docker-compose logs -f redis

## Service Health Checks

# Check status of all services
docker-compose ps

# Check service health
docker-compose exec postgres pg_isready -U postgres
docker-compose exec redis redis-cli ping

## Accessing Services

### PostgreSQL
- Host: localhost
- Port: 5432
- User: postgres
- Password: password
- Database: emperione_db

Connection String:
postgresql://postgres:password@localhost:5432/emperione_db

### Redis
- Host: localhost
- Port: 6379
- Password: (none)

Connection String:
redis://localhost:6379

### pgAdmin (Optional - when started with --profile tools)
- URL: http://localhost:5050
- Email: admin@emperione.dev
- Password: admin

### Redis Commander (Optional - when started with --profile tools)
- URL: http://localhost:8081

## Useful Commands

# Execute PostgreSQL commands
docker-compose exec postgres psql -U postgres -d emperione_db

# Execute Redis commands
docker-compose exec redis redis-cli

# View container resource usage
docker-compose stats

# Restart services
docker-compose restart

# Rebuild and restart (if images updated)
docker-compose up -d --build

## Troubleshooting

# Remove all containers and start fresh
docker-compose down
docker-compose up -d

# View detailed container info
docker-compose exec postgres env
docker-compose exec redis redis-cli INFO

# Check network connectivity
docker-compose exec postgres ping redis
docker-compose exec redis ping postgres

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker volume rm emperione_postgres-data
docker-compose up -d

## Database Backups

# Backup PostgreSQL database
docker-compose exec postgres pg_dump -U postgres emperione_db > backup.sql

# Restore PostgreSQL database
docker-compose exec -T postgres psql -U postgres emperione_db < backup.sql

# Backup Redis data
docker-compose exec redis redis-cli SAVE
docker cp emperione-redis:/data/dump.rdb ./redis-backup.rdb

## Production Notes

1. Change default passwords in .env file
2. Use secrets management for sensitive data
3. Configure proper volume mounting for persistence
4. Set up automated backups
5. Use reverse proxy (nginx) for external access
6. Enable SSL/TLS for connections
7. Configure resource limits in docker-compose.yml
8. Use Docker secrets instead of environment variables

# =============================================================================
