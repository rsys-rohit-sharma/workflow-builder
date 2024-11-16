import { Test, TestingModule } from '@nestjs/testing';

import { SecretManagerService } from '../../../secret-manager';
import { MongooseConfigService } from './mongoose-config.service';

describe('MongooseConfigService', () => {
    let service: MongooseConfigService;

    const getSecret = jest.fn();
    const DB_HOST = 'mongodb+srv://DB_USER_NAME:DB_PASSWORD@abc.mongodb.net';
    const DB_PORT = '27017';
    const DB_NAME = 'testDB';
    const DB_USER_NAME = 'root_master';
    const DB_PASSWORD = 'ABC';
    const SERVICE_NAME = 'wfb-api-service';

    process.env.DB_HOST = DB_HOST;
    process.env.DB_PORT = DB_PORT;
    process.env.DB_NAME = DB_NAME;
    process.env.DB_USER_NAME = DB_USER_NAME;
    process.env.DB_PASSWORD = DB_PASSWORD;
    process.env.SERVICE_NAME = SERVICE_NAME;
    process.env.ENV = 'dev';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MongooseConfigService,
                {
                    provide: SecretManagerService,
                    useValue: {
                        getSecret,
                    },
                },
            ],
        }).compile();

        service = module.get<MongooseConfigService>(MongooseConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const uri = `mongodb+srv://DB_USER_NAME:DB_PASSWORD@abc.mongodb.net`;
    const expectedUri = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@abc.mongodb.net/${DB_NAME}`;

    it('createMongooseOptions: when db_host is set in process.env', async () => {
        const data = await service.createMongooseOptions();
        expect(data).toEqual({
            uri: expectedUri,
            user: DB_USER_NAME,
            pass: DB_PASSWORD,
            dbName: DB_NAME,
            appName: SERVICE_NAME,
            maxIdleTimeMS: 0,
            connectTimeoutMS: 0,
            minPoolSize: 5,
            waitQueueTimeoutMS: 20 * 1000,
        });
        expect(getSecret).not.toHaveBeenCalled();
    });

    it('createMongooseOptions: when db_host is not set in process.env', async () => {
        process.env.DB_HOST = '';

        getSecret.mockResolvedValueOnce({
            host: uri,
            username: DB_USER_NAME,
            password: DB_PASSWORD,
            database: DB_NAME,
        });

        const data = await service.createMongooseOptions();
        expect(data).toEqual({
            uri: expectedUri,
            user: DB_USER_NAME,
            pass: DB_PASSWORD,
            dbName: DB_NAME,
            appName: SERVICE_NAME,
            maxIdleTimeMS: 0,
            connectTimeoutMS: 0,
            minPoolSize: 5,
            waitQueueTimeoutMS: 20 * 1000,
        });
        expect(getSecret).toHaveBeenCalled();
    });
});
