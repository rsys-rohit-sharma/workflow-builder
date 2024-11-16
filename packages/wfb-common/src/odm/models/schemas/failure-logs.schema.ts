import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { RequestContext } from '../../../types';
import { registerHooks } from '../hooks';

export enum FailureLogsFields {
    Id = '_id',
    Payload = 'payload',
    Headers = 'headers',
    Topic = 'topic',
    OriginTimestamp = 'originTimestamp',
    IsReadyToProcess = 'isReadyToProcess',
    IsRetried = 'isRetried',
    Context = 'context',
    AccountId = 'accountId',
    ErrorDetails = 'errorDetails',
    Type = 'type',
    ApiParams = 'apiParams',
    ServiceName = 'serviceName',
    CreatedAt = 'createdAt',
}

@Schema({ collection: 'failure_logs' })
export class FailureLogs {
    @Prop({ required: true, type: MSchema.Types.Mixed })
    payload: object;

    @Prop({ required: true, type: MSchema.Types.Mixed })
    headers: object;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    topic?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.Number })
    originTimestamp?: number;

    @Prop({ required: false, default: true, type: MSchema.Types.Boolean })
    isReadyToProcess?: boolean;

    @Prop({ required: false, default: false, type: MSchema.Types.Boolean })
    isRetried?: boolean;

    @Prop({ required: false, default: null, type: MSchema.Types.Mixed })
    context?: RequestContext;

    @Prop({ required: true, type: MSchema.Types.Mixed })
    errorDetails: any;

    @Prop({ required: true, enum: ['API', 'kafka'] })
    type: string;

    @Prop({ required: false, default: null, type: MSchema.Types.Mixed })
    apiParams?: any;

    @Prop({ required: true, type: MSchema.Types.String })
    serviceName: string;

    @Prop({ required: true, type: MSchema.Types.UUID })
    accountId: string;

    @Prop({ required: false, default: Date.now, type: MSchema.Types.Number })
    createdAt?: number;
}

export type FailureLogsFieldsType = `${FailureLogsFields}`;
export type FailureLogsDocument = HydratedDocument<FailureLogs>;
export const FailureLogsSchema = SchemaFactory.createForClass(FailureLogs);

FailureLogsSchema.index({ accountId: 1, isReadyToProcess: 1, createdAt: 1 });

registerHooks(FailureLogsSchema);

export type FailureLogsQueryConditionType = {
    [FailureLogsFields.AccountId]: string;
    [FailureLogsFields.Topic]: string;
    [FailureLogsFields.IsReadyToProcess]: boolean;
    [FailureLogsFields.IsRetried]: boolean;
    [FailureLogsFields.Type]: string;
};
