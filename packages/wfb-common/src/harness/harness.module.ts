import { Global, Module } from '@nestjs/common';
import { FFClient, ffClient } from '@simpplr/ff-node-server-sdk';

import { HarnessService } from './harness.service';

@Global()
@Module({
    providers: [HarnessService, { provide: FFClient, useValue: ffClient }],
    exports: [HarnessService],
})
export class HarnessModule {}
