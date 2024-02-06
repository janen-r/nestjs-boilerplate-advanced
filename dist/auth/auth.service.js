"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("../schema/user.schema");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const jwt_1 = require("@nestjs/jwt");
const redis_service_1 = require("../redis/redis.service");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    constructor(userModel, config, jwtService, redisService, mailService) {
        this.userModel = userModel;
        this.config = config;
        this.jwtService = jwtService;
        this.redisService = redisService;
        this.mailService = mailService;
    }
    async register(registerDto) {
        const { name, email, password } = registerDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new Error('Email is already in use');
        }
        const encryptedPassword = bcrypt.hashSync(password, 10);
        const newUser = new this.userModel({ name, email, password: encryptedPassword });
        await newUser.save();
        this.mailService.sendMailWithTemplate(email, `Welcome to our platform`, 'welcome', { name });
        return { success: true, message: 'User registered successfully', data: {
                _id: newUser._id
            } };
    }
    async login(loginDto, session) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        user.authKey = (0, uuid_1.v4)();
        await user.save();
        const token = this.jwtService.sign({
            _id: user._id,
            email: user.email,
            authKey: user.authKey
        });
        session.accessToken = token;
        this.redisService.set(`user_${user._id.toString()}`, JSON.stringify({
            _id: user._id,
            email: user.email,
            name: user.name,
            userType: user.userType
        }));
        return { success: true, message: 'Login successful', data: { _id: user._id, token } };
    }
    async me(authUser) {
        let userData = await this.redisService.get(`user_${authUser._id.toString()}`);
        return { success: true, data: JSON.parse(userData) };
    }
    async checkuserExist(userId) {
        return await this.userModel.findById(userId).lean();
    }
    async logout(authUser, session) {
        const user = await this.userModel.findById(authUser._id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.authKey = undefined;
        await user.save();
        session.accessToken = null;
        this.redisService.remove(`user_${user._id.toString()}`);
        return { success: true, message: 'Logout successful' };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService,
        jwt_1.JwtService,
        redis_service_1.RedisService,
        mail_service_1.MailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map