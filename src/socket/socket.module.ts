import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, JwtModule],
  providers: [SocketGateway],
  exports: [SocketGateway]
})
export class SocketModule {}
