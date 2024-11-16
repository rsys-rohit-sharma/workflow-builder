import { Test, TestingModule } from '@nestjs/testing';

import { ProbesController } from './probes.controller';
import { ProbesService } from './probes.service';

describe('ProbesController', () => {
    let controller: ProbesController;
    let mockHealthProbe: jest.Mock;
    let mockStartUpProbe: jest.Mock;
    let mockLivenessProbe: jest.Mock;
    let mockReadinessProbe: jest.Mock;

    beforeEach(async () => {
        mockHealthProbe = jest.fn();
        mockStartUpProbe = jest.fn();
        mockLivenessProbe = jest.fn();
        mockReadinessProbe = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProbesController],
            providers: [
                {
                    provide: ProbesService,
                    useValue: {
                        healthProbe: mockHealthProbe,
                        startUpProbe: mockStartUpProbe,
                        livenessProbe: mockLivenessProbe,
                        readinessProbe: mockReadinessProbe,
                    },
                },
            ],
        }).compile();

        controller = module.get<ProbesController>(ProbesController);
    });

    it('should handle healthcheck', async () => {
        await controller.handleHealthCheck();

        expect(mockHealthProbe).toHaveBeenCalled();
    });

    it('should handle serviceUpCheck', async () => {
        await controller.serviceUpCheck();

        expect(mockHealthProbe).toHaveBeenCalled();
    });

    it('should handle startup probe', () => {
        controller.handleStartUpProbe();

        expect(mockStartUpProbe).toHaveBeenCalled();
    });

    it('should handle liveness probe', async () => {
        await controller.handleLivenessProbe();

        expect(mockLivenessProbe).toHaveBeenCalled();
    });

    it('should handle readiness probe', async () => {
        await controller.readinessProbeProbe();

        expect(mockReadinessProbe).toHaveBeenCalled();
    });
});
