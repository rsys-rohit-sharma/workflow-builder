import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { makeRequestContext } from '../../../utils';
import { AgentGroup } from '../../models';
import { AgentGroupDbService } from './agent-group-db.service';

const mockAgentGroupModel = {
    create: jest.fn(),
    insertMany: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
};

export const mockAgentGroup: AgentGroup = {
    agentGroupId: 'ea380d1c-3871-499f-9662-24b3a727a055',
    name: 'Support Team',
    isAccessRestrictedToGroup: false,
    description: 'Agent group for handling support tickets',
    businessHourId: '50992d1c-744e-4111-a007-0b7c7ccf56da',
    accountId: 'bedc1d12-68e7-4386-b843-6a9f07d3ff49',
    workspaceId: 'c77a927a-fee6-454d-817d-522ebc256c80',
};

const _makeRequestContext = ({ accountId }) => {
    const context = makeRequestContext({ accountId });
    return {
        ...context,
        hrtime: expect.arrayContaining([expect.any(Number), expect.any(Number)]),
    };
};

describe('AgentGroupDbService', () => {
    let agentGroupDbService: AgentGroupDbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AgentGroupDbService,
                {
                    provide: getModelToken(AgentGroup.name),
                    useValue: mockAgentGroupModel,
                },
            ],
        }).compile();

        agentGroupDbService = module.get<AgentGroupDbService>(AgentGroupDbService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(agentGroupDbService).toBeDefined();
    });
});
