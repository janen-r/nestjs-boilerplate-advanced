import { Model } from 'mongoose';
import { IResponse } from '../interface/response.interface';
import { UserDocument } from '../schema/user.schema';
import { ConfigService } from '@nestjs/config';
import { IAuthUser } from '../interface/authUser.interface';
export declare class AdminService {
    private readonly userModel;
    private readonly config;
    constructor(userModel: Model<UserDocument>, config: ConfigService);
    users(user: IAuthUser): Promise<IResponse>;
}
