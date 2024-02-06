import { Controller, Get, Body, Delete, Session, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { IResponse } from '../interface/response.interface';
import { JwtAdminAuthGuard } from '../jwt/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAdminAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async users(@Req() req): Promise<IResponse> {
    return await this.adminService.users(req.user);
  }
}