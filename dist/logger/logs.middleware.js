"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let LogsMiddleware = class LogsMiddleware {
    constructor() {
        this.logger = new common_1.Logger('HTTP');
    }
    use(request, response, next) {
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
};
LogsMiddleware = __decorate([
    (0, common_1.Injectable)()
], LogsMiddleware);
exports.default = LogsMiddleware;
//# sourceMappingURL=logs.middleware.js.map