import Redis from 'ioredis';

const redisClientSingleton = () => {
  if (!process.env.REDIS_URL) {
    console.warn('REDIS_URL is not defined. Caching will be disabled.');
    return null;
  }
  return new Redis(process.env.REDIS_URL, {
    connectTimeout: 5000,
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    // Prevents zombie connections in serverless environments
    keepAlive: 1000, 
  });
};

const globalForRedis = globalThis;

const redis = globalForRedis.redis ?? redisClientSingleton();

export default redis;

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
