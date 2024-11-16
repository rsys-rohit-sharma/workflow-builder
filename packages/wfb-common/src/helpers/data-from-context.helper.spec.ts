import { Test, TestingModule } from '@nestjs/testing';

import { WfbException } from '../exceptions';
import { ApplicationSettings, ApplicationSettingsDbService, User, UserDbService, WorkspaceDbService } from '../odm';
import { RequestContext } from '../types';
import { DataFromContext } from './data-from-context.helper';

describe('DataFromContext', () => {
    let service: DataFromContext;
    let userDbService: UserDbService;
    let workspaceDbService: WorkspaceDbService;
    let applicationSettingsDbService: ApplicationSettingsDbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DataFromContext,
                {
                    provide: UserDbService,
                    useValue: { findOne: jest.fn() },
                },
                {
                    provide: WorkspaceDbService,
                    useValue: { findOne: jest.fn() },
                },
                {
                    provide: ApplicationSettingsDbService,
                    useValue: { findOne: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<DataFromContext>(DataFromContext);
        userDbService = module.get<UserDbService>(UserDbService);
        workspaceDbService = module.get<WorkspaceDbService>(WorkspaceDbService);
        applicationSettingsDbService = module.get<ApplicationSettingsDbService>(ApplicationSettingsDbService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('get', () => {
        it('should enrich context with user data if type is user', async () => {
            const context: RequestContext = { accountId: '1', userId: '1' };
            const userData: User = {
                userId: 'df0399f7-3f7d-4528-989e-7d75cbefb13e',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                status: 'active',
                isActive: true,
                accountId: '1',
                roleId: '1',
                profileImageUrlOriginal: 'http://example.com/profile.jpg',
                department: 'Engineering',
                managerId: '2',
                locale: 'en-US',
                title: 'Software Engineer',
            };
            jest.spyOn(userDbService, 'findOne').mockResolvedValue(userData);

            const result = await service.get(context, { type: 'user' });

            expect(result.user).toEqual(userData);
        });

        it('should enrich context with site data if type is workspace', async () => {
            const context: RequestContext = { accountId: '1' };
            const workspaceData = {
                workspaceId: '1',
                name: 'Hr Workspace',
                description: 'Hr Workspace',
                workspaceType: 'account',
                accountId: '1',
                version: 1,
                status: 'active',
            };
            jest.spyOn(workspaceDbService, 'findOne').mockResolvedValue(workspaceData);

            const result = await service.get(context, {
                type: 'workspace',
                workspaceId: '1',
            });

            expect(result.workspace).toEqual(workspaceData);
        });

        it('should enrich context with app settings data if type is applicationSettings', async () => {
            const context: RequestContext = { accountId: '1' };
            const appData = {
                wfbEnabled: true,
            } as ApplicationSettings;
            jest.spyOn(applicationSettingsDbService, 'findOne').mockResolvedValue(appData);

            const result = await service.get(context, {
                type: 'applicationSettings',
            });

            expect(result.applicationSettings).toEqual(appData);
        });

        it('should throw WfbException if an error occurs', async () => {
            const context: RequestContext = { accountId: '1' };
            jest.spyOn(userDbService, 'findOne').mockRejectedValue(new Error('Error'));

            await expect(service.get(context, { type: 'user' })).rejects.toThrow(WfbException);
        });
    });
});
