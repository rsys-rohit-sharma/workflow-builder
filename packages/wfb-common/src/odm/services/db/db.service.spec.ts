import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientSession, Collection } from 'mongoose';

import { WfbException, ErrorCode } from '../../../exceptions';
import { LoggerFactory } from '../../../logger';
import { DbService } from './db.service';

describe('DbService', () => {
    const logger = LoggerFactory.getLogger('ODM Models Hook');
    let service: DbService;
    let session: Partial<ClientSession>;
    let mockCollection: Partial<Collection>;
    const dbConnectionObj = {
        readyState: 3,
        isConnected: true,
        close: jest.fn(),
        startSession: jest.fn(),
        collection: jest.fn(),
    };

    beforeEach(async () => {
        session = {
            withTransaction: jest.fn(),
            startTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };

        mockCollection = {
            listSearchIndexes: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue([]),
            }),
            createSearchIndexes: jest.fn().mockResolvedValue(undefined),
        };

        dbConnectionObj.collection = jest.fn().mockReturnValue(mockCollection);
        dbConnectionObj.startSession = jest.fn().mockResolvedValue(session);
        dbConnectionObj.close = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getConnectionToken(),
                    useValue: dbConnectionObj,
                },
                DbService,
            ],
        }).compile();

        service = module.get<DbService>(DbService);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        dbConnectionObj.close.mockClear();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be initialized', async () => {
        const serviceInstance = await service.initialize();
        expect(serviceInstance).toEqual(service);
    });

    it('Should get db from getDBConnection ', () => {
        const db = service.getDBConnection();
        expect(db).toEqual(dbConnectionObj);
        expect(db.readyState).toEqual(dbConnectionObj.readyState);
    });

    it('isDBAvailable: db available ', () => {
        dbConnectionObj.readyState = 1;
        const isDBAvailable = service.isDBAvailable();
        expect(isDBAvailable).toBeTruthy();
    });

    it('isDBAvailable: db not available ', () => {
        dbConnectionObj.readyState = 4;
        const isDBAvailable = service.isDBAvailable();
        expect(isDBAvailable).toBeFalsy();
    });

    it('checkConnection: db available ', async () => {
        dbConnectionObj.readyState = 1;
        const isDBAvailable = await service.checkConnection();
        expect(isDBAvailable).toBeTruthy();
    });

    it('checkConnection: db not available ', async () => {
        dbConnectionObj.readyState = 99;
        const exception = new WfbException(ErrorCode.DATABASE_ERROR);
        await expect(service.checkConnection()).rejects.toThrow(exception);
    });

    it('disconnect: connection closed ', async () => {
        await dbConnectionObj.close.withImplementation(
            () => 'temp',
            async () => {
                return dbConnectionObj.close(); // 'temp'
            },
        );
        service.disconnect = jest.fn(() => Promise.resolve());
        await service.disconnect();
        expect(service.disconnect).toHaveBeenCalled();
        expect(dbConnectionObj.close).toHaveBeenCalled();
    });

    it('disconnect: error in closing connection ', async () => {
        try {
            dbConnectionObj.close.mockImplementation(() => Promise.reject());
            await service.disconnect();
        } catch (error) {
            expect(dbConnectionObj.close).toHaveBeenCalled();
            logger.debug(expect(dbConnectionObj.close).rejects);
        }
    });

    it('isInitialized:true', () => {
        dbConnectionObj.readyState = 3;
        expect(service.isInitialized).toBeTruthy();
    });
    it('isInitialized:false', () => {
        dbConnectionObj.readyState = 4;
        expect(service.isInitialized).toBeFalsy();
    });

    it('should handle auto transactions', async () => {
        const callback = jest.fn();

        await service.withAutoTransaction(callback);

        expect(dbConnectionObj.startSession).toHaveBeenCalled();
        expect(session.withTransaction).toHaveBeenCalledWith(callback);
        expect(session.endSession).toHaveBeenCalled();
    });

    it('should handle manual transactions with error case', async () => {
        const businessCallback = jest.fn();
        const beforeAbortCallback = jest.fn();
        dbConnectionObj.startSession = jest.fn().mockResolvedValue(session);
        session.commitTransaction = jest.fn().mockRejectedValue(new Error('Test error'));

        try {
            await service.withManualTransaction(businessCallback, beforeAbortCallback);
        } catch (error) {
            expect(beforeAbortCallback).toHaveBeenCalledWith(error);
            expect(dbConnectionObj.startSession).toHaveBeenCalled();
            expect(session.startTransaction).toHaveBeenCalled();
            expect(session.abortTransaction).toHaveBeenCalled();
            expect(session.endSession).toHaveBeenCalled();
        }
    });

    it('should handle manual transactions with success case', async () => {
        const businessCallback = jest.fn();
        const beforeAbortCallback = jest.fn();
        dbConnectionObj.startSession = jest.fn().mockResolvedValue(session);
        session.commitTransaction = jest.fn().mockResolvedValue({});

        await service.withManualTransaction(businessCallback, beforeAbortCallback);

        expect(session.startTransaction).toHaveBeenCalled();
        expect(session.commitTransaction).toHaveBeenCalled();
        expect(session.endSession).toHaveBeenCalled();
        expect(beforeAbortCallback).not.toHaveBeenCalled();
        expect(session.abortTransaction).not.toHaveBeenCalled();
    });
});
