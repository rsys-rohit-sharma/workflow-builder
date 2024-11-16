import { Config } from './configuration.types';

export const TestConfig: Config = {
    env: 'test',
    nodeEnv: 'test',
    port: 3000,
    logLevel: 'debug',
    vaultSecretName: 'test',
    cache: {
        cacheCredsVaultKey: 'test',
        ttlInMs: 1000,
    },
    dataSource: {
        host: 'host',
        port: 5432,
        database: 'testDB',
        username: 'testUser',
        password: 'testPassword',
        mongoDbSecretName: 'test',
    },
    aws: {
        smHarnessCredsKeyName: 'test_sm_harness_key_name',
        smApiVersion: 'test',
        smKmsKeyId: 'test',
        smRegion: 'test',
    },
    vault: {
        harnessCredsKeyName: 'test_creds_key_name',
    },
    kafka: {
        host: 'test',
    },
};
