import { Controller, Get, HttpStatus, Inject, Injectable, Param, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
    ApiName,
    ErrorResponseOpenApiSchema,
    GetWorkspaceTemplateListAllResponseType,
    GetWorkspaceTemplateListAllRespOpenApiSchema,
    GetWorkspaceTemplateResponseType,
    GetWorkspaceTemplateRespOpenApiSchema,
} from '@simpplr/wfb-api-contracts';
import { ApiDocumentationDecorator, ApiStatus, WfbRequest, LoggerFactory } from '@simpplr/wfb-common';

import { GetWorkspaceTemplateService, ListWorkspaceTemplateService } from './services';

@Controller('templates')
@Injectable({ scope: Scope.REQUEST })
export class WorkspaceTemplateController {
    private readonly logger = LoggerFactory.getLogger(WorkspaceTemplateController.name);

    constructor(
        @Inject(REQUEST) private readonly request: WfbRequest,
        private readonly getWorkspaceTemplateService: GetWorkspaceTemplateService,
        private readonly listWorkspaceTemplateService: ListWorkspaceTemplateService,
    ) {
        this.logger.debug(`${WorkspaceTemplateController.name}: initialized`);
    }

    @ApiDocumentationDecorator({
        apiName: ApiName.GET_WORKSPACE_TEMPLATE_LIST,
        tags: ['Workspace Template'],
        errorResponseSchema: ErrorResponseOpenApiSchema,
        apiResponses: [
            {
                status: HttpStatus.OK,
                schema: GetWorkspaceTemplateListAllRespOpenApiSchema,
                description: 'Success response',
            },
        ],
    })
    @Get()
    async listWorkspaceTemplate(): Promise<GetWorkspaceTemplateListAllResponseType> {
        const { context } = this.request;
        const response = await this.listWorkspaceTemplateService.listWorkspaceTemplate(context);

        return {
            status: ApiStatus.SUCCESS,
            result: response.result,
            message: 'Workspace Templates fetched successfully.',
        };
    }

    @ApiDocumentationDecorator({
        apiName: ApiName.GET_WORKSPACE_TEMPLATE,
        tags: ['Workspace Template'],
        errorResponseSchema: ErrorResponseOpenApiSchema,
        apiResponses: [
            {
                status: HttpStatus.OK,
                schema: GetWorkspaceTemplateRespOpenApiSchema,
                description: 'Success response',
            },
        ],
    })
    @Get(':templateId')
    async getWorkspaceTemplate(@Param('templateId') templateId: string): Promise<GetWorkspaceTemplateResponseType> {
        const { context } = this.request;
        const response = await this.getWorkspaceTemplateService.getWorkspaceTemplate(context, templateId);

        return {
            status: ApiStatus.SUCCESS,
            result: response.result,
            message: 'Workspace Template fetched successfully.',
        };
    }
}
