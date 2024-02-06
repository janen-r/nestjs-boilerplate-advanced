import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Get, Param, Res, BadRequestException, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { IResponse } from '../interface/response.interface';
import { isUploadingFileAllowed } from "../utils"
import { ApiTags, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { UploadDto } from 'src/dto/file.dto';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return callback(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (isUploadingFileAllowed(file.originalname)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Invalid file type'), false);
      }
    },
  }))
  @ApiConsumes('multipart/form-data')
  async uploadFile(@Body() data: UploadDto, @UploadedFile('file') file: Express.Multer.File): Promise<IResponse> {
    return this.fileService.uploadFile(file.filename);
  }

  @Get('read/:filename')
  // @UseGuards(JwtAuthGuard) NOTE: Enable this to make file read only to loggedin users. 
  async readFile(@Param('filename') filename: string, @Res() res): Promise<void> {
    this.fileService.streamFile(filename, res);
  }
}