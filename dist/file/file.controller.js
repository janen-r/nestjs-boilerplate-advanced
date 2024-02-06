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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const file_service_1 = require("./file.service");
const jwt_auth_guard_1 = require("../jwt/jwt-auth.guard");
const utils_1 = require("../utils");
const swagger_1 = require("@nestjs/swagger");
const file_dto_1 = require("../dto/file.dto");
let FileController = class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    async uploadFile(data, file) {
        return this.fileService.uploadFile(file.filename);
    }
    async readFile(filename, res) {
        this.fileService.streamFile(filename, res);
    }
};
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return callback(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if ((0, utils_1.isUploadingFileAllowed)(file.originalname)) {
                callback(null, true);
            }
            else {
                callback(new common_1.BadRequestException('Invalid file type'), false);
            }
        },
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)('file')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_dto_1.UploadDto, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('read/:filename'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "readFile", null);
FileController = __decorate([
    (0, swagger_1.ApiTags)('File'),
    (0, common_1.Controller)('file'),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileController);
exports.FileController = FileController;
//# sourceMappingURL=file.controller.js.map