"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const config_1 = require("@nestjs/config");
const redis_service_1 = require("./redis.service");
let RedisModule = class RedisModule {
};
RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            nestjs_redis_1.RedisModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService, logger) => ({
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
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [redis_service_1.RedisService],
        exports: [nestjs_redis_1.RedisModule, redis_service_1.RedisService],
    })
], RedisModule);
exports.RedisModule = RedisModule;
//# sourceMappingURL=redis.module.js.map