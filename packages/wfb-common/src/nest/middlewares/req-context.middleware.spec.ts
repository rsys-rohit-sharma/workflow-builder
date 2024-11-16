import { NextFunction } from 'express';

import { HEADER_VALUES, HEADERS } from '../../constants';
import { WfbRequest, WfbResponse } from '../../types';
import { RequestContextMiddleware } from './req-context.middleware';

describe('RequestContextMiddleware', () => {
    let mockRequest: WfbRequest;
    let mockResponse: WfbResponse;
    let nextFunction: NextFunction;
    let middleware: RequestContextMiddleware;
    const routeName = 'POST_/v1/wfb/workspaces';

    const mockLogger = {
        info: jest.fn(),
        debug: jest.fn(),
        error: jest.fn(),
    };

    jest.mock('../../logger', () => ({
        LoggerFactory: {
            getLogger: () => mockLogger,
        },
    }));

    jest.mock('../../utils/utility', () => ({
        getSchemaPaths: jest.fn().mockReturnValue(routeName),
    }));

    beforeEach(() => {
        middleware = new RequestContextMiddleware();
        mockRequest = {
            headers: {
                [HEADERS.ACCOUNT_ID]: 'accountId',
                [HEADERS.USER_ID]: 'userId',
                [HEADERS.USER_ROLE]: null,
                [HEADERS.HOST]: 'host',
                [HEADERS.FE_HOST]: 'feHost',
                [HEADERS.CORRELATION_ID]: 'correlationId',
                origin: 'origin',
            },
            url: '/v1/wfb/workspaces',
            path: '/v1/wfb/workspaces',
            baseUrl: '',
            method: 'POST',
            params: {},
            query: {},
        } as unknown as WfbRequest;

        mockResponse = {
            set: jest.fn(),
            startTime: jest.fn(),
            endTime: jest.fn(),
            setMetric: jest.fn(),
        } as unknown as WfbResponse;

        nextFunction = jest.fn();
    });

    it('should set request context correctly', async () => {
        const mockRequestWithoutAuthzCheck = {
            ...mockRequest,
            url: '/v1/testWorkspace',
            path: '/v1/testWorkspace',
        } as unknown as WfbRequest;

        await middleware.use(mockRequestWithoutAuthzCheck, mockResponse, nextFunction);

        expect(mockRequestWithoutAuthzCheck.context).toEqual({
            accountId: 'accountId',
            userId: 'userId',
            host: 'host',
            feHost: 'feHost',
            segmentId: null,
            hrtime: expect.arrayContaining([expect.any(Number)]),
            url: '/v1/testWorkspace',
            reqHeaders: mockRequest.headers,
            params: {},
            queryParam: mockRequest.query,
            userRole: null,
            workspaceId: null,
            correlationId: 'correlationId',
            serverTiming: {
                startTime: expect.any(Function),
                endTime: expect.any(Function),
                setMetric: expect.any(Function),
            },
        });
        expect(nextFunction).toHaveBeenCalled();
    });

    it('should set response headers correctly', async () => {
        await middleware.use(mockRequest, mockResponse, nextFunction);

        expect(mockResponse.set).toHaveBeenCalledWith(HEADERS.ACA_ORIGIN, 'origin');
        expect(mockResponse.set).toHaveBeenCalledWith(HEADERS.ACA_CREDENTIALS, 'true');
        expect(mockResponse.set).toHaveBeenCalledWith(
            HEADERS.X_XSS_PROTECTION,
            HEADER_VALUES[HEADERS.X_XSS_PROTECTION],
        );
        expect(mockResponse.set).toHaveBeenCalledWith(HEADERS.X_FRAME_OPTIONS, HEADER_VALUES[HEADERS.X_FRAME_OPTIONS]);
        expect(mockResponse.set).toHaveBeenCalledWith(
            HEADERS.STRICT_TRANSPORT_SECURITY,
            HEADER_VALUES[HEADERS.STRICT_TRANSPORT_SECURITY],
        );
        expect(mockResponse.set).toHaveBeenCalledWith(HEADERS.REFERRER_POLICY, HEADER_VALUES[HEADERS.REFERRER_POLICY]);
        expect(mockResponse.set).toHaveBeenCalledWith(HEADERS.CACHE_CONTROL, HEADER_VALUES[HEADERS.CACHE_CONTROL]);
        expect(mockResponse.set).toHaveBeenCalledWith(
            HEADERS.X_CONTENT_TYPE_OPTIONS,
            HEADER_VALUES[HEADERS.X_CONTENT_TYPE_OPTIONS],
        );
    });
});
