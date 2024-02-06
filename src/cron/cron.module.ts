import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schema/user.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({ 
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
    { name: User.name, schema: UserSchema }
    ]),
  ],
  providers: [CronService],
})
export class CronModule {}