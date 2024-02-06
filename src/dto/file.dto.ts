import { ApiProperty } from "@nestjs/swagger";

export class UploadDto {
    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File

    // NOTE: Add more fields here, if you need to upload additional params with file upload api
}