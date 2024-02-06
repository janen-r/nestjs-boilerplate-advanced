/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { RegisterDto, LoginDto } from "../dto/auth.dto";
import { IResponse } from '../interface/response.interface';
import { UserDocument } from '../schema/user.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IAuthUser } from '../interface/authUser.interface';
import { RedisService } from '../redis/redis.service';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private readonly userModel;
    private readonly config;
    private jwtService;
    private readonly redisService;
    private readonly mailService;
    constructor(userModel: Model<UserDocument>, config: ConfigService, jwtService: JwtService, redisService: RedisService, mailService: MailService);
    register(registerDto: RegisterDto): Promise<IResponse>;
    login(loginDto: LoginDto, session: Record<string, any>): Promise<IResponse>;
    me(authUser: IAuthUser): Promise<{
        success: boolean;
        data: any;
    }>;
    checkuserExist(userId: any): Promise<import("mongoose").FlattenMaps<UserDocument> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    logout(authUser: IAuthUser, session: Record<string, any>): Promise<IResponse>;
}
