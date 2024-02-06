import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {

  logger = new Logger(AppService.name);
  getHello(): string {
    return 'Welcome to Nest App!';
  }
}