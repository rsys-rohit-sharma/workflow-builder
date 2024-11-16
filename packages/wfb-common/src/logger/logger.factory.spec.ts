import { LoggerAdapter } from './logger.adapter';
import { LoggerFactory } from './logger.factory';

describe('LoggerFactory', () => {
    it('should return configured LoggerAdapter', () => {
        const result = LoggerFactory.getLogger();
        expect(result).toStrictEqual(expect.any(LoggerAdapter));
    });
});
