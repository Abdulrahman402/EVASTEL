import { Injectable } from '@nestjs/common';
// import * as Redis from 'ioredis';
import { createClient } from 'redis';

@Injectable()
export class RedisCacheService {
  //   private readonly redisClient: Redis.Redis;

  //   constructor() {
  //     this.redisClient = Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  //   }

  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT as unknown as number,
    },
  });

  async onModuleInit() {
    console.log('Redis client connected');
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    console.log('Redis client disconnected');
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.connect();

    await this.redisClient.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }
}
