import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import LogsMiddleware from './logger/logs.middleware';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { RedisModule } from './redis/redis.module';
import { CronModule } from './cron/cron.module';
import { FileModule } from './file/file.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionFactory: (connection: Connection) => {
        if (connection.readyState === 1) {
          Logger.log('MongoDB connected');
        }
        connection.on('disconnected', () => {
          Logger.log('MongoDB disconnected');
        });
        return connection;
      },
    }),
    AuthModule,
    AdminModule,
    RedisModule,
    CronModule,
    FileModule,
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogsMiddleware)
      .forRoutes('*')
  }
}
