import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>){}

  @Cron(CronExpression.EVERY_12_HOURS)
  async totalUsersCountCron() {
    const users = await this.userModel.countDocuments({});
    this.logger.log(`Counting total users for every 12 hours: ${users} users`);
  }
}