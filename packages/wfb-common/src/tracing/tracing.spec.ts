import { logger } from '@simpplr/common-logger';
import { trace } from '@simpplr/tracing';

import { initializeTracing } from './tracing';

jest.mock('@simpplr/tracing', () => ({
    trace: {
        init: jest.fn(),
        initInstruments: jest.fn(),
    },
}));
jest.mock('@simpplr/common-logger', () => ({
    logger: {
        error: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
    },
}));

describe('initializeTracing', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize tracing with given config', async () => {
        const config = { serviceName: 'testService' };
        await initializeTracing(config);
        expect(trace.init).toHaveBeenCalledWith(config);
    });

    it('should initialize instruments if OBSERVABILITY_ENABLED is Y', async () => {
        process.env.OBSERVABILITY_ENABLED = 'Y';
        const config = { serviceName: 'testService' };
        await initializeTracing(config);
        expect(trace.initInstruments).toHaveBeenCalledWith(
            expect.objectContaining({
                skipIncomingRequests: expect.any(Function),
            }),
        );
    });

    it('should not initialize instruments if OBSERVABILITY_ENABLED is not Y', async () => {
        process.env.OBSERVABILITY_ENABLED = 'N';
        const config = { serviceName: 'testService' };
        await initializeTracing(config);
        expect(trace.initInstruments).not.toHaveBeenCalled();
    });

    it('should skip requests with url starting with /health', async () => {
        process.env.OBSERVABILITY_ENABLED = 'Y';
        const config = { serviceName: 'testService' };

        await initializeTracing(config);

        const mockInitInstruments = trace.initInstruments as jest.Mock;
        const skipIncomingRequests = mockInitInstruments.mock.calls[0][0].skipIncomingRequests;

        expect(skipIncomingRequests({ url: '/health' })).toBe(true);
        expect(skipIncomingRequests({ url: '/healthcheck' })).toBe(true);
        expect(skipIncomingRequests({ url: '/users' })).toBe(false);
        expect(skipIncomingRequests({ url: '/api/health' })).toBe(false);
    });

    it('should catch and log errors during initialization', async () => {
        process.env.OBSERVABILITY_ENABLED = 'Y';
        const errorMessage = 'Initialization failed';
        const error = new Error(errorMessage);
        trace.initInstruments = jest.fn().mockRejectedValue(error);
        const config = { serviceName: 'testService' };

        await initializeTracing(config);

        expect(logger.error).toHaveBeenCalledWith(
            expect.objectContaining({
                ref: `Error in initializeTracing: ${errorMessage}`,
                error,
            }),
        );
    });
});
