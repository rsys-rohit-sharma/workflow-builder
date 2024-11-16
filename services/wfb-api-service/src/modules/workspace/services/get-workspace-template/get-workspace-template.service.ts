import { Injectable } from '@nestjs/common';
import { GetWorkspaceTemplateResponseType } from '@simpplr/wfb-api-contracts';
import {
    ACCOUNT_ID_FOR_WORKSPACE_TEMPLATES,
    WfbException,
    ErrorCode,
    LoggerFactory,
    RequestContext,
    WorkspaceDbService,
    WorkspaceFields,
} from '@simpplr/wfb-common';

@Injectable()
export class GetWorkspaceTemplateService {
    private readonly logger = LoggerFactory.getLogger(GetWorkspaceTemplateService.name);

    constructor(private readonly workspaceDbService: WorkspaceDbService) {
        this.logger.debug('GetWorkspaceTemplateService: Initialized');
    }

    async getWorkspaceTemplate(
        context: RequestContext,
        templateId: string,
    ): Promise<Pick<GetWorkspaceTemplateResponseType, 'result'>> {
        context.accountId = ACCOUNT_ID_FOR_WORKSPACE_TEMPLATES;
        const workspaceTemplate = await this._fetchWorkspaceTemplate(context, templateId);

        return {
            result: workspaceTemplate,
        };
    }

    protected async _fetchWorkspaceTemplate(context: RequestContext, workspaceId: string) {
        const workspaceTemplate = await this.workspaceDbService.findOne(context, {
            includedAttributes: [
                WorkspaceFields.WorkspaceId,
                WorkspaceFields.Name,
                WorkspaceFields.Description,
                WorkspaceFields.IconImage,
                WorkspaceFields.Components,
            ],
            condition: {
                [WorkspaceFields.AccountId]: context.accountId,
                [WorkspaceFields.WorkspaceId]: workspaceId,
            },
        });

        if (!workspaceTemplate) {
            throw new WfbException(ErrorCode.WORKSPACE_NOT_FOUND);
        }

        return workspaceTemplate;
    }
}
