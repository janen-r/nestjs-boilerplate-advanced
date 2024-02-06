import { extname } from 'path';

export const isUploadingFileAllowed = (filename) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.mp4', '.avi', '.mkv', '.mov'];
    const fileExtension = extname(filename).toLowerCase();
    return allowedExtensions.includes(fileExtension);
}