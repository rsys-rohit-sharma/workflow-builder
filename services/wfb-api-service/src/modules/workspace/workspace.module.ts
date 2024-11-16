import { Module } from '@nestjs/common';
import { ODMModule } from '@simpplr/wfb-common';

import { GetWorkspaceTemplateService, ListWorkspaceTemplateService } from './services';
import { WorkspaceTemplateController } from './workspace-template.controller';

@Module({
    imports: [ODMModule],
    controllers: [WorkspaceTemplateController],
    providers: [GetWorkspaceTemplateService, ListWorkspaceTemplateService],
    exports: [GetWorkspaceTemplateService, ListWorkspaceTemplateService],
})
export class WorkspaceModule {}
