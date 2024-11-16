import { type Static, Type } from '@sinclair/typebox';

const DataSourceConfigType = Type.Object({
    host: Type.Optional(Type.String()),
    port: Type.Optional(Type.Number()),
    database: Type.Optional(Type.String()),
    username: Type.Optional(Type.String()),
    password: Type.Optional(Type.String()),
    mongoDbSecretName: Type.String(),
});

const KafkaConfigType = Type.Object({
    host: Type.String(),
});

const AwsConfigType = Type.Object({
    smHarnessCredsKeyName: Type.String(),
    smApiVersion: Type.String(),
    smKmsKeyId: Type.String(),
    smRegion: Type.String(),
});

const VaultConfigType = Type.Object({
    harnessCredsKeyName: Type.String(),
});

const HarnessConfigType = Type.Object({
    sdkKey: Type.String(),
});

const CacheStoreConfigSchema = Type.Object({
    cacheCredsVaultKey: Type.String(),
    ttlInMs: Type.Number(),
});

const ConfigType = Type.Object({
    port: Type.Number(),
    env: Type.String(),
    nodeEnv: Type.Optional(Type.String()),
    logLevel: Type.String(),
    vaultSecretName: Type.String(),
    dataSource: DataSourceConfigType,
    vault: VaultConfigType,
    aws: AwsConfigType,
    kafka: KafkaConfigType,
    cache: CacheStoreConfigSchema,
});

export type DataSourceConfig = Static<typeof DataSourceConfigType>;
export type AwsConfig = Static<typeof AwsConfigType>;
export type VaultConfig = Static<typeof VaultConfigType>;
export type KafkaConfig = Static<typeof KafkaConfigType>;
export type HarnessConfig = Static<typeof HarnessConfigType>;
export type Config = Static<typeof ConfigType>;
export type SecretsManagerDBConfig = Static<typeof DataSourceConfigType>;

export const DataSourceConfigValidationSchema = DataSourceConfigType;
export const AWSConfigValidationSchema = AwsConfigType;
export const VaultConfigValidationSchema = VaultConfigType;
export const HarnessConfigValidationSchema = HarnessConfigType;
export const KafkaConfigValidationSchema = KafkaConfigType;
export const ConfigValidationSchema = ConfigType;
