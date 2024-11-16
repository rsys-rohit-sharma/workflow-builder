import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

import { SecretsManagerDBConfig } from '../../../configuration/configuration.types';
import { LoggerAdapter, LoggerFactory } from '../../../logger';
import { SecretManagerService } from '../../../secret-manager';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
    logger: LoggerAdapter;

    constructor(private readonly secretManagerService: SecretManagerService) {
        this.logger = LoggerFactory.getLogger(MongooseConfigService.name);
        this.logger.debug({
            ref: 'Got the SM service in MongooseConfigService',
            secretManagerService: !!this.secretManagerService,
        });
    }

    async createMongooseOptions(): Promise<MongooseModuleOptions> {
        const { SERVICE_NAME } = process.env;
        let { DB_HOST = '', DB_NAME = '', DB_USER_NAME = '', DB_PASSWORD = '' } = process.env;

        // If any of the DB host is missing, fetch from Secrets Manager
        if (!DB_HOST) {
            const { MONGODB_SECRET_NAME } = process.env;
            const serviceSpecificDbCredsSecretName = `${MONGODB_SECRET_NAME}/${process.env.SERVICE_NAME}`;
            const dbConfig: SecretsManagerDBConfig = await this.secretManagerService.getSecret(
                serviceSpecificDbCredsSecretName,
            );
            this.logger.debug({
                ref: 'Fetched the DB Config',
                serviceSpecificDbCredsSecretName,
                dbUserName: dbConfig.username,
                keys: Object.keys(dbConfig || {}),
            });
            ({ username: DB_USER_NAME, host: DB_HOST, password: DB_PASSWORD, database: DB_NAME } = dbConfig);
        }

        const uri = `${DB_HOST.replace('DB_USER_NAME', DB_USER_NAME).replace('DB_PASSWORD', DB_PASSWORD)}/${DB_NAME}`;
        this.logger.debug({
            DB_DATA: {
                DB_HOST,
                DB_NAME,
                DB_USER_NAME,
                SERVICE_NAME,
            },
        });

        return {
            uri,
            user: DB_USER_NAME,
            pass: DB_PASSWORD,
            dbName: DB_NAME,
            appName: SERVICE_NAME,
            maxIdleTimeMS: 0,
            connectTimeoutMS: 0,
            minPoolSize: 5,
            waitQueueTimeoutMS: 20 * 1000,
        };
    }
}
