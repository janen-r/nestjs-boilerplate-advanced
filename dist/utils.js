"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUploadingFileAllowed = void 0;
const path_1 = require("path");
const isUploadingFileAllowed = (filename) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.mp4', '.avi', '.mkv', '.mov'];
    const fileExtension = (0, path_1.extname)(filename).toLowerCase();
    return allowedExtensions.includes(fileExtension);
};
exports.isUploadingFileAllowed = isUploadingFileAllowed;
//# sourceMappingURL=utils.js.map