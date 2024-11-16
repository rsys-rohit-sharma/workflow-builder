import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerAdapter, LoggerFactory } from '../../../logger';
import { ApplicationSettings } from '../../models';
import { ApplicationSettingsDbService } from './application-settings-db.service';

describe('ApplicationSettingsDbService', () => {
    let service: ApplicationSettingsDbService;
    const mockLogger = {
        debug: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        LoggerFactory.getLogger = () => mockLogger as unknown as LoggerAdapter;
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ApplicationSettingsDbService,
                {
                    provide: getModelToken(ApplicationSettings.name),
                    useValue: {
                        name: 'ApplicationSettings',
                        insertMany: jest.fn(),
                        updateMany: jest.fn(),
                        create: jest.fn(),
                        findOneAndUpdate: jest.fn(),
                        deleteOne: jest.fn(),
                        find: jest.fn().mockReturnThis(),
                        select: jest.fn().mockReturnThis(),
                        skip: jest.fn().mockReturnThis(),
                        limit: jest.fn().mockReturnThis(),
                        exec: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ApplicationSettingsDbService>(ApplicationSettingsDbService);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
