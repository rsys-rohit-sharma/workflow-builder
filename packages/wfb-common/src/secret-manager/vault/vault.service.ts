import { Injectable } from '@nestjs/common';
import { SecretsManager } from '@simpplr/secrets-manager';

import { WfbException, ErrorCode } from '../../exceptions';
import { LoggerFactory } from '../../logger';
import { Configurable, Initiable } from '../../types';
import { AwsSMService } from '../aws-sm/aws-sm.service';
import { SecretGetter } from '../secret-getter.interface';
import { VaultConfig } from '../secret-manager.types';
import { VaultSecretError } from './vault-secret.error';

@Injectable()
export class VaultService implements SecretGetter, Initiable, Configurable<VaultConfig> {
    private readonly logger = LoggerFactory.getLogger(VaultService.name);
    private readonly secretsManager: SecretsManager;

    config: VaultConfig;
    isInitialized = false;

    constructor(private readonly awsSMService: AwsSMService) {
        this.secretsManager = new SecretsManager();
    }

    async configure(config: VaultConfig): Promise<this> {
        this.config = config;
        return this.initialize();
    }

    async initialize(): Promise<this> {
        if (this.isInitialized) {
            return this;
        }

        try {
            const { roleId, secretId, host } = this.config;
            await this.secretsManager.init({
                roleId,
                secretId,
                host,
            });
            this.isInitialized = true;
            this.logger.debug('initialized');
            return this;
        } catch (error) {
            throw new WfbException(ErrorCode.UNEXPECTED_ERROR, { cause: error });
        }
    }

    async getSecret<SecretValueType>(secretId: string): Promise<SecretValueType> {
        try {
            if (!this.isInitialized) {
                await this.initiateConfiguration();
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const { data } = await this.secretsManager.read<SecretValueType>({ path: secretId });
            this.logger.debug({
                ref: 'Fetched Secret from Vault SM',
                secretId,
                secretValueKeys: Object.keys(data),
            });
            return data;
        } catch (err: unknown) {
            this.logger.error({ 'VaultService:getSecret:err': err, secretId });
            throw new VaultSecretError((err as Error).message);
        }
    }

    async initiateConfiguration() {
        let { config } = this;
        if (!config) {
            const { VAULT_SECRET_NAME } = process.env;
            config = await this.awsSMService.getSecret<VaultConfig>(VAULT_SECRET_NAME);
        }

        return this.configure(config);
    }
}
