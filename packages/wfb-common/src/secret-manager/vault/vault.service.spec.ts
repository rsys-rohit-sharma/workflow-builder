import { Test, TestingModule } from '@nestjs/testing';

import { AwsSMService } from '../aws-sm/aws-sm.service';
import { VaultConfig } from '../secret-manager.types';
import { VaultService } from './vault.service';
import { VaultSecretError } from './vault-secret.error';

jest.mock('@simpplr/secrets-manager', () => {
    class MockSecretsManager {
        init: jest.Mock;
        read: jest.Mock;
    }

    MockSecretsManager.prototype.init = jest.fn();
    MockSecretsManager.prototype.read = jest.fn();

    return {
        SecretsManager: MockSecretsManager,
    };
});

const mockVaultConfig: VaultConfig = {
    roleId: 'mockRoleId',
    secretId: 'mockSecretId',
    host: 'mockHost',
};

describe('VaultService', () => {
    let service: VaultService;

    const mockAWSSM = {
        getSecret: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VaultService,
                {
                    provide: AwsSMService,
                    useValue: mockAWSSM,
                },
            ],
        }).compile();

        service = module.get<VaultService>(VaultService);
        service.config = mockVaultConfig;
        mockAWSSM.getSecret.mockResolvedValue(mockVaultConfig);
    });

    it('should be able to init', async () => {
        const { SecretsManager } = jest.requireMock('@simpplr/secrets-manager');

        await service.initialize();
        expect(SecretsManager.prototype.init).toHaveBeenCalled();
    });

    it('configure', async () => {
        service.initialize = jest.fn();

        await service.configure(mockVaultConfig);
        expect(service.initialize).toHaveBeenCalled();
    });

    describe('getSecret', () => {
        it('should get a secret if initialization already done', async () => {
            const { SecretsManager } = jest.requireMock('@simpplr/secrets-manager');
            const testConfig = { test: 'test' };
            SecretsManager.prototype.read.mockImplementationOnce(() => Promise.resolve({ data: testConfig }));
            const secretKey = 'test';

            expect(await service.getSecret(secretKey)).toStrictEqual(testConfig);
            expect(SecretsManager.prototype.read).toHaveBeenCalledWith({
                path: secretKey,
            });
        });

        it('should get a secret if initialization not done', async () => {
            const { SecretsManager } = jest.requireMock('@simpplr/secrets-manager');
            service.isInitialized = false;
            service.config = null as unknown as VaultConfig;
            const testConfig = { test: 'test' };
            SecretsManager.prototype.read.mockImplementationOnce(() => Promise.resolve({ data: testConfig }));
            const secretKey = 'test';

            expect(await service.getSecret(secretKey)).toStrictEqual(testConfig);
            expect(SecretsManager.prototype.read).toHaveBeenCalledWith({
                path: secretKey,
            });
            expect(mockAWSSM.getSecret).toHaveBeenCalledWith(process.env.VAULT_SECRET_NAME);
            expect(SecretsManager.prototype.init).toHaveBeenCalled();
        });

        it('should throw an error if it fails to retrieve secrets from Vault', async () => {
            const { SecretsManager } = jest.requireMock('@simpplr/secrets-manager');

            SecretsManager.prototype.read.mockImplementationOnce(() => {
                throw new Error('Test error');
            });

            await expect(service.getSecret('test')).rejects.toThrow(VaultSecretError);
        });
    });
});
