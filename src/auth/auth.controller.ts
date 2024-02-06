import { Controller, Post, Body, Delete, Session, Req, UseGuards, Put, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { IResponse } from '../interface/response.interface';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<IResponse> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Session() session: Record<string, any>): Promise<IResponse> {
    return await this.authService.login(loginDto, session);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req): Promise<IResponse> {
    return await this.authService.me(req.user);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req, @Session() session: Record<string, any>): Promise<IResponse> {
    return await this.authService.logout(req.user, session);
  }
}