import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { makeRequestContext } from '../../../utils';
import { WorkspaceMembership } from '../../models';
import { WorkspaceMembershipDbService } from './workspace-membership-db.service';

const mockWorkspaceMembershipModel = {
    create: jest.fn(),
    insertMany: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
};

export const mockWorkspaceMembership: WorkspaceMembership = {
    userId: 'ea380d1c-3871-499f-9662-24b3a727a055',
    workspaceId: 'e1271b2f-69c6-4512-8dae-ab800413f37e',
    accountId: 'bedc1d12-68e7-4386-b843-6a9f07d3ff49',
    role: 'workspace_admin',
};

const _makeRequestContext = ({ accountId }) => {
    const context = makeRequestContext({ accountId });
    return {
        ...context,
        hrtime: expect.arrayContaining([expect.any(Number), expect.any(Number)]),
    };
};

describe('WorkspaceMembershipDbService', () => {
    let workspaceMembershipDbService: WorkspaceMembershipDbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkspaceMembershipDbService,
                {
                    provide: getModelToken(WorkspaceMembership.name),
                    useValue: mockWorkspaceMembershipModel,
                },
            ],
        }).compile();

        workspaceMembershipDbService = module.get<WorkspaceMembershipDbService>(WorkspaceMembershipDbService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(workspaceMembershipDbService).toBeDefined();
    });
});
