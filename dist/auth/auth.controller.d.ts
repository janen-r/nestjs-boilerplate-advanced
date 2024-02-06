import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { IResponse } from '../interface/response.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<IResponse>;
    login(loginDto: LoginDto, session: Record<string, any>): Promise<IResponse>;
    me(req: any): Promise<IResponse>;
    logout(req: any, session: Record<string, any>): Promise<IResponse>;
}
