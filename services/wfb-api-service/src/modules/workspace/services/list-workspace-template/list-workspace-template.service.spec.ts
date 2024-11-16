import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { RequestContext, WorkspaceDbService, WorkspaceFields } from '@simpplr/wfb-common';

import { ListWorkspaceTemplateService } from './list-workspace-template.service';

describe('ListWorkspaceTemplateService', () => {
    let listWorkspaceTemplateService: ListWorkspaceTemplateService;

    const mockContext: RequestContext = {
        accountId: '36d3df89-75ae-4bc6-883d-cedf955d8f6a',
    };

    const mockWorkspaceDbService = {
        findMany: jest.fn(),
    };

    const mockWorkspaceTemplatesData = [
        {
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
        },
        {
            workspaceId: 'template2',
            name: 'Template 2',
            description: 'Description 2',
            iconImage: null,
            components: [
                {
                    componentType: 'service_catalog',
                    componentName: 'Service Catalog',
                },
            ],
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ListWorkspaceTemplateService,
                { provide: REQUEST, useValue: mockContext },
                { provide: WorkspaceDbService, useValue: mockWorkspaceDbService },
            ],
        }).compile();

        listWorkspaceTemplateService = module.get<ListWorkspaceTemplateService>(ListWorkspaceTemplateService);
        mockWorkspaceDbService.findMany.mockResolvedValue(mockWorkspaceTemplatesData);
    });

    it('should fetch list of workspace templates', async () => {
        const resultData = await listWorkspaceTemplateService.listWorkspaceTemplate(mockContext);

        expect(resultData).toEqual({
            result: {
                listOfItems: mockWorkspaceTemplatesData,
            },
        });
        assertWorkspaceDbService(mockContext);
    });

    const assertWorkspaceDbService = (context: RequestContext) => {
        const { accountId } = context;

        expect(mockWorkspaceDbService.findMany).toHaveBeenCalledWith(context, {
            includedAttributes: [
                WorkspaceFields.WorkspaceId,
                WorkspaceFields.Name,
                WorkspaceFields.Description,
                WorkspaceFields.IconImage,
                WorkspaceFields.Components,
            ],
            resultsPerPage: null,
            condition: {
                accountId,
            },
        });
    };
});
