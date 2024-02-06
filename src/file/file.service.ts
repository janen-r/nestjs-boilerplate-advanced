import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import { IResponse } from '../interface/response.interface';

@Injectable()
export class FileService {

  constructor(private readonly config: ConfigService){}

  streamFile(filename: string, res: any): void {
    const fileStream = createReadStream(`./uploads/${filename}`);

    fileStream.on('error', (error) => {
      throw new NotFoundException('File not found');
    });

    fileStream.pipe(res);
  }

  uploadFile(filename: string): IResponse {
    return {
        success: true,
        message: "File uploaded successfully",
        data: {
            filename,
            url: `${this.config.get('APP_URL')}/file/read/${filename}`
        }
    }
  }
}