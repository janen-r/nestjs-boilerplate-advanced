import { RedisService as NestRedisService } from '@liaoliaots/nestjs-redis';
export declare class RedisService {
    private readonly redisService;
    constructor(redisService: NestRedisService);
    private getClient;
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | null>;
    remove(key: string): Promise<number>;
}
