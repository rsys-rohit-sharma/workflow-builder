export interface SecretGetter {
    getSecret<SecretValueType>(secretName: string, useVault?: boolean): Promise<SecretValueType>;
}
