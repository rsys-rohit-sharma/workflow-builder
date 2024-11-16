import { Trace, TracingNamespaceKey } from '@simpplr/tracing';
import { UUID } from 'bson';

import { TRACING_HEADERS } from '../constants';
import {
    buildRequestContextFromTracingHeaders,
    getHeadersFromTracingNamespace,
    initTracing,
    setTracingHeaders,
} from './tracing-headers.helper';

jest.mock('../constants');

type TracingNSType = {
    get: (key: string) => unknown;
    set: (key: string, value: unknown) => void;
};

describe('setTracingHeaders', () => {
    const mockTracingNamespace = {
        get: jest.fn(),
        set: jest.fn(),
    };

    beforeEach(() => {
        TRACING_HEADERS.push({
            nsKey: 'myKey',
            requiredHeaderKey: 'header1',
            fallbackHeaderKey1: 'header2',
            fallbackHeaderKey2: 'header3',
            reqContextKey: 'header3',
        });
    });

    afterEach(() => {
        TRACING_HEADERS.pop();
        mockTracingNamespace.get.mockReset();
        mockTracingNamespace.set.mockReset();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('should not set headers if override is false and a value exists in namespace', () => {
        mockTracingNamespace.get.mockReturnValue('existingValue');
        setTracingHeaders(mockTracingNamespace, {}, false);
        expect(mockTracingNamespace.get).toHaveBeenCalledTimes(1);
        expect(mockTracingNamespace.get).toHaveBeenCalledWith('myKey');
        expect(mockTracingNamespace.set).not.toHaveBeenCalled();
    });

    it('should set the header from required key if present', () => {
        const headers = { header1: 'value1' };
        setTracingHeaders(mockTracingNamespace, headers, false);
        expect(mockTracingNamespace.set).toHaveBeenCalledTimes(1);
        expect(mockTracingNamespace.set).toHaveBeenCalledWith('myKey', 'value1');
    });

    it('should set the header from fallback key 1 if required key is missing', () => {
        const headers = { header2: 'value2' };
        setTracingHeaders(mockTracingNamespace, headers, false);
        expect(mockTracingNamespace.set).toHaveBeenCalledTimes(1);
        expect(mockTracingNamespace.set).toHaveBeenCalledWith('myKey', 'value2');
    });

    it('should set the header from fallback key 2 if both required and fallback 1 are missing', () => {
        const headers = { header3: 'value3' };
        setTracingHeaders(mockTracingNamespace, headers, false);
        expect(mockTracingNamespace.set).toHaveBeenCalledTimes(1);
        expect(mockTracingNamespace.set).toHaveBeenCalledWith('myKey', 'value3');
    });

    it('should not set any header if all keys are missing', () => {
        const headers = {};
        setTracingHeaders(mockTracingNamespace, headers, false);
        expect(mockTracingNamespace.set).not.toHaveBeenCalled();
    });

    it('should override existing value in namespace if override is true', () => {
        mockTracingNamespace.get.mockReturnValue('existingValue');
        const headers = { header1: 'newValue' };
        setTracingHeaders(mockTracingNamespace, headers, true);

        expect(mockTracingNamespace.set).toHaveBeenCalledTimes(1);
        expect(mockTracingNamespace.set).toHaveBeenCalledWith('myKey', 'newValue');
    });
});

describe('getHeadersFromTracingNamespace', () => {
    beforeEach(() => {
        TRACING_HEADERS.push(
            {
                nsKey: 'key1',
                reqContextKey: 'header1',
                requiredHeaderKey: 'header1',
                fallbackHeaderKey1: 'header2',
                fallbackHeaderKey2: 'header3',
            },
            {
                nsKey: 'key2',
                reqContextKey: 'header1',
                requiredHeaderKey: 'header1',
                fallbackHeaderKey1: 'header2',
                fallbackHeaderKey2: 'header3',
            },
        );
    });
    afterEach(() => {
        TRACING_HEADERS.pop();
        TRACING_HEADERS.pop();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('should return headers from tracing namespace', () => {
        const mockTracingNamespace = {
            set: jest.fn(),
            get: jest.fn().mockImplementation((key) => (key === 'key1' ? 'value1' : undefined)),
        };

        const headers = getHeadersFromTracingNamespace(mockTracingNamespace);
        expect(headers).toEqual({ header1: 'value1' });
        expect(mockTracingNamespace.get).toHaveBeenCalledWith('key1');
        expect(mockTracingNamespace.get).toHaveBeenCalledWith('key2');
    });

    it('should return an empty object if no headers are found', () => {
        const mockTracingNamespace = {
            set: jest.fn(),
            get: jest.fn().mockReturnValue(undefined),
        };
        const headers = getHeadersFromTracingNamespace(mockTracingNamespace);

        expect(headers).toEqual({});
        expect(mockTracingNamespace.get).toHaveBeenCalledWith('key1');
        expect(mockTracingNamespace.get).toHaveBeenCalledWith('key2');
    });
    it('should return an empty object if tracingNamespace not provided', () => {
        const headers = getHeadersFromTracingNamespace(null as unknown as TracingNSType);
        expect(headers).toEqual({});
    });
});

describe('buildRequestContextFromTracingHeaders', () => {
    beforeEach(() => {
        TRACING_HEADERS.push(
            {
                nsKey: 'key1',
                requiredHeaderKey: 'header1',
                fallbackHeaderKey1: 'header2',
                fallbackHeaderKey2: 'header3',
                reqContextKey: 'contextKey',
            },
            {
                nsKey: 'key2',
                requiredHeaderKey: 'header1',
                fallbackHeaderKey1: 'header2',
                fallbackHeaderKey2: 'header3',
                reqContextKey: 'contextKey',
            },
        );
    });

    afterEach(() => {
        TRACING_HEADERS.pop();
        TRACING_HEADERS.pop();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });
    it('should return headers from tracing namespace', () => {
        const mockTracingNamespace = {
            set: jest.fn(),
            get: jest.fn().mockImplementation((key) => (key === 'key1' ? 'value1' : undefined)),
        };

        const headers = buildRequestContextFromTracingHeaders(mockTracingNamespace);
        expect(headers).toEqual({ contextKey: 'value1' });
        expect(mockTracingNamespace.get).toHaveBeenCalledWith('key1');
        expect(mockTracingNamespace.get).toHaveBeenCalledWith('key2');
    });

    it('should return an empty object if no headers are found', () => {
        const mockTracingNamespace = {
            set: jest.fn(),
            get: jest.fn().mockReturnValue(undefined),
        };
        const headers = buildRequestContextFromTracingHeaders(mockTracingNamespace);

        expect(headers).toEqual({});
        expect(mockTracingNamespace.get).toHaveBeenCalledWith('key1');
        expect(mockTracingNamespace.get).toHaveBeenCalledWith('key2');
    });
});

describe('initTracing', () => {
    let callback: jest.Mock;
    const trace: Record<string, any> = {};
    beforeEach(() => {
        callback = jest.fn().mockResolvedValue(undefined);
        trace.init = jest.fn();
        trace.tracingNamespace = {
            runPromise: jest.fn(),
            runAndReturn: jest.fn(),
            run: jest.fn(),
            set: jest.fn(),
        };
        UUID.generate = jest.fn().mockReturnValue({ toString: () => 'generated-uuid' });
    });

    it('should initialize tracing with serviceName from environment variable', async () => {
        process.env.SERVICE_NAME = 'test-service';
        await initTracing(trace as Trace, callback);
        expect(trace.init).toHaveBeenCalledWith({ serviceName: 'test-service' });
    });

    it('should use provided serviceName if given', async () => {
        await initTracing(trace as Trace, callback, {
            serviceName: 'provided-service',
        });
        expect(trace.init).toHaveBeenCalledWith({
            serviceName: 'provided-service',
        });
    });

    it('should use generated correlationId if not provided', async () => {
        await initTracing(trace as Trace, callback);
        expect(trace.tracingNamespace.runPromise).toHaveBeenCalled();
        const runPromiseCallback = trace.tracingNamespace.runPromise.mock.calls[0][0];
        await runPromiseCallback();
        expect(trace.tracingNamespace.set).toHaveBeenCalledWith(TracingNamespaceKey.CORRELATION_ID, 'generated-uuid');
    });

    it('should use provided correlationId if given', async () => {
        await initTracing(trace as Trace, callback, {
            correlationId: 'provided-correlation-id',
        });
        expect(trace.tracingNamespace.runPromise).toHaveBeenCalled();
        const runPromiseCallback = trace.tracingNamespace.runPromise.mock.calls[0][0];
        await runPromiseCallback();
        expect(trace.tracingNamespace.set).toHaveBeenCalledWith(
            TracingNamespaceKey.CORRELATION_ID,
            'provided-correlation-id',
        );
    });

    it('should call callback in runPromise if asyncCb is true', async () => {
        await initTracing(trace as Trace, callback, { asyncCb: true });
        expect(trace.tracingNamespace.runPromise).toHaveBeenCalled();
        const runPromiseCallback = trace.tracingNamespace.runPromise.mock.calls[0][0];
        await runPromiseCallback();
        expect(callback).toHaveBeenCalled();
    });

    it('should call callback in runAndReturn if shouldReturn is true', async () => {
        await initTracing(trace as Trace, callback, {
            asyncCb: false,
            shouldReturn: true,
        });
        expect(trace.tracingNamespace.runAndReturn).toHaveBeenCalled();
        const runAndReturnCallback = trace.tracingNamespace.runAndReturn.mock.calls[0][0];
        await runAndReturnCallback();
        expect(callback).toHaveBeenCalled();
    });

    it('should call callback in run if asyncCb and shouldReturn are false', async () => {
        await initTracing(trace as Trace, callback, {
            asyncCb: false,
            shouldReturn: false,
        });
        expect(trace.tracingNamespace.run).toHaveBeenCalled();
        const runCallback = trace.tracingNamespace.run.mock.calls[0][0];
        runCallback();
        expect(callback).toHaveBeenCalled();
    });
});
