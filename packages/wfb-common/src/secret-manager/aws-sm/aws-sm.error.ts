export class AwsSMError extends Error {
    constructor(message: string) {
        super(`AwsSMError: ${message}`);
    }
}
