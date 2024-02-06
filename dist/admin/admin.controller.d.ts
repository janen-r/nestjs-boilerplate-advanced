import { AdminService } from './admin.service';
import { IResponse } from '../interface/response.interface';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    users(req: any): Promise<IResponse>;
}
