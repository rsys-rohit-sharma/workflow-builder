import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { makeRequestContext } from '../../../utils';
import { User } from '../../models';
import { UserDbService } from './user-db.service';

const mockUserModel = {
    create: jest.fn(),
    insertMany: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
};

export const mockUser: User = {
    userId: 'ea380d1c-3871-499f-9662-24b3a727a055',
    roleId: 'ea380d1c-3871-499f-9662-24b3a727a055',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    status: 'active',
    profileImageUrlOriginal: 'https://example.com/profile.jpg',
    isActive: true,
    managerId: '2',
    locale: 'en',
    accountId: 'bedc1d12-68e7-4386-b843-6a9f07d3ff49',
    segmentId: 'c77a927a-fee6-454d-817d-522ebc256c80',
};

const _makeRequestContext = ({ accountId }) => {
    const context = makeRequestContext({ accountId });
    return {
        ...context,
        hrtime: expect.arrayContaining([expect.any(Number), expect.any(Number)]),
    };
};

describe('UserDbService', () => {
    let userDbService: UserDbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserDbService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                },
            ],
        }).compile();

        userDbService = module.get<UserDbService>(UserDbService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(userDbService).toBeDefined();
    });
});
