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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAdminStrategy = exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const auth_service_1 = require("../auth/auth.service");
const config_1 = require("@nestjs/config");
const jwtConfig = (configService) => {
    return {
        jwtFromRequest: (req) => {
            const tokenFromHeader = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(req);
            const session = req.session;
            if (!tokenFromHeader && session && session.accessToken) {
                return session.accessToken;
            }
            return tokenFromHeader;
        },
        ignoreExpiration: false,
        secretOrKey: configService.get('JWT_SECRET'),
        passReqToCallback: true
    };
};
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(authService, configService) {
        super(jwtConfig(configService));
        this.authService = authService;
        this.configService = configService;
    }
    async validate(request, payload) {
        const checkuserExist = await this.authService.checkuserExist(payload._id);
        if (!checkuserExist)
            throw new common_1.UnauthorizedException();
        if (checkuserExist.authKey != payload.authKey)
            throw new common_1.UnauthorizedException();
        return Object.assign({}, checkuserExist);
    }
};
JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService, config_1.ConfigService])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
let JwtAdminStrategy = class JwtAdminStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-admin') {
    constructor(authService, configService) {
        super(jwtConfig(configService));
        this.authService = authService;
        this.configService = configService;
    }
    async validate(request, payload) {
        const checkuserExist = await this.authService.checkuserExist(payload._id);
        if (!checkuserExist)
            throw new common_1.UnauthorizedException();
        if (checkuserExist.authKey != payload.authKey)
            throw new common_1.UnauthorizedException();
        else if (checkuserExist.userType != 'admin')
            throw new common_1.ForbiddenException("User is not an admin!");
        return Object.assign({}, checkuserExist);
    }
};
JwtAdminStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService, config_1.ConfigService])
], JwtAdminStrategy);
exports.JwtAdminStrategy = JwtAdminStrategy;
//# sourceMappingURL=jwt.strategy.js.map