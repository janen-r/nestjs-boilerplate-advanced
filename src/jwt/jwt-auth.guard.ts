import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('jwt-admin') {}
