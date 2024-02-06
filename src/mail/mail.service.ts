import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {
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

  async sendMailWithTemplate(to: string, subject: string, templateName: string, data: Record<string, any>): Promise<void> {
    try {
      const templatePath = `${__dirname}/templates/${templateName}.hbs`;
      const templateContent = readFileSync(templatePath, 'utf8');
      const compiledTemplate = handlebars.compile(templateContent);

      const html = compiledTemplate(data);
      const mailOptions: nodemailer.SendMailOptions = {
        from: this.config.get('MAIL_USERNAME'),
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log('Email sent successfully');
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }
}