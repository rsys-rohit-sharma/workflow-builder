import { Inject, Injectable } from '@nestjs/common';

import { WfbException, ErrorCode } from '../exceptions';
import { HarnessService } from '../harness';
import { KafkaService } from '../kafka';
import { LoggerFactory } from '../logger';
import { DbService } from '../odm';
import { SecretManagerService } from '../secret-manager';
import { Initiable } from '../types';
import { ProbeResponseDto } from './dto/probes-response.dto';
import { StartUpProbeError } from './errors/startup-probe.error';
import { PROBE_OPTION_TOKEN } from './probe.constants';
import { ProbesOptions } from './probes.types';

@Injectable()
export class ProbesService {
    private readonly logger = LoggerFactory.getLogger(ProbesService.name);

    constructor(
        private readonly dbService: DbService,
        private readonly harnessService: HarnessService,
        private readonly smService: SecretManagerService,
        private readonly kafkaService: KafkaService,
        @Inject(PROBE_OPTION_TOKEN) private readonly probeOptions: ProbesOptions,
    ) {}

    startUpProbe(): ProbeResponseDto {
        const initiableServices: Initiable[] = [this.harnessService, this.smService, this.dbService];

        initiableServices.forEach((initiableService) => {
            if (!initiableService.isInitialized) {
                throw new StartUpProbeError({
                    description: initiableService.constructor.name,
                });
            }
        });

        return {
            status: 'success',
        };
    }

    async healthProbe(): Promise<ProbeResponseDto> {
        return this._checkExternalDependencies();
    }

    async readinessProbe(): Promise<ProbeResponseDto> {
        return this._checkExternalDependencies();
    }

    async livenessProbe(): Promise<ProbeResponseDto> {
        return {
            status: 'success',
            message: 'Ready',
        };
    }

    protected async _checkExternalDependencies(): Promise<ProbeResponseDto> {
        try {
            const serviceNamesForErrorLog = ['db'];
            const dependencies = [
                this.dbService.checkConnection(),
                // this.harnessService.getBooleanFlagValue(FeatureFlag.VAULT_ENABLED),
            ];

            if (this.probeOptions.isConsumer) {
                dependencies.push(this.kafkaService.isConsumerHealthy());
                serviceNamesForErrorLog.push('kafka consumer');
            }

            if (this.probeOptions.isProducer) {
                dependencies.push(this.kafkaService.isProducerHealthy());
                serviceNamesForErrorLog.push('kafka producer');
            }

            const readinessResponses = await Promise.all(dependencies);
            const failedIndex = readinessResponses.findIndex((response) => !response);
            if (failedIndex !== -1) {
                throw new WfbException(ErrorCode.PROBES_ERROR, {
                    message: `External dependencies are not ready for ${serviceNamesForErrorLog[failedIndex]}`,
                });
            }
        } catch (err: unknown) {
            this.logger.error({
                msg: `Error checking external dependencies`,
                err,
                stringifyError: JSON.stringify(err),
            });
            throw new WfbException(ErrorCode.PROBES_ERROR, { cause: err });
        }

        return {
            status: 'success',
            message: 'Ready',
        };
    }
}
