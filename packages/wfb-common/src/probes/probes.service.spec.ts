import { MongooseHealthIndicator } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

import { WfbException, ErrorCode } from '../exceptions';
import { HarnessService } from '../harness';
import { KafkaService } from '../kafka';
import { DbService } from '../odm';
import { SecretManagerService } from '../secret-manager';
import { StartUpProbeError } from './errors/startup-probe.error';
import { PROBE_OPTION_TOKEN } from './probe.constants';
import { ProbesService } from './probes.service';

describe('ProbesService', () => {
    let service: ProbesService;
    const mockVaultService = {
        isInitialized: true,
    };
    const mockDbService = {
        isInitialized: true,
        getDBConnection: jest.fn(),
        checkConnection: jest.fn(),
    };
    const mockMongooseHealth = {
        pingCheck: jest.fn(),
    };

    const mockHarnessService = {
        isInitialized: true,
        getBooleanFlagValue: jest.fn(),
    };

    const mockKafkaService = {
        isConsumerHealthy: jest.fn(),
        isProducerHealthy: jest.fn(),
        sendMessageToKafka: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProbesService,
                {
                    provide: HarnessService,
                    useValue: mockHarnessService,
                },
                { provide: SecretManagerService, useValue: mockVaultService },
                {
                    provide: DbService,
                    useValue: mockDbService,
                },
                { provide: MongooseHealthIndicator, useValue: mockMongooseHealth },
                { provide: KafkaService, useValue: mockKafkaService },
                {
                    provide: PROBE_OPTION_TOKEN,
                    useValue: { isConsumer: true, isProducer: true },
                },
            ],
        }).compile();

        service = module.get<ProbesService>(ProbesService);
        mockHarnessService.getBooleanFlagValue.mockResolvedValue(true);
        mockDbService.checkConnection.mockResolvedValue(true);
    });

    describe('startUpProbe', () => {
        it('should return a successful response in case everything is initialized', () => {
            const result = service.startUpProbe();

            expect(result).toEqual({ status: 'success' });
        });

        it('should throw an error in case something is not initialized', () => {
            mockVaultService.isInitialized = false;

            expect(() => service.startUpProbe()).toThrow(StartUpProbeError);
        });
    });

    describe('livenessProbe', () => {
        it('should throw liveness error in case some service throw error', async () => {
            const result = await service.livenessProbe();
            expect(result).toEqual({ status: 'success', message: 'Ready' });
        });
    });

    describe('readinessProbe', () => {
        it('should return a successful response', async () => {
            mockMongooseHealth.pingCheck.mockImplementationOnce(() => Promise.resolve(true));
            mockKafkaService.isConsumerHealthy.mockResolvedValue(true);
            mockKafkaService.isProducerHealthy.mockResolvedValue(true);

            const result = await service.readinessProbe();

            expect(result).toEqual({ status: 'success', message: 'Ready' });
        });

        it('should throw liveness error in case some service throw error', async () => {
            const exception = new WfbException(ErrorCode.DATABASE_ERROR);
            mockDbService.checkConnection.mockRejectedValue(exception);

            await expect(service.readinessProbe()).rejects.toThrow(WfbException);
        });

        it('should return a failure response if kafka consumer connection is unhealthy', async () => {
            mockMongooseHealth.pingCheck.mockImplementationOnce(() => Promise.resolve(true));
            mockKafkaService.isConsumerHealthy.mockResolvedValue(false);
            mockKafkaService.isProducerHealthy.mockResolvedValue(true);

            let err: WfbException | undefined;
            try {
                await service.readinessProbe();
            } catch (e) {
                err = e;
            }

            expect(err).toBeInstanceOf(WfbException);
            expect(JSON.stringify((err?.cause as any)?.message)).toEqual(
                '"External dependencies are not ready for kafka consumer"',
            );
        });

        it('should return a failure response if kafka producer connection is unhealthy', async () => {
            mockMongooseHealth.pingCheck.mockImplementationOnce(() => Promise.resolve(true));
            mockKafkaService.isConsumerHealthy.mockResolvedValue(true);
            mockKafkaService.isProducerHealthy.mockResolvedValue(false);

            let err: WfbException | undefined;
            try {
                await service.readinessProbe();
            } catch (e) {
                err = e;
            }

            expect(err).toBeInstanceOf(WfbException);
            expect(JSON.stringify((err?.cause as any)?.message)).toEqual(
                '"External dependencies are not ready for kafka producer"',
            );
        });
    });

    describe('healthProbe', () => {
        it('should return a successful response', async () => {
            mockMongooseHealth.pingCheck.mockImplementationOnce(() => Promise.resolve(true));
            mockKafkaService.isConsumerHealthy.mockResolvedValue(true);
            mockKafkaService.isProducerHealthy.mockResolvedValue(true);

            const result = await service.healthProbe();

            expect(result).toEqual({ status: 'success', message: 'Ready' });
        });

        it('should throw liveness error in case some service throw error', async () => {
            const exception = new WfbException(ErrorCode.DATABASE_ERROR);
            mockDbService.checkConnection.mockRejectedValue(exception);

            await expect(service.healthProbe()).rejects.toThrow(WfbException);
        });

        it('should return a failure response if kafka consumer connection is unhealthy', async () => {
            mockMongooseHealth.pingCheck.mockImplementationOnce(() => Promise.resolve(true));
            mockKafkaService.isConsumerHealthy.mockResolvedValue(false);
            mockKafkaService.isProducerHealthy.mockResolvedValue(true);

            let err: WfbException | undefined;
            try {
                await service.healthProbe();
            } catch (e) {
                err = e;
            }

            expect(err).toBeInstanceOf(WfbException);
            expect(JSON.stringify((err?.cause as any)?.message)).toEqual(
                '"External dependencies are not ready for kafka consumer"',
            );
        });

        it('should return a failure response if kafka producer connection is unhealthy', async () => {
            mockMongooseHealth.pingCheck.mockImplementationOnce(() => Promise.resolve(true));
            mockKafkaService.isConsumerHealthy.mockResolvedValue(true);
            mockKafkaService.isProducerHealthy.mockResolvedValue(false);

            let err: WfbException | undefined;
            try {
                await service.healthProbe();
            } catch (e) {
                err = e;
            }

            expect(err).toBeInstanceOf(WfbException);
            expect(JSON.stringify((err?.cause as any)?.message)).toEqual(
                '"External dependencies are not ready for kafka producer"',
            );
        });
    });
});
