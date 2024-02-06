import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAdminStrategy, JwtStrategy } from '../jwt/jwt.strategy';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
    { name: User.name, schema: UserSchema }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        global: true,
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: "30d" }
      }),
      inject: [ConfigService],
    }),
    MailModule
  ],
  providers: [AuthService, JwtStrategy, JwtAdminStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}