import { ConfigService } from '@nestjs/config';
import { IResponse } from '../interface/response.interface';
export declare class FileService {
    private readonly config;
    constructor(config: ConfigService);
    streamFile(filename: string, res: any): void;
    uploadFile(filename: string): IResponse;
}
