import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiStatus } from '@simpplr/wfb-common';

import { GetWorkspaceTemplateService, ListWorkspaceTemplateService } from './services';
import { WorkspaceTemplateController } from './workspace-template.controller';

describe('WorkspaceTemplateController', () => {
    let controller: WorkspaceTemplateController;
    let getListWorkspaceTemplateService: ListWorkspaceTemplateService;
    let getWorkspaceTemplateService: GetWorkspaceTemplateService;

    const mockData = {
        name: 'Hr',
        description: 'Hr Workspace',
        workspaceId: '772c7da4-a7c8-4f85-b813-ce456774d8c9',
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
            controllers: [WorkspaceTemplateController],
            providers: [
                { provide: REQUEST, useValue: { context: {} } },
                {
                    provide: ListWorkspaceTemplateService,
                    useValue: { listWorkspaceTemplate: jest.fn() },
                },
                {
                    provide: GetWorkspaceTemplateService,
                    useValue: { getWorkspaceTemplate: jest.fn() },
                },
            ],
        }).compile();

        controller = module.get<WorkspaceTemplateController>(WorkspaceTemplateController);
        getWorkspaceTemplateService = module.get<GetWorkspaceTemplateService>(GetWorkspaceTemplateService);
        getListWorkspaceTemplateService = module.get<ListWorkspaceTemplateService>(ListWorkspaceTemplateService);
    });

    it('should fetch list of workspace templates', async () => {
        const resultData = {
            result: {
                listOfItems: [mockData],
            },
        };

        jest.spyOn(getListWorkspaceTemplateService, 'listWorkspaceTemplate').mockResolvedValue(resultData);

        expect(await controller.listWorkspaceTemplate()).toEqual({
            status: ApiStatus.SUCCESS,
            result: resultData.result,
            message: 'Workspace Templates fetched successfully.',
        });
    });

    it('should fetch the of workspace template', async () => {
        const resultData = {
            result: mockData,
        };

        jest.spyOn(getWorkspaceTemplateService, 'getWorkspaceTemplate').mockResolvedValue(resultData);

        expect(await controller.getWorkspaceTemplate('1795fbe6-fd0e-4080-ad7c-52aaf6bf1745')).toEqual({
            status: ApiStatus.SUCCESS,
            result: resultData.result,
            message: 'Workspace Template fetched successfully.',
        });
    });
});
