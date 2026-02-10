# Migration from Vercel KV to Redis

## Overview

The newsletter system has been migrated from **Vercel KV** to **Redis**, providing more flexibility in where you deploy and better serverless compatibility.

## What Changed

### Removed
- `@vercel/kv` dependency from package.json

### Added
- `redis` (v4.6.0) package for direct Redis client
- `lib/redis.ts` - Singleton Redis client wrapper with connection pooling

### Updated Files

#### 1. **lib/redis.ts** (NEW)
Provides a single Redis client instance across all API routes:
```typescript
export async function getRedisClient(): Promise<RedisClientType>
```
- Singleton pattern prevents creating new connections for every request
- Handles connection once and reuses across serverless invocations
- Error handling built-in

#### 2. **app/api/newsletter/subscribe/route.ts**
- Changed: `import { kv } from '@vercel/kv'` → `import { getRedisClient } from '@/lib/redis'`
- Changed: `kv.hget()` → `redis.hGet()`
- Changed: `kv.hset()` → `redis.hSet()`
- Changed: `kv.hgetall()` → `redis.hGetAll()`
- Removed: Manual `redis.connect()` and `redis.disconnect()` calls

#### 3. **app/api/newsletter/digest/route.ts**
- Same import changes as subscribe route
- Redis client is now requested in helper functions (`getActiveSubscribers`, `getLastDigestTime`, `updateLastDigestTime`)
- All KV operations converted to Redis equivalents

#### 4. **app/api/newsletter/unsubscribe/route.ts**
- Same changes as other routes
- Both POST and GET handlers now use `getRedisClient()`

#### 5. **NEWSLETTER_SETUP.md** (Updated)
- All Vercel KV references replaced with Redis
- New setup instructions for Redis providers (Redis Cloud, Upstash, Railway, etc.)
- Updated troubleshooting section with Redis-specific guidance
- Cost section updated for Redis providers

## Environment Variables

### Before (Vercel KV)
```bash
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

### After (Redis)
```bash
REDIS_URL=redis://default:password@host:port
```

**Note**: Much simpler! Only one environment variable needed.

## Data Structure

Unchanged from user perspective - same Redis hash and string keys:
```
Hash Key: newsletter:subscribers
String Key: newsletter:last-digest-time
```

## Benefits

1. **Flexibility**: Use any Redis provider (Redis Cloud, Upstash, self-hosted, etc.)
2. **Simplicity**: Single environment variable instead of 4
3. **Cost**: Free tiers available from multiple providers
4. **Performance**: Direct Redis client is slightly more efficient than REST API wrapper
5. **Compatibility**: Works with any hosting platform, not just Vercel

## Deployment Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set `REDIS_URL` in your deployment environment (Vercel, Railway, etc.):
   ```bash
   redis://default:password@host:port
   ```

3. Deploy:
   ```bash
   git add .
   git commit -m "Migrate from Vercel KV to Redis"
   git push
   ```

4. Test:
   ```bash
   curl -X POST https://yourblog.com/api/newsletter/subscribe \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

## Redis Provider Recommendations

### **Redis Cloud** (Recommended)
- Free tier: 30MB storage
- Simple dashboard
- Good latency globally

### **Upstash**
- Free tier: Excellent for testing
- Supports Vercel integration
- Good for serverless

### **Railway**
- Free credits
- Easy deployment
- Simple pricing

### **Self-hosted**
- Full control
- Docker: `docker run -d -p 6379:6379 redis/redis-stack-server`
- Best for private deployments

## Backward Compatibility

The migration is fully backward compatible:
- Same API endpoints
- Same data format
- Same functionality
- Subscribers existing in Vercel KV need to be migrated to Redis (can be done via export/import or manually retrieval)

## Troubleshooting

### Connection Errors
```
error: getaddrinfo ENOTFOUND
```
Check that `REDIS_URL` is correct and Redis is accessible from your deployment environment.

### Cannot Parse REDIS_URL
```
Cannot parse REDIS_URL: Invalid URL format
```
The REDIS_URL must start with `redis://` or `rediss://` (for TLS) and follow the format:
```
redis://[username:password@]host[:port][/database]
```

Common issues:
- Missing `redis://` prefix
- Special characters in password not URL-encoded (use `encodeURIComponent()` for passwords with special characters)
- Invalid host or port format
- Extra spaces or newlines in the environment variable

### Authentication Failed
Verify the password in `REDIS_URL` is correct. Format: `redis://default:PASSWORD@host:port`

### Commands Timing Out
Could indicate Redis provider limits. Check your provider's logs and rate limits.

## Next Steps

1. Update environment variables in your deployment platform
2. Test newsletter subscription locally
3. Verify first cron job run (Monday 9 AM)
4. Monitor Redis usage in provider dashboard
