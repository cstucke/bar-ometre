# Redis

Redis is used only for short-lived data in Bar-ometre:

1. time-based event pop-ups
2. cached user search results

MongoDB remains the source of truth for bar data. Neo4j remains the source of truth for social graph data.

## Event Pop-Ups

Event pop-ups are stored as Redis keys that expire automatically when the event ends.

Key pattern:

```txt
eventpopup:<barId>:<eventId>
```

Example:

```txt
eventpopup:test-bar-1:happy-hour-test
```

The TTL is calculated from `endsAt - current time`. If `endsAt` is in the past, the API returns a validation error.

## Search Cache

User search results are cached temporarily so repeated searches can return without rerunning the MongoDB query.

Key pattern:

```txt
cache:search:<stableKey>
```

The default search cache TTL is 300 seconds.

## Environment

```env
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379
REDIS_SEARCH_CACHE_TTL_SECONDS=300
```

If Redis is disabled or unavailable, the server continues to run. Search requests fall back to MongoDB.

## Raw Redis Commands Implemented In Code

Redis commands are written as raw CLI-style command strings and executed with `client.sendCommand([...])`.

### Search Cache

```redis
GET cache:search:<stableKey>
SET cache:search:<stableKey> <json> EX 300
DEL cache:search:<stableKey>
```

The search cache commands are written directly in `searchCacheRepositoryRedis.js`.

### Event Pop-Ups

```redis
SET eventpopup:<barId>:<eventId> <json> EX <ttlSeconds>
GET eventpopup:<barId>:<eventId>
SCAN 0 MATCH eventpopup:* COUNT 100
DEL eventpopup:<barId>:<eventId>
```

The event popup commands are written directly in `eventRepositoryRedis.js`.

### Connection

```redis
PING
QUIT
```

The connection verification and shutdown commands are written directly in `redisClient.js`.

## Manual Redis CLI Tests

```bash
redis-cli ping

redis-cli --scan --pattern "eventpopup:*"
redis-cli --scan --pattern "cache:search:*"

redis-cli get "eventpopup:<barId>:<eventId>"
redis-cli ttl "eventpopup:<barId>:<eventId>"

redis-cli get "cache:search:<stableKey>"
redis-cli ttl "cache:search:<stableKey>"
```

Example event popup check:

```bash
redis-cli get "eventpopup:test-bar-1:happy-hour-test"
redis-cli ttl "eventpopup:test-bar-1:happy-hour-test"
```
