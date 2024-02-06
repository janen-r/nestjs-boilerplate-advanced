import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User, UserSchema } from 'src/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
    { name: User.name, schema: UserSchema }
    ])
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}