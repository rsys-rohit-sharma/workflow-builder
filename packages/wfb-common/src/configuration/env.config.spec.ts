import { HarnessService } from '../harness';
import { AwsSMService, VaultService } from '../secret-manager';
import { HarnessConfig, VaultConfig } from './configuration.types';
import { getEnvConfig } from './env.config';

describe('getEnvConfig', () => {
    const mockHarnessService = {
        getBooleanFlagValue: jest.fn(),
        initialize: jest.fn(),
        configure: jest.fn(),
    };

    const mockSecretManagerService = {
        getSecret: jest.fn(),
    };

    const mockVaultService = {
        configure: jest.fn(),
        getSecret: jest.fn(),
    };

    const vaultConfig: VaultConfig = {
        harnessCredsKeyName: 'mockharnessCredsKeyName',
    };

    const harnessConfig: HarnessConfig = {
        sdkKey: 'mocksdkKey',
    };

    const mongoDBSecretName = 'test';

    beforeEach(() => {
        process.env.MONGODB_SECRET_NAME = mongoDBSecretName;
        mockVaultService.getSecret.mockResolvedValue(harnessConfig);
        mockSecretManagerService.getSecret.mockResolvedValue(vaultConfig);
    });

    it('should initialize HarnessService', async () => {
        mockHarnessService.initialize.mockImplementationOnce(() => null);
        await getEnvConfig(
            mockHarnessService as unknown as HarnessService,
            mockSecretManagerService as unknown as AwsSMService,
            mockVaultService as unknown as VaultService,
        );
        expect(mockHarnessService.configure).toHaveBeenCalledWith(harnessConfig);
        expect(mockVaultService.configure).toHaveBeenCalledWith(vaultConfig);
    });
});
