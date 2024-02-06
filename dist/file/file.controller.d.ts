/// <reference types="multer" />
import { FileService } from './file.service';
import { IResponse } from '../interface/response.interface';
import { UploadDto } from 'src/dto/file.dto';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFile(data: UploadDto, file: Express.Multer.File): Promise<IResponse>;
    readFile(filename: string, res: any): Promise<void>;
}
