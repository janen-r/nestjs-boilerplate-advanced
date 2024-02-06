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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs_1 = require("fs");
const config_1 = require("@nestjs/config");
let MailService = MailService_1 = class MailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(MailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            port: 465,
            secure: true,
            auth: {
                user: this.config.get('MAIL_USERNAME'),
                pass: this.config.get('MAIL_PASSWORD'),
            },
        });
    }
    async sendMailWithTemplate(to, subject, templateName, data) {
        try {
            const templatePath = `${__dirname}/templates/${templateName}.hbs`;
            const templateContent = (0, fs_1.readFileSync)(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(templateContent);
            const html = compiledTemplate(data);
            const mailOptions = {
                from: this.config.get('MAIL_USERNAME'),
                to,
                subject,
                html,
            };
            await this.transporter.sendMail(mailOptions);
            this.logger.log('Email sent successfully');
        }
        catch (error) {
            this.logger.error('Error sending email:', error);
        }
    }
};
MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map