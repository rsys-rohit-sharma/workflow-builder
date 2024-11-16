import { Test, TestingModule } from '@nestjs/testing';

import { HarnessConfig, HarnessService } from '../harness';
import { LoggerAdapter, LoggerFactory } from '../logger';
import { AwsSMService } from './aws-sm/aws-sm.service';
import { SecretManagerService } from './secret-manager.service';
import { VaultService } from './vault/vault.service';

describe('SecretManagerService', () => {
    let service: SecretManagerService;
    const mockLogger = {
        debug: jest.fn(),
        error: jest.fn(),
    };

    jest.mock('./vault/vault.service');
    jest.mock('./aws-sm/aws-sm.service');
    jest.mock('../harness/harness.service');

    const mockVaultServiceObj = {
        initialize: jest.fn(),
        initiateConfiguration: jest.fn(),
        isInitialized: true,
        getSecret: jest.fn(),
    };
    const mockFFServiceObj = {
        getBooleanFlagValue: jest.fn(),
        configure: jest.fn(),
        isInitialized: true,
    };
    const mockAWSSMServiceObj = {
        getSecret: jest.fn(),
    };

    const harnessConfig: HarnessConfig = { sdkKey: 'test' };

    beforeEach(async () => {
        LoggerFactory.getLogger = () => mockLogger as unknown as LoggerAdapter;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SecretManagerService,
                {
                    provide: VaultService,
                    useValue: mockVaultServiceObj,
                },
                {
                    provide: AwsSMService,
                    useValue: mockAWSSMServiceObj,
                },
                {
                    provide: HarnessService,
                    useValue: mockFFServiceObj,
                },
            ],
        }).compile();
        service = module.get<SecretManagerService>(SecretManagerService);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('onModuleInit', async () => {
        process.env.LOCAL = '';
        service.initialize = jest.fn(() => Promise.resolve(service));
        mockLogger.debug = jest.fn();

        await service.onModuleInit();

        expect(service.initialize).toHaveBeenCalled();
        expect(mockLogger.debug).toHaveBeenCalled();
    });

    it('onModuleInit when LOCAL set true', async () => {
        service.initialize = jest.fn(() => Promise.resolve(service));
        mockLogger.debug = jest.fn();

        await service.onModuleInit();

        expect(service.initialize).toHaveBeenCalled();
        expect(mockLogger.debug).toHaveBeenCalled();
    });

    describe('initialize()', () => {
        it('initialize(): success', async () => {
            mockVaultServiceObj.isInitialized = true;
            mockFFServiceObj.isInitialized = false;
            mockFFServiceObj.configure.mockImplementationOnce(async () => {
                mockFFServiceObj.isInitialized = true;
            });
            mockVaultServiceObj.initiateConfiguration.mockResolvedValue(mockVaultServiceObj);
            mockLogger.debug = jest.fn();
            mockVaultServiceObj.getSecret.mockResolvedValue(harnessConfig);

            await service.initialize();

            expect(mockVaultServiceObj.initiateConfiguration).toHaveBeenCalled();
            expect(mockLogger.debug).toHaveBeenCalled();
            expect(service.isInitialized).toBeTruthy();
            expect(mockVaultServiceObj.getSecret).toHaveBeenCalledWith(process.env.VAULT_HARNESS_CREDS_KEY_NAME);
            expect(mockFFServiceObj.configure).toHaveBeenCalledWith(harnessConfig);
        });

        it('initialize(): already initialized', async () => {
            service.isInitialized = true;
            mockVaultServiceObj.isInitialized = true;
            mockVaultServiceObj.initiateConfiguration.mockResolvedValue(mockVaultServiceObj);
            mockLogger.debug = jest.fn();

            await service.initialize();

            expect(mockVaultServiceObj.initiateConfiguration).not.toHaveBeenCalled();
            expect(mockLogger.debug).not.toHaveBeenCalled();
            expect(service.isInitialized).toBeTruthy();
        });
    });

    describe('getSecret()', () => {
        it('Use awsSM.getSecret', async () => {
            mockAWSSMServiceObj.getSecret.mockResolvedValue({});
            mockFFServiceObj.getBooleanFlagValue.mockResolvedValue({});

            await service.getSecret('test', true);

            expect(mockFFServiceObj.getBooleanFlagValue).not.toHaveBeenCalled();
            expect(mockAWSSMServiceObj.getSecret).toHaveBeenCalled();
        });

        it('awsSM.getSecret when isVaultEnabled=false', async () => {
            mockAWSSMServiceObj.getSecret.mockResolvedValue({});
            mockVaultServiceObj.getSecret.mockResolvedValue({});
            mockFFServiceObj.getBooleanFlagValue.mockResolvedValue(false);

            await service.getSecret('test');

            expect(mockFFServiceObj.getBooleanFlagValue).toHaveBeenCalled();
            expect(mockVaultServiceObj.getSecret).not.toHaveBeenCalled();
            expect(mockAWSSMServiceObj.getSecret).toHaveBeenCalled();
        });

        it('vaultSM.getSecret when isVaultEnabled=true', async () => {
            mockAWSSMServiceObj.getSecret.mockResolvedValue({});
            mockVaultServiceObj.getSecret.mockResolvedValue({});
            mockFFServiceObj.getBooleanFlagValue.mockResolvedValue(true);

            await service.getSecret('test');

            expect(mockFFServiceObj.getBooleanFlagValue).toHaveBeenCalled();
            expect(mockVaultServiceObj.getSecret).toHaveBeenCalled();
            expect(mockAWSSMServiceObj.getSecret).not.toHaveBeenCalled();
        });
    });
});
