import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://default:fZTevIGhebqmmAsXx4D5OxREZJbcJyci@redis-14364.c322.us-east-1-2.ec2.redns.redis-cloud.com:14364'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Connected...'));

await redisClient.connect();

export default redisClient;