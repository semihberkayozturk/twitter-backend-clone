import redis from 'redis';
import { promisify } from 'util';

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT,
});
  
redisClient.on('connect', () => console.log('Redis Connection Is Successful!'));
redisClient.on('error', (err: Error) => console.log('Redis Client Error:', err));

const getAsync = promisify(redisClient.GET).bind(redisClient);
const setAsync = promisify(redisClient.SET).bind(redisClient);

const hgetAsync = promisify(redisClient.HGET).bind(redisClient);
const hsetAsync = promisify(redisClient.HSET).bind(redisClient);

export { getAsync, setAsync, redisClient, hgetAsync, hsetAsync };