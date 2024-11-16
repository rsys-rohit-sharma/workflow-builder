import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HarnessModule } from '../harness';
import { KafkaModule } from '../kafka';
import { ODMModule } from '../odm';
import { SecretManagerModule } from '../secret-manager';
import { PROBE_OPTION_TOKEN } from './probe.constants';
import { ProbesController } from './probes.controller';
import { ProbesService } from './probes.service';
import { ProbesOptions } from './probes.types';

@Module({
    imports: [TerminusModule, HarnessModule, SecretManagerModule, ODMModule, KafkaModule],
    controllers: [ProbesController],
    providers: [ProbesService],
    exports: [ProbesService],
})
export class ProbesModule {
    static register(options: ProbesOptions) {
        return {
            module: ProbesModule,
            providers: [
                {
                    provide: PROBE_OPTION_TOKEN,
                    useValue: options,
                },
                ProbesService,
            ],
        };
    }
}
