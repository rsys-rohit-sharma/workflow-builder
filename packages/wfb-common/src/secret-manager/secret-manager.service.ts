import { Injectable, OnModuleInit } from '@nestjs/common';

import { FeatureFlag } from '../constants';
import { HarnessConfig, HarnessService } from '../harness';
import { LoggerAdapter, LoggerFactory } from '../logger';
import { Initiable } from '../types';
import { AwsSMService } from './aws-sm/aws-sm.service';
import { SecretGetter } from './secret-getter.interface';
import { VaultService } from './vault/vault.service';

@Injectable()
export class SecretManagerService implements SecretGetter, Initiable, OnModuleInit {
    private readonly logger: LoggerAdapter = LoggerFactory.getLogger(SecretManagerService.name);
    isInitialized: boolean = false;

    constructor(
        private readonly ff: HarnessService,
        private readonly awsSM: AwsSMService,
        private readonly vaultSM: VaultService,
    ) {}

    async onModuleInit() {
        if (process.env.LOCAL === 'true') {
            this.logger.debug('onModuleInit: Running on Local');
            return;
        }
        this.logger.debug('onModuleInit');
        await this.initialize();
    }

    async initialize(): Promise<this> {
        if (this.isInitialized) {
            return this;
        }

        await this.vaultSM.initiateConfiguration();
        if (this.vaultSM.isInitialized && !this.ff.isInitialized) {
            const harnessConfig: HarnessConfig = await this.vaultSM.getSecret<HarnessConfig>(
                process.env.VAULT_HARNESS_CREDS_KEY_NAME,
            );
            await this.ff.configure(harnessConfig);
        }

        this.isInitialized = this.vaultSM.isInitialized && this.ff.isInitialized;
        this.logger.debug({
            initialize: {
                isInitialized: this.isInitialized,
                vaultInitFlag: this.vaultSM.isInitialized,
                ffInitFlag: this.ff.isInitialized,
            },
        });

        return this;
    }

    async getSecret<SecretValueType>(secretName: string, useAWS = false): Promise<SecretValueType> {
        if (!this.isInitialized) {
            await this.initialize();
        }
        if (!useAWS) {
            const isVaultEnabled = await this.ff.getBooleanFlagValue(FeatureFlag.VAULT_ENABLED);
            if (isVaultEnabled) {
                return this.vaultSM.getSecret<SecretValueType>(secretName);
            }
        }
        return this.awsSM.getSecret<SecretValueType>(secretName);
    }
}
