import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

import { LoggerFactory } from '../logger';
import { ProbesService } from './probes.service';

@ApiTags('Health Probe')
@Controller('/')
export class ProbesController {
    private readonly logger = LoggerFactory.getLogger(ProbesController.name);

    constructor(private readonly probesService: ProbesService) {
        this.logger.debug(`constructor:${typeof this.probesService}`);
    }
    /**
     * We are having one health checkup at the root level / - responsible for showing our elb health to be "healthy"
     * and another one at /v1/wfb/health level - to be able to hit this endpoint to see the health response
     * @returns
     */
    @Get('/')
    @HealthCheck()
    serviceUpCheck() {
        return this.probesService.healthProbe();
    }

    @Get('/health')
    handleHealthCheck() {
        return this.probesService.healthProbe();
    }

    @Get('/startUpProbe')
    handleStartUpProbe() {
        return this.probesService.startUpProbe();
    }

    @Get('/livenessProbe')
    handleLivenessProbe() {
        return this.probesService.livenessProbe();
    }

    @Get('/readinessProbe')
    readinessProbeProbe() {
        return this.probesService.readinessProbe();
    }
}
