import { Model } from 'mongoose';
import { UserDocument } from '../schema/user.schema';
export declare class CronService {
    private readonly userModel;
    private readonly logger;
    constructor(userModel: Model<UserDocument>);
    totalUsersCountCron(): Promise<void>;
}
