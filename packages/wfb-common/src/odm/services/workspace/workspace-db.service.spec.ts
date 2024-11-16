import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { makeRequestContext } from '../../../utils';
import { Workspace } from '../../models';
import { WorkspaceDbService } from './workspace-db.service';

const mockWorkspaceModel = {
    create: jest.fn(),
    insertMany: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
};

export const mockWorkspace: Workspace = {
    workspaceId: 'ea380d1c-3871-499f-9662-24b3a727a055',
    name: 'HR Workspace',
    workspaceType: 'account',
    version: 1,
    status: 'draft',
    accountId: 'bedc1d12-68e7-4386-b843-6a9f07d3ff49',
};

const _makeRequestContext = ({ accountId }) => {
    const context = makeRequestContext({ accountId });
    return {
        ...context,
        hrtime: expect.arrayContaining([expect.any(Number), expect.any(Number)]),
    };
};

describe('WorkspaceDbService', () => {
    let workspaceDbService: WorkspaceDbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkspaceDbService,
                {
                    provide: getModelToken(Workspace.name),
                    useValue: mockWorkspaceModel,
                },
            ],
        }).compile();

        workspaceDbService = module.get<WorkspaceDbService>(WorkspaceDbService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(workspaceDbService).toBeDefined();
    });
});
