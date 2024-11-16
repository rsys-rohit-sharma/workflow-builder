import { Logger } from '@simpplr/common-logger';

import { LoggerAdapter } from './logger.adapter';

describe('LoggerAdapter', () => {
    const testMessage = 'testMessage';
    const mockWinstonLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    } as unknown as Logger;
    const loggerAdapter = new LoggerAdapter(mockWinstonLogger);

    it('should call info method on winston logger in case of log', () => {
        loggerAdapter.log(testMessage);
        expect(mockWinstonLogger.info).toHaveBeenCalledWith(testMessage);
    });

    it('should call warn method on winston logger in case of warn', () => {
        loggerAdapter.warn(testMessage);
        expect(mockWinstonLogger.warn).toHaveBeenCalledWith(testMessage);
    });

    it('should call error method on winston logger in case of error', () => {
        loggerAdapter.error(testMessage);
        expect(mockWinstonLogger.error).toHaveBeenCalledWith(testMessage);
    });

    it('should call debug method on winston logger in case of debug', () => {
        loggerAdapter.debug(testMessage);
        expect(mockWinstonLogger.debug).toHaveBeenCalledWith(testMessage);
    });
});
