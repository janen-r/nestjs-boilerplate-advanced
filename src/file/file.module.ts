import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}