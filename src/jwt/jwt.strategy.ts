import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ISession } from '../interface/session.interface';

/**
 * Common JWT token extraction for both user/admin strategy
 */
const jwtConfig = (configService: ConfigService) => {
  return {
    jwtFromRequest: (req: Request) => {
      // Try to extract token from Authorization header
      const tokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      const session = req.session as ISession;
    
      // If token is not found in Authorization header, try to get it from session
      if (!tokenFromHeader && session && session.accessToken) {
        return session.accessToken;
      }

      return tokenFromHeader;
    },
    ignoreExpiration: false,
    secretOrKey: configService.get('JWT_SECRET'),
    passReqToCallback: true
  }
}

/**
 * User - JWT Validation
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    super(jwtConfig(configService));
  }

  async validate(request: Request, payload: { _id: number, authKey: string, email: string }) {

    const checkuserExist = await this.authService.checkuserExist(payload._id)
    if(!checkuserExist) throw new UnauthorizedException();

    // if user loggedinto another device/logged out already
    if(checkuserExist.authKey != payload.authKey) throw new UnauthorizedException();

    return {
      ...checkuserExist
    };
  }
}

/**
 * Admin - JWT Validation
 */
@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    super(jwtConfig(configService));
  }

  async validate(request: Request, payload: { _id: number, authKey: string, email: string }) {

    const checkuserExist = await this.authService.checkuserExist(payload._id)
    if(!checkuserExist) throw new UnauthorizedException();

    // if user loggedinto another device/logged out already
    if(checkuserExist.authKey != payload.authKey) throw new UnauthorizedException();
    else if(checkuserExist.userType != 'admin') throw new ForbiddenException("User is not an admin!");

    return {
      ...checkuserExist
    };
  }
}