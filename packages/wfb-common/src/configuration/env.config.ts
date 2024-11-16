import { HarnessService } from '../harness';
import { AwsSMService, VaultConfig, VaultService } from '../secret-manager';
import { BaseConfig } from './base.config';
import { Config, HarnessConfig } from './configuration.types';

export const getEnvConfig = async (
    harnessService: HarnessService,
    awsSM: AwsSMService,
    vaultSM: VaultService,
): Promise<Config> => {
    const { VAULT_HARNESS_CREDS_KEY_NAME, VAULT_SECRET_NAME } = process.env;
    const vaultConfig: VaultConfig = await awsSM.getSecret<VaultConfig>(VAULT_SECRET_NAME);
    await vaultSM.configure(vaultConfig);

    const harnessConfig: HarnessConfig = await vaultSM.getSecret<HarnessConfig>(VAULT_HARNESS_CREDS_KEY_NAME);
    await harnessService.configure(harnessConfig);

    return BaseConfig;
};
