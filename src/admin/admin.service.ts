import { Injectable, NotFoundException, Session, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponse } from '../interface/response.interface';
import { UserDocument, User } from '../schema/user.schema';
import { ConfigService } from '@nestjs/config';
import { IAuthUser } from '../interface/authUser.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly config: ConfigService
  ) {}

  async users(user: IAuthUser): Promise<IResponse> {

    const users = await this.userModel.find();
    const result = users.map((u:any) => {
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        userType: u.userType,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
      }
    });

    return { success: true, data: result };
  }

}