import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { WfbException, ErrorCode } from '../../../exceptions';
import { LoggerFactory } from '../../../logger';
import { IDBService, Initiable } from '../../../types';

@Injectable()
export class DbService implements IDBService, Initiable, OnModuleInit {
    isConnected = false;
    private readonly logger = LoggerFactory.getLogger(DbService.name);

    constructor(@InjectConnection() private readonly db: Connection) {}

    onModuleInit() {
        this.db.on('connected', () => {
            this.isConnected = true;
            this.logger.log('Connected to database');
        });
        this.db.on('disconnected', () => {
            this.logger.log('Disconnected from database');
            this.isConnected = false;
        });
    }

    async initialize(): Promise<this> {
        return this;
    }

    public getDBConnection(): Connection {
        return this.db;
    }

    public isDBAvailable(): boolean {
        /**
         * Connection ready state
         *
         * - 0 = disconnected
         * - 1 = connected
         * - 2 = connecting
         * - 3 = disconnecting
         * - 99 = uninitialized
         */
        return this.isInitialized;
    }

    public async checkConnection(): Promise<boolean> {
        if (!this.isDBAvailable()) {
            const connection = this.getDBConnection();
            throw new WfbException(ErrorCode.DATABASE_ERROR, {
                details: {
                    readyState: connection.readyState,
                    readyStateDefinition:
                        '1 = connected, 0 = disconnected, 2 = connecting, 3 = disconnecting, 99 = uninitialized',
                },
            });
        }
        return true;
    }

    public async disconnect(): Promise<void> {
        return this.getDBConnection().close();
    }

    get isInitialized() {
        const dbConnection = this.getDBConnection();
        /**
         * Connection ready state
         *
         * - 0 = disconnected
         * - 1 = connected
         * - 2 = connecting
         * - 3 = disconnecting
         * - 99 = uninitialized
         */
        return dbConnection && dbConnection.readyState <= 3;
    }

    /**
     * To be called when you want to automatically control the transaction
     * @param callback
     */
    public async withAutoTransaction(callback: () => Promise<void>) {
        try {
            const session = await this.getDBConnection().startSession();
            await session.withTransaction(callback);
            session.endSession();
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * To be used when you want to manually control the transaction
     * If the businessCallback throws an error, the transaction will be aborted
     * But before aborting the transaction, the beforeAbortCallback will be called
     * @param businessCallback
     * @param beforeAbortCallback
     */
    public async withManualTransaction(
        businessCallback: () => Promise<void> | void,
        beforeAbortCallback?: (error: unknown) => Promise<void> | void,
    ) {
        const session = await this.db.startSession();
        let error: unknown;
        session.startTransaction();
        try {
            await businessCallback();
            await session.commitTransaction();
        } catch (err: unknown) {
            error = err;
            if (beforeAbortCallback) {
                await beforeAbortCallback(error);
            }
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
