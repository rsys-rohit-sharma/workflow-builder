import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { makeRequestContext } from '../../../utils';
import { ApplicationBusinessHour } from '../../models';
import { ApplicationBusinessHourDbService } from './applicaiton-business-hour-db.service';

const mockApplicationBusinessHourModel = {
    create: jest.fn(),
    insertMany: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
};

export const mockApplicationBusinessHour: ApplicationBusinessHour = {
    businessHourId: 'ea380d1c-3871-499f-9662-24b3a727a055',
    name: 'Default',
    description: 'Default business calendar',
    timezoneName: 'timezoneName',
    timezoneGmtOffset: 'timezoneGmtOffset',
    isOperationalAllHours: false,
    isDefaultBusinessHour: false,
    canDelete: true,
    workingHours: [],
    holidayList: [],
    accountId: 'bedc1d12-68e7-4386-b843-6a9f07d3ff49',
};

const _makeRequestContext = ({ accountId }) => {
    const context = makeRequestContext({ accountId });
    return {
        ...context,
        hrtime: expect.arrayContaining([expect.any(Number), expect.any(Number)]),
    };
};

describe('ApplicationBusinessHourDbService', () => {
    let applicationBusinessHourDbService: ApplicationBusinessHourDbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ApplicationBusinessHourDbService,
                {
                    provide: getModelToken(ApplicationBusinessHour.name),
                    useValue: mockApplicationBusinessHourModel,
                },
            ],
        }).compile();

        applicationBusinessHourDbService = module.get<ApplicationBusinessHourDbService>(
            ApplicationBusinessHourDbService,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(applicationBusinessHourDbService).toBeDefined();
    });
});
