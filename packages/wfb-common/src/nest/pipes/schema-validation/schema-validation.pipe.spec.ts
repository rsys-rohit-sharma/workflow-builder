import { BadRequestException } from '@nestjs/common';

import { LoggerAdapter, LoggerFactory } from '../../../logger';
import { validate } from '../../../schema-validator';
import { SchemaValidationPipe } from './schema-validation.pipe';

jest.mock('../../../schema-validator', () => ({
    validate: jest.fn(),
}));

describe('SchemaValidationPipe', () => {
    let pipe: SchemaValidationPipe;
    const mockLogger = {
        debug: jest.fn(),
        error: jest.fn(),
    };
    beforeEach(() => {
        LoggerFactory.getLogger = () => mockLogger as unknown as LoggerAdapter;
        pipe = new SchemaValidationPipe({});
    });

    it('should be defined', () => {
        expect(pipe).toBeDefined();
    });

    it('should return the value if validation is successful', () => {
        (validate as jest.Mock).mockReturnValue({ isValid: true });
        const value = {};
        expect(pipe.transform(value)).toBe(value);
    });

    it('should throw BadRequestException if validation throws an error', () => {
        (validate as jest.Mock).mockImplementation(() => {
            throw new Error();
        });
        expect(() => pipe.transform({})).toThrow(BadRequestException);
    });

    it('should throw BadRequestException if validation is not successful', () => {
        (validate as jest.Mock).mockReturnValue({
            isValid: false,
            errors: 'error',
        });
        expect(() => pipe.transform({})).toThrow(BadRequestException);
    });
});
