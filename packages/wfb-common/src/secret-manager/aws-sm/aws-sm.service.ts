import {
    GetSecretValueCommand,
    GetSecretValueCommandOutput,
    SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { Injectable } from '@nestjs/common';

import { LoggerFactory } from '../../logger';
import { SecretGetter } from '../secret-getter.interface';
import { AwsSMError } from './aws-sm.error';

@Injectable()
export class AwsSMService implements SecretGetter {
    private readonly smClient: SecretsManagerClient;
    private readonly logger = LoggerFactory.getLogger(AwsSMService.name);

    constructor() {
        const { AWS_SM_REGION } = process.env;
        this.smClient = new SecretsManagerClient({ region: AWS_SM_REGION });
    }

    async getSecret<SecretValueType>(secretId: string): Promise<SecretValueType> {
        try {
            const { SecretString }: GetSecretValueCommandOutput = await this.smClient.send(
                new GetSecretValueCommand({ SecretId: secretId }),
            );
            const secretValueJson: SecretValueType = JSON.parse(SecretString);
            this.logger.debug({
                ref: 'Fetched Secret from AWS SM',
                secretId,
                secretValueKeys: Object.keys(secretValueJson),
            });
            return secretValueJson;
        } catch (err: unknown) {
            this.logger.error({ 'AwsSMService:getSecret:err': err, secretId });
            throw new AwsSMError((err as Error).message);
        }
    }
}
