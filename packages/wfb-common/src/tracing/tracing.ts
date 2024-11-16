import { logger } from '@simpplr/common-logger';
import { trace } from '@simpplr/tracing';

type TracingConfig = {
    serviceName: string;
};

export async function initializeTracing(config: TracingConfig) {
    try {
        logger.info(`initializeTracing: Start, OBSERVABILITY_ENABLED === ${process.env.OBSERVABILITY_ENABLED} `);
        const { serviceName } = config;

        trace.init({
            serviceName,
        });

        if (process.env.OBSERVABILITY_ENABLED === 'Y') {
            await trace.initInstruments({
                skipIncomingRequests: (req) => req.url?.startsWith('/health'),
            });
        }
        logger.info(`initializeTracing: End`);
    } catch (error) {
        logger.error({
            ref: `Error in initializeTracing: ${error.message}`,
            error,
        });
    }
}
