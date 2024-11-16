import { Injectable } from '@nestjs/common';
import { GetWorkspaceTemplateListAllResponseType } from '@simpplr/wfb-api-contracts';
import {
    ACCOUNT_ID_FOR_WORKSPACE_TEMPLATES,
    RequestContext,
    WorkspaceDbService,
    WorkspaceFields,
} from '@simpplr/wfb-common';

@Injectable()
export class ListWorkspaceTemplateService {
    constructor(private readonly workspaceDbService: WorkspaceDbService) {}

    async listWorkspaceTemplate(
        context: RequestContext,
    ): Promise<Pick<GetWorkspaceTemplateListAllResponseType, 'result'>> {
        context.accountId = ACCOUNT_ID_FOR_WORKSPACE_TEMPLATES;

        const workspaceTemplates = await this.workspaceDbService.findMany(context, {
            includedAttributes: [
                WorkspaceFields.WorkspaceId,
                WorkspaceFields.Name,
                WorkspaceFields.Description,
                WorkspaceFields.IconImage,
                WorkspaceFields.Components,
            ],
            condition: {
                [WorkspaceFields.AccountId]: context.accountId,
            },
            resultsPerPage: null,
        });

        return {
            result: {
                listOfItems: workspaceTemplates,
            },
        };
    }
}
