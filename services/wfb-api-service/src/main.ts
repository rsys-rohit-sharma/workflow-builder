import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { logger } from '@simpplr/common-logger';
import { requestLogInterceptor } from '@simpplr/common-logger/axios';
import { requestTraceInterceptor } from '@simpplr/tracing/axios';
import { requestTraceMiddleware } from '@simpplr/tracing/express';
import { initializeTracing } from '@simpplr/wfb-common';
import axios from 'axios';
import basicAuth from 'express-basic-auth';
import responseTime from 'server-timing';

import { AppModule } from './app.module';
import { API_BASE_PATH, PORT, SERVICE_NAME } from './constants/app.constant';

export async function bootstrap(): Promise<void> {
    await initializeTracing({ serviceName: SERVICE_NAME });

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger,
    });

    app.setGlobalPrefix(API_BASE_PATH, {
        exclude: ['/', '/health', '/startUpProbe', '/livenessProbe', '/readinessProbe'],
    });
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: false,
    });

    app.enableShutdownHooks();
    requestLogInterceptor(axios, { logger });
    app.use(requestTraceMiddleware({ serviceName: SERVICE_NAME }));
    app.use(responseTime());
    requestTraceInterceptor(axios);

    const apiDocUri = `${API_BASE_PATH}/docs/api`;
    const swaggerSetupOptions: SwaggerCustomOptions = {
        jsonDocumentUrl: `${apiDocUri}/json`,
        yamlDocumentUrl: `${apiDocUri}/yaml`,
    };

    const docBuilder = new DocumentBuilder().setTitle('Workflow Builder Api Service').setVersion('1.0');
    const document = SwaggerModule.createDocument(app, docBuilder.build(), {});

    // Temporary basic authentication for local use only. This will be removed in a future MR.
    // Provides basic authentication at the specified `apiDocUri` route.
    // The `admin` user with password `wfb` is defined for local testing purposes.
    app.use(
        `/${apiDocUri}`,
        basicAuth({
            challenge: true,
            users: {
                admin: 'wfb',
            },
        }),
    );

    SwaggerModule.setup(apiDocUri, app, document, swaggerSetupOptions);
    await app.listen(PORT);
    logger.info(`App started successfully at port: ${PORT}`);
}

bootstrap();
