import { logger } from '@simpplr/common-logger';
import retry from 'async-retry';

export interface RetryConfig {
    retries?: number;
    minTimeout?: number;
    maxTimeout?: number;
    factor?: number;
    onRetry?: (error: any, attempt: number) => void;
    bailCondition?: (error: any) => boolean;
}

export async function tryWithRetry<T>(asyncFn: () => Promise<T>, config?: RetryConfig): Promise<T> {
    const defaultConfig: RetryConfig = {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 5000,
        factor: 2,
        onRetry: (error, attempt) => {
            logger.warn(`Default retry logic: Attempt #${attempt} failed with error: ${error.message}`);
        },
        bailCondition: () => {
            return false;
        },
    };

    const finalConfig = { ...defaultConfig, ...config };
    const { retries, minTimeout, maxTimeout, factor, onRetry, bailCondition } = finalConfig;

    return retry(
        async (bail) => {
            try {
                return await asyncFn();
            } catch (error) {
                if (bailCondition?.(error)) {
                    bail(error);
                }

                if (onRetry) {
                    onRetry(error, retries);
                }

                throw error;
            }
        },
        {
            retries,
            factor,
            minTimeout,
            maxTimeout,
            onRetry: (error: any, attempt: number) => {
                if (onRetry) {
                    onRetry(error, attempt);
                }
            },
        },
    );
}
