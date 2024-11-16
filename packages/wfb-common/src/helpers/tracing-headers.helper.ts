import { logger } from '@simpplr/common-logger';
import { Trace, TracingNamespaceKey } from '@simpplr/tracing';
import { UUID } from 'bson';

import { TRACING_HEADERS } from '../constants';
import { RequestContext } from '../types';

type TracingNSType = {
    get: (key: string) => unknown;
    set: (key: string, value: unknown) => void;
};

export function setTracingHeaders(tracingNamespace: TracingNSType, headers: Record<string, string>, override = false) {
    TRACING_HEADERS.forEach((header) => {
        const { nsKey, requiredHeaderKey, fallbackHeaderKey1, fallbackHeaderKey2 } = header;
        if (!override && tracingNamespace.get(nsKey)) return;

        const tracingHeaderValue =
            headers[requiredHeaderKey] || headers[fallbackHeaderKey1] || headers[fallbackHeaderKey2];
        if (tracingHeaderValue) {
            logger.debug(`Setting tracing namespace key ${nsKey} = ${tracingHeaderValue}`);
            tracingNamespace.set(nsKey, tracingHeaderValue);
        }
    });
}

export function buildRequestContextFromTracingHeaders(tracingNamespace: TracingNSType): RequestContext {
    const context: Record<string, string> = {};
    TRACING_HEADERS.forEach((header) => {
        const { nsKey, reqContextKey } = header;
        const tracingHeaderValue = tracingNamespace.get(nsKey);
        if (tracingHeaderValue) {
            context[reqContextKey] = tracingHeaderValue as string;
        }
    });
    logger.debug({
        ref: `buildRequestContextFromTracingHeaders`,
        context,
    });
    return context as unknown as RequestContext;
}

export function getHeadersFromTracingNamespace(tracingNamespace: TracingNSType): Record<string, string> {
    if (!tracingNamespace) {
        logger.error('Tracing namespace is not initialized.');
        return {};
    }
    const headers: Record<string, string> = {};
    TRACING_HEADERS.forEach((header) => {
        const { nsKey, requiredHeaderKey } = header;
        const tracingHeaderValue = tracingNamespace.get(nsKey);
        if (tracingHeaderValue) {
            headers[requiredHeaderKey] = tracingHeaderValue as string;
        }
    });
    logger.debug({
        ref: `getHeadersFromTracingNamespace`,
        headers,
    });
    return headers;
}

export async function initTracing(
    trace: Trace,
    callback: () => Promise<void>,
    options?: {
        asyncCb?: boolean;
        shouldReturn?: boolean;
        serviceName?: string;
        correlationId?: string;
    },
) {
    const {
        serviceName = process.env.SERVICE_NAME,
        asyncCb = true,
        shouldReturn = false,
        correlationId = process.env.CORRELATION_ID || UUID.generate().toString(),
    } = options || {};
    trace.init({
        serviceName,
    });
    const { tracingNamespace } = trace;
    if (asyncCb) {
        return tracingNamespace.runPromise(async () => {
            tracingNamespace.set(TracingNamespaceKey.CORRELATION_ID, correlationId);
            await callback();
        });
    }
    if (shouldReturn) {
        return tracingNamespace.runAndReturn(() => {
            tracingNamespace.set(TracingNamespaceKey.CORRELATION_ID, correlationId);
            return callback();
        });
    }
    return tracingNamespace.run(() => {
        tracingNamespace.set(TracingNamespaceKey.CORRELATION_ID, correlationId);
        callback();
    });
}
