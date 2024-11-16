import { Injectable, OnModuleInit } from '@nestjs/common';
import { Headers, MessageBrokerClient } from '@simpplr/common-message-broker';

import { LoggerFactory } from '../logger';
import { FailureLogsDbService } from '../odm';
import { Initiable } from '../types';
import { ConsumerGroup, KafkaMessageHandler, Message, Topics } from './kafka.types';

@Injectable()
export class KafkaService implements Initiable, OnModuleInit {
    private readonly logger = LoggerFactory.getLogger('KafkaService');
    private messageBrokerClient: MessageBrokerClient;
    isInitialized = false;

    constructor(private readonly failureLogsDbService: FailureLogsDbService) {
        this.messageBrokerClient = new MessageBrokerClient();
    }

    async onModuleInit() {
        await this.initialize();
        this.logger.debug('onModuleInit');
    }

    async initialize(): Promise<this> {
        this.messageBrokerClient = await this.messageBrokerClient.init({
            host: process.env.KAFKA_HOST,
            localTesting: process.env.LOCAL_TESTING === 'Y',
            requestTimeout: 40000,
        });

        this.isInitialized = true;
        this.logger.debug('KafkaService:initialized');
        return this;
    }

    protected async _initializeKafkaClient() {
        if (this.messageBrokerClient) {
            return this.messageBrokerClient;
        }

        this.messageBrokerClient = await this.messageBrokerClient.init({
            host: process.env.KAFKA_HOST,
            localTesting: process.env.LOCAL_TESTING === 'Y',
            requestTimeout: 40000,
        });
        return this.messageBrokerClient;
    }

    async initProducer() {
        try {
            this.logger.debug(`Initialize Producer: start`);
            await this._initializeKafkaClient();
            await this.messageBrokerClient.producer.init();
            this.logger.debug(`Producer: ready`);
        } catch (err) {
            this.logger.error(`Producer: error: ${err}`);
            throw err;
        }
    }

    async initConsumer(
        msgHandler: KafkaMessageHandler,
        consumerGroup: ConsumerGroup,
        topics: Topics,
        options?: {
            autoCommit?: boolean;
            serviceName?: string;
        },
    ) {
        try {
            this.logger.debug(`Consumer client initializing`);
            await this._initializeKafkaClient();
            this.logger.log(`Subscribing to topics: ${topics}`);
            const { autoCommit = false, serviceName = process.env.SERVICE_NAME } = options || {};
            const consumer = await this.messageBrokerClient.consumer.init({
                serviceName,
                topics,
                consumerGroup,
                onMessageCallback: async (message: Message) => {
                    try {
                        await msgHandler(message);
                    } catch (error) {
                        this.logger.error(`KafkaEventProcessingErrorInWfb: Error processing kafka message: ${error}`);
                        await this.failureLogsDbService.createKafkaFailureLog(error, message);
                    }
                },
                autoCommit,
            });
            this.logger.debug(`Consumer Client ready`);
            return consumer;
        } catch (err) {
            this.logger.error(`Consumer: error: ${err}`);
            throw err;
        }
    }

    async closeKafkaClient() {
        if (this.messageBrokerClient.producer) {
            await this.messageBrokerClient.producer.closeConnection();
        }
        if (this.messageBrokerClient.consumer) {
            await this.messageBrokerClient.consumer.closeConnection();
        }
    }

    // eslint-disable-next-line consistent-return
    async sendMessageToKafka(
        topic: string,
        message: object,
        partitionKey?: string,
        headers?: Headers,
    ): Promise<object> {
        this.logger.debug(`In sendMessageToKafka()`);

        let { producer } = this.messageBrokerClient;
        if (!producer) {
            await this.initProducer();
            producer = this.messageBrokerClient.producer;
            this.messageBrokerClient.producer = producer;
        }

        this.logger.debug({ 'Message Content': message });
        try {
            const data = await producer.sendMessage({
                topic,
                value: message,
                key: partitionKey,
                headers,
            });

            this.logger.debug({ msg: `Message Success for Topic`, topic, message });
            return data;
        } catch (err) {
            this.logger.error(`Message Failure for Topic: ${topic}: ${err}`);
        }
    }

    async isConsumerHealthy() {
        return this.messageBrokerClient.consumer.isHealthy;
    }

    async isProducerHealthy(): Promise<boolean> {
        const connectionObj = await this.messageBrokerClient.producer.checkConnection();
        return Boolean(connectionObj);
    }
}
