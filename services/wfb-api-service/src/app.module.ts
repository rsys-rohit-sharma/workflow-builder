import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { requestLogMiddleware } from '@simpplr/common-logger/express';
import { requestTraceMiddleware } from '@simpplr/tracing/express';
import {
    ConfigurationModule,
    ErrorHandlerFilter,
    HarnessModule,
    LoggerFactory,
    ODMModule,
    ProbesModule,
    RequestContextMiddleware,
    ResponseInterceptor,
    SecretManagerModule,
} from '@simpplr/wfb-common';

import { SERVICE_NAME } from './constants/app.constant';
import { WorkspaceModule } from './modules';

@Module({
    imports: [
        TerminusModule,
        SecretManagerModule,
        HarnessModule,
        ConfigurationModule.forRoot(),
        ProbesModule.register({ isConsumer: false, isProducer: false }),
        ODMModule,
        WorkspaceModule,
    ],
    providers: [
        { provide: APP_FILTER, useClass: ErrorHandlerFilter },
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    ],
})
export class AppModule {
    private readonly logger = LoggerFactory.getLogger('WfbApiModule');

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {
        this.logger.debug(`AppModule:constructor`);
    }

    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(
                RequestContextMiddleware,
                requestLogMiddleware(),
                requestTraceMiddleware({ serviceName: SERVICE_NAME }),
            )
            .exclude(
                '/',
                '(.*)health(.*)',
                '(.*)startUpProbe(.*)',
                '(.*)livenessProbe(.*)',
                '(.*)readinessProbe(.*)',
                '(.*)health',
                '(.*)startUpProbe',
                '(.*)livenessProbe',
                '(.*)readinessProbe',
                'health',
                'startUpProbe',
                'livenessProbe',
                'readinessProbe',
            )
            .forRoutes('*');
    }

    async beforeApplicationShutdown(signal?: string) {
        this.logger.log(`Received ${signal} signal. Gracefully shutting down the server.`);
        let connectionsCount = 0;
        do {
            connectionsCount = await new Promise<number>((resolve, reject) => {
                this.httpAdapterHost.httpAdapter.getHttpServer().getConnections((err: Error | null, count: number) => {
                    if (err) {
                        this.logger.error(`Error getting the server connections: ${JSON.stringify(err)}`);
                        return reject(err);
                    }
                    return resolve(count);
                });
            }).catch((err) => {
                this.logger.error(`Failed to retrieve connection count: ${err.message}`);
                return 0;
            });

            this.logger.log(`There are ${connectionsCount} open connections`);

            if (connectionsCount > 0) {
                this.logger.log(`Waiting 5 seconds more to close them.`);
                await new Promise((resolve) => {
                    setTimeout(resolve, 5000);
                });
            }
        } while (connectionsCount > 0);
    }
}
