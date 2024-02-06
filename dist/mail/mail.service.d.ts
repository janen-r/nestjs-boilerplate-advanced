import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly config;
    private transporter;
    private logger;
    constructor(config: ConfigService);
    sendMailWithTemplate(to: string, subject: string, templateName: string, data: Record<string, any>): Promise<void>;
}
