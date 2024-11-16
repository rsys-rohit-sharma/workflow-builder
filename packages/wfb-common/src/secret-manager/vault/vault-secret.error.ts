export class VaultSecretError extends Error {
    constructor(message: string) {
        super(`VaultSecret: ${message}`);
    }
}
