import { LoggerService } from '@nestjs/common';
import {
    Logger as SimpplrLogger,
    loggingNamespace,
    LoggingNamespaceKey,
    LogLevel,
    Scope,
} from '@simpplr/common-logger';

export class LoggerAdapter implements LoggerService {
    private scope?: string;
    constructor(private readonly loggerInstance: SimpplrLogger) {}

    private printLog(level: LogLevel, message: unknown) {
        if (this.scope) {
            loggingNamespace.run(() => {
                const parentScopes: Scope = loggingNamespace.get(LoggingNamespaceKey.SCOPES) || [];
                loggingNamespace.set(LoggingNamespaceKey.SCOPES, [...parentScopes, this.scope]);
                this.loggerInstance[level](message);
            });
            return;
        }

        this.loggerInstance[level](message);
    }

    private escapeNewlineCharacters(message: unknown): string {
        if (typeof message === 'string') {
            return message.replace(/\n/g, '\\n');
        }
        return message as string;
    }

    setScope(scope: string) {
        this.scope = scope;
    }

    log(message: unknown) {
        this.printLog(LogLevel.INFO, this.escapeNewlineCharacters(message));
    }
    error(message: unknown) {
        this.printLog(LogLevel.ERROR, this.escapeNewlineCharacters(message));
    }
    warn(message: unknown) {
        this.printLog(LogLevel.WARN, this.escapeNewlineCharacters(message));
    }
    debug(message: unknown) {
        this.printLog(LogLevel.DEBUG, this.escapeNewlineCharacters(message));
    }
}
