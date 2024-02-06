import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  
  // Create App
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: process.env.APP_ENV == 'dev' ? 'debug' : 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(process.env.APP_NAME, {
              colors: true,
              prettyPrint: true,
            }),
          ),
        })
      ],
    })
  });
  const configService = app.get<ConfigService>(ConfigService);
  const logger = new Logger('Main');

  // App config
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    credentials: true,
  });
  app.use(
    session({
      secret: configService.get('APP_SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
        httpOnly: true,
        secure: configService.get('APP_ENV') == 'dev' ? false : true
      },
    }),
  );

  // Swagger Config
  const config = new DocumentBuilder()
  .setTitle('NestJs Backend App')
  .setDescription('Readymade Nest Js Boilerplate with Advanced Features Setup')
  .setVersion('1.0')
  .addBearerAuth()
  .addSecurityRequirements('bearer')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, { swaggerOptions: { persistAuthorization: true } });

  // App port listening
  await app.listen(configService.get('APP_PORT'));
  logger.log(`Application is listening on port ${configService.get('APP_PORT')}`);
  logger.log(`Application is available on ${configService.get('APP_URL')}`);
}
bootstrap();
