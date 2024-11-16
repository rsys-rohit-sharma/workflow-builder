import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { makeRequestContext } from '../../../utils';
import { ApplicationRole } from '../../models';
import { ApplicationRoleDbService } from './application-role-db.service';

const mockApplicationRoleModel = {
    create: jest.fn(),
    insertMany: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
};

export const mockApplicationRole: ApplicationRole = {
    roleId: 'ea380d1c-3871-499f-9662-24b3a727a055',
    name: 'hr_agent',
    displayName: 'Hr Agent',
    canDelete: true,
    isInternalOnly: false,
    permissions: [],
    accountId: 'bedc1d12-68e7-4386-b843-6a9f07d3ff49',
};

const _makeRequestContext = ({ accountId }) => {
    const context = makeRequestContext({ accountId });
    return {
        ...context,
        hrtime: expect.arrayContaining([expect.any(Number), expect.any(Number)]),
    };
};

describe('RoleDbService', () => {
    let applicationRoleDbService: ApplicationRoleDbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ApplicationRoleDbService,
                {
                    provide: getModelToken(ApplicationRole.name),
                    useValue: mockApplicationRoleModel,
                },
            ],
        }).compile();

        applicationRoleDbService = module.get<ApplicationRoleDbService>(ApplicationRoleDbService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(applicationRoleDbService).toBeDefined();
    });
});
