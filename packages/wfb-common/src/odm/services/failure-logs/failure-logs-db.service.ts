import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FAILURE_LOG_TYPES } from '../../../constants';
import { WfbException } from '../../../exceptions';
import { Message } from '../../../kafka/kafka.types';
import { LoggerFactory } from '../../../logger';
import { FailureLogs, FailureLogsDocument, FailureLogsFieldsType, FailureLogsQueryConditionType } from '../../models';
import { BaseDbService } from '../base-db.service';

@Injectable()
export class FailureLogsDbService extends BaseDbService<
    FailureLogsFieldsType,
    FailureLogs,
    FailureLogsQueryConditionType,
    FailureLogsQueryConditionType
> {
    private readonly logger = LoggerFactory.getLogger('FailureLogsDbService');

    constructor(
        @InjectModel(FailureLogs.name)
        private readonly failureLogsModel: Model<FailureLogsDocument>,
    ) {
        super(failureLogsModel);
    }

    async createKafkaFailureLog(error: Error, message: Message): Promise<FailureLogs> {
        try {
            const accountId = message.headers.accountId.toString();
            const errorException = WfbException.fromError(error);
            const errorJson = errorException.getJson();

            const payload: FailureLogs = {
                payload: message,
                headers: message.headers,
                topic: message.topic,
                originTimestamp: null,
                errorDetails: errorJson,
                type: FAILURE_LOG_TYPES.KAFKA,
                serviceName: process.env.SERVICE_NAME,
                accountId,
                createdAt: Date.now(),
            };

            const createdLog = await this.failureLogsModel.create(payload);
            this.logger.debug({
                message: 'Created Kafka failure log',
                createdLog,
            });
            return createdLog;
        } catch (err) {
            this.logger.error({
                message: `Failed to create Kafka failure log: ${err.message}`,
                err,
            });
        }
    }
}
