"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
let FileService = class FileService {
    constructor(config) {
        this.config = config;
    }
    streamFile(filename, res) {
        const fileStream = (0, fs_1.createReadStream)(`./uploads/${filename}`);
        fileStream.on('error', (error) => {
            throw new common_1.NotFoundException('File not found');
        });
        fileStream.pipe(res);
    }
    uploadFile(filename) {
        return {
            success: true,
            message: "File uploaded successfully",
            data: {
                filename,
                url: `${this.config.get('APP_URL')}/file/read/${filename}`
            }
        };
    }
};
FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileService);
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map