import { HttpException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

import { WfbException, ErrorCode } from '../../exceptions';
import { ErrorHandlerFilter } from './error-handler.filter';

describe('ErrorHandlerFilter', () => {
    let filter: ErrorHandlerFilter;

    beforeEach(() => {
        filter = new ErrorHandlerFilter();
    });

    describe('catch', () => {
        it('should handle SimpplrException', () => {
            const details = {
                test: 'test',
                message: 'Test exception',
                statusCode: 500,
            };
            const exception = new WfbException(ErrorCode.INTERNAL_SERVER_ERROR, {
                details,
            });
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };
            const host: ExecutionContextHost = {
                switchToHttp: () =>
                    ({
                        getResponse: jest.fn().mockReturnValue(res),
                        getRequest: jest.fn().mockReturnValue({
                            context: {
                                apiName: 'test-api',
                                hrtime: [0, 0],
                            },
                        }),
                    }) as unknown as HttpArgumentsHost,
            } as unknown as ExecutionContextHost;

            filter.catch(exception, host);

            expect(res.status).toHaveBeenCalledWith(exception.getStatus());
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Internal Server Error',
                errors: [
                    {
                        apiName: 'test-api',
                        message: 'An internal server error occurred.',
                        code: ErrorCode.INTERNAL_SERVER_ERROR,
                        details,
                    },
                ],
                timestamp: expect.any(Number),
                delay: expect.any(Number),
            });
        });

        it('Not Validation Failed message: should handle HttpException', () => {
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const details = {
                test: 'test',
                message: 'Test exception',
                statusCode: 400,
            };
            const cause = new Error('Test cause');
            const exception = new HttpException(details, 400, { cause });
            const host: ExecutionContextHost = {
                switchToHttp: () =>
                    ({
                        getResponse: jest.fn().mockReturnValue(mockResponse),
                        getRequest: jest.fn().mockReturnValue({
                            context: {
                                apiName: 'test-api',
                                hrtime: [0, 0],
                            },
                        }),
                    }) as unknown as HttpArgumentsHost,
            } as unknown as ExecutionContextHost;

            filter.catch(exception, host);

            expect(mockResponse.status).toHaveBeenCalledWith(exception.getStatus());
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Test exception',
                errors: [
                    {
                        apiName: 'test-api',
                        message: 'An error occurred while processing the request.',
                        code: 'BadRequest',
                        details: { test: details.test },
                    },
                ],
                timestamp: expect.any(Number),
                delay: expect.any(Number),
            });
        });
        it('With Validation Failed message: should handle HttpException', () => {
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const details = {
                test: 'test',
                message: 'Validation failed',
                statusCode: 400,
            };
            const cause = new Error('Validation failed');
            const exception = new HttpException(details, 400, { cause });
            const host: ExecutionContextHost = {
                switchToHttp: () =>
                    ({
                        getResponse: jest.fn().mockReturnValue(mockResponse),
                        getRequest: jest.fn().mockReturnValue({
                            context: {
                                apiName: 'test-api',
                                hrtime: [0, 0],
                            },
                        }),
                    }) as unknown as HttpArgumentsHost,
            } as unknown as ExecutionContextHost;

            filter.catch(exception, host);

            expect(mockResponse.status).toHaveBeenCalledWith(exception.getStatus());
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'error',
                message: cause.message,
                errors: [
                    {
                        apiName: 'test-api',
                        message: 'An error occurred while processing the request.',
                        code: ErrorCode.INVALID_INPUT,
                        cause: exception.cause,
                        details: { test: details.test },
                    },
                ],
                timestamp: expect.any(Number),
                delay: expect.any(Number),
            });
        });

        it('should handle other errors', () => {
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const error = new Error('Test error');
            const host: ExecutionContextHost = {
                switchToHttp: () =>
                    ({
                        getResponse: jest.fn().mockReturnValue(mockResponse),
                        getRequest: jest.fn().mockReturnValue({
                            context: {
                                apiName: 'test-api',
                                hrtime: [0, 0],
                            },
                        }),
                    }) as unknown as HttpArgumentsHost,
            } as unknown as ExecutionContextHost;

            filter.catch(error, host);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Test error',
                errors: [
                    {
                        apiName: 'test-api',
                        message: 'An error occurred while processing the request.',
                        code: ErrorCode.INTERNAL_SERVER_ERROR,
                        details: null,
                    },
                ],
                timestamp: expect.any(Number),
                delay: expect.any(Number),
            });
        });
    });
});
