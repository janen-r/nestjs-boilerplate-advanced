"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dotenv = require("dotenv");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: nest_winston_1.WinstonModule.createLogger({
            level: process.env.APP_ENV == 'dev' ? 'debug' : 'info',
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), nest_winston_1.utilities.format.nestLike(process.env.APP_NAME, {
                        colors: true,
                        prettyPrint: true,
                    })),
                })
            ],
        })
    });
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Main');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    app.use(cookieParser());
    app.enableCors({
        origin: configService.get('CORS_ORIGIN'),
        credentials: true,
    });
    app.use(session({
        secret: configService.get('APP_SESSION_SECRET'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000,
            httpOnly: true,
            secure: configService.get('APP_ENV') == 'dev' ? false : true
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('NestJs Backend App')
        .setDescription('Readymade Nest Js Boilerplate with Advanced Features Setup')
        .setVersion('1.0')
        .addBearerAuth()
        .addSecurityRequirements('bearer')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('swagger', app, document, { swaggerOptions: { persistAuthorization: true } });
    await app.listen(configService.get('APP_PORT'));
    logger.log(`Application is listening on port ${configService.get('APP_PORT')}`);
    logger.log(`Application is available on ${configService.get('APP_URL')}`);
}
bootstrap();
//# sourceMappingURL=main.js.map