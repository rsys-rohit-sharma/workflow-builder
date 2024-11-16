import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { FAILURE_LOG_TYPES } from '../../../constants';
import { Message } from '../../../kafka/kafka.types';
import { FailureLogs } from '../../models';
import { FailureLogsDbService } from './failure-logs-db.service';

const mockFailureLogsModel = {
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    find: jest.fn(),
};

describe('FailureLogsService', () => {
    let failureLogsService: FailureLogsDbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FailureLogsDbService,
                {
                    provide: getModelToken(FailureLogs.name),
                    useValue: mockFailureLogsModel,
                },
            ],
        }).compile();

        failureLogsService = module.get<FailureLogsDbService>(FailureLogsDbService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(failureLogsService).toBeDefined();
    });

    describe('createKafkaFailureLog', () => {
        it('should create a failure log with the correct payload', async () => {
            const mockError = new Error('Test error');

            const mockMessage: Message = {
                heartbeat: () => {},
                key: '',
                headers: { accountId: '123', eventType: 'test_event' },
                topic: 'test-topic',
                value: JSON.stringify({
                    payload: {
                        account_id: '123',
                        name: 'test',
                        topic_id: '5c859384-e6a1-42c8-9ad6-b2b0e9ee4df0',
                    },
                }),
            };
            const expectedPayload = expect.objectContaining({
                payload: mockMessage,
                headers: mockMessage.headers ?? {},
                topic: mockMessage.topic,
                originTimestamp: null,
                errorDetails: expect.any(Object),
                type: FAILURE_LOG_TYPES.KAFKA,
                serviceName: process.env.SERVICE_NAME,
                accountId: mockMessage.headers?.accountId,
                createdAt: expect.any(Number),
            });
            const expectedResult = {};
            mockFailureLogsModel.create.mockResolvedValue(expectedResult);

            const kafkaFailureLog = await failureLogsService.createKafkaFailureLog(mockError, mockMessage);

            expect(mockFailureLogsModel.create).toHaveBeenCalledWith(expectedPayload);
            expect(kafkaFailureLog).toBe(expectedResult);
        });
    });
});
