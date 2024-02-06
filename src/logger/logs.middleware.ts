import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
 
@Injectable()
class LogsMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
 
  use(request: Request, response: Response, next: NextFunction) {
    const startTime = process.hrtime();

    response.on('finish', () => {
      const { method, originalUrl } = request;
      const { statusCode, statusMessage } = response;
      
      const totalTime = process.hrtime(startTime);
      const totalTimeInMs = (totalTime[0] * 1e3 + totalTime[1] * 1e-6).toFixed(2);
      const contentLength = response.get('content-length');

      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage} ${totalTimeInMs}`;
 
      if (statusCode >= 500) {
        return this.logger.error(message);
      }
 
      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.log(message);
    });
    next();
  }
}
 
export default LogsMiddleware;