import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error('REDIS_URL environment variable is not set');
  }

  // Validate Redis URL format
  try {
    const url = new URL(redisUrl);
    if (url.protocol !== 'redis:' && url.protocol !== 'rediss:') {
      throw new Error(`Invalid Redis URL protocol: ${url.protocol}. Expected 'redis://' or 'rediss://'`);
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Cannot parse REDIS_URL: Invalid URL format. Expected format: redis://[username:password@]host[:port][/database]');
    }
    throw error;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = createClient({ url: redisUrl });

    redisClient.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    redisClient = null;
    if (error instanceof Error) {
      throw new Error(`Failed to connect to Redis: ${error.message}. Common causes: network connectivity issues, server unavailability, or incorrect credentials.`);
    }
    throw error;
  }
}
