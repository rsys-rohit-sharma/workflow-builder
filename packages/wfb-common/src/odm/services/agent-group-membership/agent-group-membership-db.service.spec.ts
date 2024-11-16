import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { makeRequestContext } from '../../../utils';
import { AgentGroupMembership } from '../../models';
import { AgentGroupMembershipDbService } from './agent-group-membership-db.service';

const mockAgentGroupMembershipModel = {
    create: jest.fn(),
    insertMany: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
};

export const mockAgentGroupMembership: AgentGroupMembership = {
    userId: 'ea380d1c-3871-499f-9662-24b3a727a055',
    agentGroupId: 'd9322b4b-6061-41ad-8e09-dc219569687e',
    workspaceId: 'ea380d1c-3871-499f-9662-24b3a727a055',
    accountId: 'bedc1d12-68e7-4386-b843-6a9f07d3ff49',
    role: 'member',
};

const _makeRequestContext = ({ accountId }) => {
    const context = makeRequestContext({ accountId });
    return {
        ...context,
        hrtime: expect.arrayContaining([expect.any(Number), expect.any(Number)]),
    };
};

describe('AgentGroupMembershipDbService', () => {
    let agentGroupMembershipDbService: AgentGroupMembershipDbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AgentGroupMembershipDbService,
                {
                    provide: getModelToken(AgentGroupMembership.name),
                    useValue: mockAgentGroupMembershipModel,
                },
            ],
        }).compile();

        agentGroupMembershipDbService = module.get<AgentGroupMembershipDbService>(AgentGroupMembershipDbService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(agentGroupMembershipDbService).toBeDefined();
    });
});
