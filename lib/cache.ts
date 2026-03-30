import { Redis } from "@upstash/redis";

const CACHE_TTL = 5 * 60 * 1000;

const memoryCache = new Map<string, { data: any; timestamp: number }>();

let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) return null;

  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN || "",
    });
  }

  return redisClient;
}

export async function getCached(key: string) {
  const useRedis = process.env.CACHE_PROVIDER === "redis";

  if (useRedis) {
    const redis = getRedisClient();
    if (!redis) {
      console.warn("Redis not configured, falling back to memory cache");
      return getMemoryCached(key);
    }

    try {
      const data = await redis.get(key);
      return data;
    } catch (error) {
      console.error("Redis get failed:", error);
      return null;
    }
  } else {
    return getMemoryCached(key);
  }
}

export async function setCached(key: string, data: any) {
  const useRedis = process.env.CACHE_PROVIDER === "redis";

  if (useRedis) {
    const redis = getRedisClient();
    if (!redis) {
      console.warn("Redis not configured, falling back to memory cache");
      return setMemoryCached(key, data);
    }

    try {
      await redis.setex(key, 300, JSON.stringify(data));
    } catch (error) {
      console.error("Redis set failed:", error);
      setMemoryCached(key, data);
    }
  } else {
    setMemoryCached(key, data);
  }
}

export async function clearCached(key: string) {
  const useRedis = process.env.CACHE_PROVIDER === "redis";

  if (useRedis) {
    const redis = getRedisClient();
    if (!redis) {
      console.warn("Redis not configured, falling back to memory cache");
      return clearMemoryCached(key);
    }

    try {
      await redis.del(key);
    } catch (error) {
      console.error("Redis del failed:", error);
      clearMemoryCached(key);
    }
  } else {
    clearMemoryCached(key);
  }
}

function getMemoryCached(key: string) {
  const cached = memoryCache.get(key);

  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TTL) {
    memoryCache.delete(key);
    return null;
  }

  return cached.data;
}

function setMemoryCached(key: string, data: any) {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

function clearMemoryCached(key: string) {
  memoryCache.delete(key);
}
