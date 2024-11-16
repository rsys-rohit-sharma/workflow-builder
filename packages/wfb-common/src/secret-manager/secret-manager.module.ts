import { Global, Module } from '@nestjs/common';

import { HarnessModule } from '../harness';
import { AwsSMService } from './aws-sm/aws-sm.service';
import { SecretManagerService } from './secret-manager.service';
import { VaultService } from './vault/vault.service';

@Global()
@Module({
    imports: [HarnessModule],
    providers: [AwsSMService, VaultService, SecretManagerService],
    exports: [SecretManagerService, AwsSMService, VaultService],
})
export class SecretManagerModule {}
