import { Module, Global } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { Logger } from '@nestjs/common';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService, logger: Logger) => ({
        config: {
          url: configService.get('REDIS_URL')
        },
        onClientReady: (client) => {
          logger.log(`Connected to Redis server at ${client.options.host}:${client.options.port}`, 'RedisModule');
        },
        retryStrategy: (times) => {
          logger.warn(`Retry attempt ${times} to connect to Redis server`, 'RedisModule');
          return Math.min(times * 50, 2000);
        }
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [NestRedisModule, RedisService],
})
export class RedisModule {}