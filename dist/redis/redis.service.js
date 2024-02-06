"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
let RedisService = class RedisService {
    constructor(redisService) {
        this.redisService = redisService;
    }
    getClient() {
        return this.redisService.getClient();
    }
    async set(key, value) {
        await this.getClient().set(key, value);
    }
    async get(key) {
        return await this.getClient().get(key);
    }
    async remove(key) {
        return await this.getClient().del(key);
    }
};
RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_redis_1.RedisService])
], RedisService);
exports.RedisService = RedisService;
//# sourceMappingURL=redis.service.js.map