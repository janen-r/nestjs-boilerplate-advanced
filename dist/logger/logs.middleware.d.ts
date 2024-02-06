import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
declare class LogsMiddleware implements NestMiddleware {
    private readonly logger;
    use(request: Request, response: Response, next: NextFunction): void;
}
export default LogsMiddleware;
