import { Test, TestingModule } from '@nestjs/testing';
import { FFClient, ffClient as ffClientInstance } from '@simpplr/ff-node-server-sdk';

import { FeatureFlag } from '../constants';
import { HarnessService } from './harness.service';
import { FFTargetContext, HarnessConfig } from './harness.types';

jest.mock('@simpplr/ff-node-server-sdk', () => {
    class MockFFClient {
        init: jest.Mock;
        evaluateBooleanFlag: jest.Mock;
        addChangeListener: jest.Mock;
        evaluateStringFlag: jest.Mock;
    }
    MockFFClient.prototype.init = jest.fn();
    MockFFClient.prototype.evaluateBooleanFlag = jest.fn();
    MockFFClient.prototype.addChangeListener = jest.fn();
    MockFFClient.prototype.evaluateStringFlag = jest.fn();

    const mockFFClientInstance = new MockFFClient();

    return {
        ...jest.requireActual('@simpplr/ff-node-server-sdk'),
        FFClient: MockFFClient,
        ffClient: mockFFClientInstance,
    };
});

const harnessConfig: HarnessConfig = { sdkKey: 'test' };

describe('HarnessService', () => {
    let service: HarnessService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HarnessService, { provide: FFClient, useValue: ffClientInstance }],
        }).compile();

        service = module.get<HarnessService>(HarnessService);
        service.config = harnessConfig;
    });

    it('configure', async () => {
        service.initialize = jest.fn();
        await service.configure(harnessConfig);
        expect(service.initialize).toHaveBeenCalled();
    });

    it('should be able to init', async () => {
        const mockHarnessConfig: HarnessConfig = { sdkKey: 'test' };
        const { ffClient, ClientType } = jest.requireMock('@simpplr/ff-node-server-sdk');

        ffClient.init.mockImplementationOnce(() =>
            Promise.resolve({
                addChangeListener: jest.fn(),
            }),
        );

        ffClient.addChangeListener.mockImplementationOnce(() => Promise.resolve());
        await service.initialize();
        expect(ffClient.init).toHaveBeenCalledWith({
            ...mockHarnessConfig,
            type: ClientType.HARNESS,
        });
    });

    it('should return if already initialized', async () => {
        const { ffClient } = jest.requireMock('@simpplr/ff-node-server-sdk');

        ffClient.init.mockImplementationOnce(() =>
            Promise.resolve({
                addChangeListener: jest.fn(),
            }),
        );

        ffClient.addChangeListener.mockImplementationOnce(() => Promise.resolve());
        service.isInitialized = true;
        await service.initialize();
        expect(ffClient.init).not.toHaveBeenCalled();
    });

    describe('getBooleanFlag', () => {
        it('should be able to get boolean flag value without context', async () => {
            const { ffClient } = jest.requireMock('@simpplr/ff-node-server-sdk');
            const testResponse = true;
            ffClient.evaluateBooleanFlag.mockImplementationOnce(() => Promise.resolve(testResponse));
            ffClient.init.mockImplementationOnce(() => Promise.resolve(ffClient));

            expect(await service.getBooleanFlagValue(FeatureFlag.VAULT_ENABLED)).toBe(true);
            expect(ffClient.evaluateBooleanFlag).toHaveBeenCalledWith(FeatureFlag.VAULT_ENABLED, false, undefined);
        });

        it('should be able to get boolean flag value with req context', async () => {
            const { ffClient } = jest.requireMock('@simpplr/ff-node-server-sdk');
            const testResponse = true;
            ffClient.evaluateBooleanFlag.mockImplementationOnce(() => Promise.resolve(testResponse));
            ffClient.init.mockImplementationOnce(() => Promise.resolve(ffClient));
            const context: FFTargetContext = {
                req: new Map<string, string>([['accountId', '1']]),
            };

            expect(await service.getBooleanFlagValue(FeatureFlag.VAULT_ENABLED, context, true)).toBe(true);
            expect(ffClient.evaluateBooleanFlag).toHaveBeenCalledWith(FeatureFlag.VAULT_ENABLED, true, context);
        });
    });
});
