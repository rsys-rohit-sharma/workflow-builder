import { Test, TestingModule } from '@nestjs/testing';

import { AwsSMError } from './aws-sm.error';
import { AwsSMService } from './aws-sm.service';

jest.mock('@aws-sdk/client-secrets-manager', () => {
    class MockSecretsManagerClient {
        send: jest.Mock;
    }

    MockSecretsManagerClient.prototype.send = jest.fn();

    class MockGetSecretValueCommand {}

    return {
        SecretsManagerClient: MockSecretsManagerClient,
        GetSecretValueCommand: MockGetSecretValueCommand,
    };
});

describe('AwsSMService', () => {
    let service: AwsSMService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AwsSMService],
        }).compile();

        service = module.get<AwsSMService>(AwsSMService);
    });

    describe('getSecret', () => {
        it('should get a secret', async () => {
            const { SecretsManagerClient, GetSecretValueCommand } = jest.requireMock('@aws-sdk/client-secrets-manager');
            const testString = JSON.stringify({ test: 'test' });
            SecretsManagerClient.prototype.send.mockImplementationOnce(() =>
                Promise.resolve({ SecretString: testString }),
            );

            expect(await service.getSecret('test')).toStrictEqual(JSON.parse(testString));
            expect(SecretsManagerClient.prototype.send).toHaveBeenCalledWith(expect.any(GetSecretValueCommand));
        });

        it('should throw an error if it fails to retrieve secrets from AWS Secrets Manager', async () => {
            const { SecretsManagerClient } = jest.requireMock('@aws-sdk/client-secrets-manager');

            SecretsManagerClient.prototype.send.mockImplementationOnce(() => {
                throw new Error('Test error');
            });

            await expect(service.getSecret('test')).rejects.toThrow(AwsSMError);
        });
    });
});
