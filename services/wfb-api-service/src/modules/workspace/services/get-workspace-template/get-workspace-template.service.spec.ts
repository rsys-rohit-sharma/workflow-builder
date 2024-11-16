import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { WfbException, ErrorCode, RequestContext, WorkspaceDbService, WorkspaceFields } from '@simpplr/wfb-common';

import { GetWorkspaceTemplateService } from './get-workspace-template.service';

describe('GetWorkspaceTemplateService', () => {
    let getWorkspaceTemplateService: GetWorkspaceTemplateService;

    const workspaceId: string = 'f2bbefe1-783c-44a3-ac15-bc4b93e0a6fb';
    const mockContext: RequestContext = {
        accountId: '36d3df89-75ae-4bc6-883d-cedf955d8f6a',
    };

    const mockWorkspaceDbService = {
        findOne: jest.fn(),
    };

    const mockData = {
        workspaceId: 'template1',
        name: 'Template 1',
        description: 'Description 1',
        iconImage: null,
        components: [
            {
                componentType: 'service_catalog',
                componentName: 'Service Catalog',
            },
        ],
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetWorkspaceTemplateService,
                { provide: REQUEST, useValue: mockContext },
                { provide: WorkspaceDbService, useValue: mockWorkspaceDbService },
            ],
        }).compile();

        getWorkspaceTemplateService = module.get<GetWorkspaceTemplateService>(GetWorkspaceTemplateService);
        mockWorkspaceDbService.findOne.mockResolvedValue(mockData);
    });

    it('should get workspace template', async () => {
        const resultData = await getWorkspaceTemplateService.getWorkspaceTemplate(mockContext, workspaceId);

        expect(resultData).toEqual({
            result: mockData,
        });
        assertWorkspaceDbService(mockContext, workspaceId);
    });

    it('should throw error when workspace template not found', async () => {
        const exception = new WfbException(ErrorCode.WORKSPACE_NOT_FOUND);
        mockWorkspaceDbService.findOne.mockResolvedValue(null);

        await expect(getWorkspaceTemplateService.getWorkspaceTemplate(mockContext, workspaceId)).rejects.toThrow(
            exception,
        );

        assertWorkspaceDbService(mockContext, workspaceId);
    });

    const assertWorkspaceDbService = (context: RequestContext, workspaceTemplateId: string) => {
        const { accountId } = context;

        expect(mockWorkspaceDbService.findOne).toHaveBeenCalledWith(context, {
            includedAttributes: [
                WorkspaceFields.WorkspaceId,
                WorkspaceFields.Name,
                WorkspaceFields.Description,
                WorkspaceFields.IconImage,
                WorkspaceFields.Components,
            ],
            condition: {
                accountId,
                [WorkspaceFields.WorkspaceId]: workspaceTemplateId,
            },
        });
    };
});
