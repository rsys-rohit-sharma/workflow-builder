import { Logger, LogLevel } from '@simpplr/common-logger';
import { ffClient } from '@simpplr/ff-node-server-sdk';

import { LoggerAdapter } from './logger.adapter';

export class LoggerFactory {
    public static getLogger(scope?: string): LoggerAdapter {
        const logger = Logger.getInstance();
        const loggerAdapter = new LoggerAdapter(logger);

        if (scope) {
            loggerAdapter.setScope(scope);
        }

        return loggerAdapter;
    }

    public static async updateLogger(): Promise<LogLevel> {
        const newLogLevel = (await ffClient.evaluateStringFlag(
            `log_level_${process.env.SERVICE_NAME}`.toLowerCase().replace(/-/g, '_'),
            process.env.LOG_LEVEL,
        )) as LogLevel;

        const logger = Logger.getInstance();
        logger.debug({ msg: 'Updating log level', newLogLevel });
        logger.updateConfig({ logLevel: newLogLevel });

        return logger.logLevel;
    }
}
