import { Test, TestingModule } from '@nestjs/testing';

import { LoggerAdapter, LoggerFactory } from '../logger';
import { FailureLogsDbService } from '../odm';
import { KafkaService } from './kafka.service';
import { MockedConsumer, MockedProducer } from './mock-data';

jest.mock('@simpplr/common-message-broker', () => {
    const originalModule = jest.requireActual('@simpplr/common-message-broker');
    class MockedMessageBrokerClient {
        producer = new MockedProducer();
        consumer = new MockedConsumer();
        async init() {
            return {};
        }

        async initProducer() {
            return this.producer;
        }

        async initConsumer() {
            return this.consumer;
        }

        closeConnection = jest.fn().mockImplementation(async () => {});

        async sendMessage() {
            return {};
        }
    }

    return {
        ...originalModule,
        MessageBrokerClient: MockedMessageBrokerClient,
    };
});

describe('KafkaService', () => {
    let kafkaService: any = {} as KafkaService;
    let failureLogsDbService: FailureLogsDbService;

    const mockLogger = {
        debug: jest.fn(),
        error: jest.fn(),
        log: jest.fn(),
    };

    beforeEach(async () => {
        LoggerFactory.getLogger = () => mockLogger as unknown as LoggerAdapter;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KafkaService,
                {
                    provide: FailureLogsDbService,
                    useValue: {
                        createKafkaFailureLog: jest.fn(),
                    },
                },
            ],
        }).compile();

        kafkaService = module.get<KafkaService>(KafkaService);
        failureLogsDbService = module.get<FailureLogsDbService>(FailureLogsDbService);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should be defined', () => {
        expect(kafkaService).toBeDefined();
    });

    it('should initialize the service', async () => {
        await kafkaService.initialize();
        expect(kafkaService.isInitialized).toBeTruthy();
    });

    it('should initialize the producer', async () => {
        await kafkaService.initProducer();
        expect(mockLogger.debug).toHaveBeenCalledWith('Producer: ready');
    });

    it('should initialize the consumer', async () => {
        const msgHandler = jest.fn();
        const consumer = await kafkaService.initConsumer(msgHandler, 'test-group', ['test-topic']);
        expect(consumer).toBeDefined();
    });

    it('should close the Kafka client', async () => {
        await kafkaService.closeKafkaClient();
        expect(kafkaService.messageBrokerClient.producer.closeConnection).toHaveBeenCalled();
        expect(kafkaService.messageBrokerClient.consumer.closeConnection).toHaveBeenCalled();
    });

    it('should send a message to Kafka', async () => {
        const topic = 'test-topic';
        const message = { value: 'test-message' };
        const result = await kafkaService.sendMessageToKafka(topic, message);
        expect(result).toBeDefined();
    });

    it('should create a failure log if an error occurs in the message handler', async () => {
        const error = new Error('Test error');
        const mockMessageHandler = jest.fn().mockRejectedValue(error);
        const message = {
            key: 'testKey',
            value: 'testValue',
            topic: 'test-topic',
            partition: 0,
            offset: '0',
        };

        kafkaService.messageBrokerClient.consumer.init = jest.fn().mockImplementation(({ onMessageCallback }) => {
            onMessageCallback(message);
            return Promise.resolve({});
        });

        await kafkaService.initConsumer(mockMessageHandler, 'test-group', ['test-topic']);

        expect(failureLogsDbService.createKafkaFailureLog).toHaveBeenCalledWith(error, message);
    });
});
