"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const logs_middleware_1 = require("./logger/logs.middleware");
const auth_module_1 = require("./auth/auth.module");
const admin_module_1 = require("./admin/admin.module");
const redis_module_1 = require("./redis/redis.module");
const cron_module_1 = require("./cron/cron.module");
const file_module_1 = require("./file/file.module");
const socket_module_1 = require("./socket/socket.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(logs_middleware_1.default)
            .forRoutes('*');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI, {
                connectionFactory: (connection) => {
                    if (connection.readyState === 1) {
                        common_1.Logger.log('MongoDB connected');
                    }
                    connection.on('disconnected', () => {
                        common_1.Logger.log('MongoDB disconnected');
                    });
                    return connection;
                },
            }),
            auth_module_1.AuthModule,
            admin_module_1.AdminModule,
            redis_module_1.RedisModule,
            cron_module_1.CronModule,
            file_module_1.FileModule,
            socket_module_1.SocketModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map