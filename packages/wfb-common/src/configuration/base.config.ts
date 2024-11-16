import { logger } from '@simpplr/common-logger';
import { config } from 'dotenv';
import path from 'path';

import { Config } from './configuration.types';

if (process.env.LOCAL === 'true') {
    const envPath = path.resolve(__dirname).split(`packages/`);
    logger.debug({ envPath });
    config({ path: `${envPath[0]}.env` });
}

export const BaseConfig: Config = {
    env: process.env.ENV,
    nodeEnv: process.env.NODE_ENV,
    port: +process.env.PORT,
    logLevel: process.env.LOG_LEVEL,
    vaultSecretName: process.env.VAULT_SECRET_NAME,
    cache: {
        cacheCredsVaultKey: `infra/${process.env.ENV?.toLowerCase()}/static/redis/zeus`,
        ttlInMs: process.env.CACHE_TTL_IN_MS ? +process.env.CACHE_TTL_IN_MS : 1000 * 60 * 60 * 24,
    },
    dataSource: {
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT || 27017,
        database: process.env.DB_NAME,
        username: process.env.DB_USER_NAME || 'yummy',
        password: process.env.DB_PASSWORD || 'yummy',
        mongoDbSecretName: process.env.MONGODB_SECRET_NAME,
    },
    aws: {
        smApiVersion: process.env.AWS_SM_API_VERSION,
        smKmsKeyId: process.env.AWS_SM_KMS_KEY_ID,
        smHarnessCredsKeyName: process.env.AWS_SM_HARNESS_CREDS_KEY_NAME,
        smRegion: process.env.AWS_SM_REGION,
    },
    vault: {
        harnessCredsKeyName: process.env.VAULT_HARNESS_CREDS_KEY_NAME,
    },
    kafka: {
        host: process.env.KAFKA_HOST,
    },
};
