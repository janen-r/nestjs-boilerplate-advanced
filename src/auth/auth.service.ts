import { BadRequestException, Injectable, NotFoundException, Session, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from "../dto/auth.dto";
import { IResponse } from '../interface/response.interface';
import { UserDocument, User } from '../schema/user.schema';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { IAuthUser } from '../interface/authUser.interface';
import { RedisService } from '../redis/redis.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly config: ConfigService,
    private jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService
  ) {}

  async register(registerDto: RegisterDto): Promise<IResponse> {
    const { name, email, password } = registerDto;

    // Check if the email is already in use
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('Email is already in use');
    }

    // Encrypt the password
    const encryptedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = new this.userModel({ name, email, password: encryptedPassword });
    await newUser.save();

    // Sending welcome mail as background task
    this.mailService.sendMailWithTemplate(email, `Welcome to our platform`, 'welcome', { name });

    return { success: true, message: 'User registered successfully', data: {
      _id: newUser._id
    }};
  }

  async login(loginDto: LoginDto, session: Record<string, any>): Promise<IResponse> {
    const { email, password } = loginDto;

    // Find the user by email
    const user = await this.userModel.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    user.authKey = uuid();
    await user.save();

    // Generate JWT token, then store in session itself.
    const token = this.jwtService.sign({
        _id: user._id, 
        email: user.email,
        authKey: user.authKey
    });
    session.accessToken = token;

    // Store the data in redis
    this.redisService.set(`user_${user._id.toString()}`, JSON.stringify({
      _id: user._id, 
      email: user.email,
      name: user.name,
      userType: user.userType
    }));

    return { success: true, message: 'Login successful', data: { _id: user._id, token } };
  }

  // Get current user data from redis
  async me(authUser: IAuthUser) {
    let userData = await this.redisService.get(`user_${authUser._id.toString()}`);
    return { success: true, data: JSON.parse(userData) }
  }

  async checkuserExist(userId) {
    return await this.userModel.findById(userId).lean();
  }

  async logout(authUser: IAuthUser, session: Record<string, any>): Promise<IResponse> {

    // Remove the session token from the user's session
    const user = await this.userModel.findById(authUser._id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.authKey = undefined;
    await user.save();
    
    // Invalidate session
    session.accessToken = null;

    // Remove from redis as well
    this.redisService.remove(`user_${user._id.toString()}`);
    
    return { success: true, message: 'Logout successful' };
  }
}