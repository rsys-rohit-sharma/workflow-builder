import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { firstValueFrom, of } from 'rxjs';

import { Response, ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
    let interceptor: ResponseInterceptor<any>;
    let reflector: Reflector;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ResponseInterceptor,
                {
                    provide: Reflector,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);
        reflector = module.get<Reflector>(Reflector);
    });

    it('should be defined', () => {
        expect(interceptor).toBeDefined();
    });

    describe('intercept', () => {
        it('should add apiName to request context', async () => {
            const handlerMock = {
                getHandler: jest.fn(),
            };
            const getRequest = jest.fn().mockReturnValue({ context: {} });
            const contextMock: ExecutionContext = {
                switchToHttp: jest.fn().mockReturnValue({
                    getRequest,
                }),
                getHandler: jest.fn().mockReturnValue(handlerMock),
            } as unknown as ExecutionContext;
            const apiName = 'exampleApi';
            reflector.get = jest.fn().mockReturnValue(apiName);

            await firstValueFrom(
                interceptor.intercept(contextMock, {
                    handle: () => of({ status: 'success', message: 'OK', result: {} }),
                }),
            );

            expect(getRequest().context.apiName).toBe(apiName);
        });

        it('should transform response', async () => {
            const handlerMock = {
                getHandler: jest.fn(),
            };
            const contextMock = {
                switchToHttp: jest.fn().mockReturnThis(),
                getRequest: jest.fn().mockReturnValue({ context: { hrtime: process.hrtime() } }),
                getHandler: jest.fn().mockReturnValue(handlerMock),
            } as unknown as ExecutionContext;
            const response = { status: 'success', message: 'OK', result: {} };
            const transformedResponse: Response<unknown> = {
                apiName: 'exampleApi',
                status: response.status,
                message: response.message,
                result: response.result,
                responseTimeStamp: expect.any(Number),
                delay: expect.any(Number),
            } as unknown as Response<unknown>;
            reflector.get = jest.fn().mockReturnValue('exampleApi');

            const interceptedResponse = await firstValueFrom(
                interceptor.intercept(contextMock, { handle: () => of(response) }),
            );
            expect(interceptedResponse).toEqual(transformedResponse);
        });

        it('should transform response with empty message when message not provided', async () => {
            const handlerMock = {
                getHandler: jest.fn(),
            };
            const contextMock = {
                switchToHttp: jest.fn().mockReturnThis(),
                getRequest: jest.fn().mockReturnValue({ context: {} }),
                getHandler: jest.fn().mockReturnValue(handlerMock),
            } as unknown as ExecutionContext;
            const response = { status: 'success', result: {} };
            const transformedResponse: Response<unknown> = {
                apiName: 'exampleApi',
                status: response.status,
                message: '',
                result: response.result,
                responseTimeStamp: expect.any(Number),
                delay: 0,
            } as unknown as Response<unknown>;
            reflector.get = jest.fn().mockReturnValue('exampleApi');

            const interceptedResponse = await firstValueFrom(
                interceptor.intercept(contextMock, { handle: () => of(response) }),
            );
            expect(interceptedResponse).toEqual(transformedResponse);
        });
    });
});
