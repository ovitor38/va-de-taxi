import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
  private redis: Redis;
  private redisURI: string;

  constructor() {
    process.env.ENV === 'PROD'
      ? (this.redisURI = process.env.REDIS_URI)
      : (this.redisURI = '');
    this.redis = new Redis(this.redisURI);
  }

  async set(key: string, value: string): Promise<void> {
    try {
      this.redis.set(key, value, 'EX', 300);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const result = await this.redis.get(key);
      return result;
    } catch (error) {
      return null;
    } finally {
      this.redis.disconnect(true);
    }
  }
}
