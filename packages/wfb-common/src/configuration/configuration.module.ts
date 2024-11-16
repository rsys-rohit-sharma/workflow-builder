import { DynamicModule, Global, Module } from '@nestjs/common';

import { HarnessModule, HarnessService } from '../harness';
import { validate } from '../schema-validator';
import { AwsSMService, SecretManagerModule, VaultService } from '../secret-manager';
import { BaseConfig } from './base.config';
import { ConfigValidationError } from './config-validation.error';
import { ConfigurationService } from './configuration.service';
import { Config, ConfigValidationSchema } from './configuration.types';
import { getEnvConfig } from './env.config';

@Global()
@Module({})
export class ConfigurationModule {
    static forRoot(): DynamicModule {
        const providers = [
            {
                provide: ConfigurationService,
                inject: [HarnessService, AwsSMService, VaultService],
                useFactory: async (harnessService: HarnessService, awsSM: AwsSMService, vaultSM: VaultService) => {
                    let config: Config;

                    if (process.env.LOCAL === 'true') {
                        config = BaseConfig;
                    } else {
                        config = await getEnvConfig(harnessService, awsSM, vaultSM);
                    }

                    const validationResult = validate(ConfigValidationSchema, config);
                    if (!validationResult.isValid) {
                        throw new ConfigValidationError(validationResult.errors);
                    }

                    return new ConfigurationService(config);
                },
            },
        ];

        return {
            module: ConfigurationModule,
            imports: [SecretManagerModule, HarnessModule],
            providers: providers,
            exports: [ConfigurationService],
        };
    }
}
