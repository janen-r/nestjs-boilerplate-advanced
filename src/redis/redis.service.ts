import { Injectable } from '@nestjs/common';
import { RedisService as NestRedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RedisService {
  constructor(private readonly redisService: NestRedisService) {}

  private getClient() {
    return this.redisService.getClient();
  }

  async set(key: string, value: string): Promise<void> {
    await this.getClient().set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.getClient().get(key);
  }

  async remove(key: string): Promise<number> {
    return await this.getClient().del(key);
  }

}