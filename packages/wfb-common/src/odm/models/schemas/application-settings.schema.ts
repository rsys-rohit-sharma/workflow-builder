import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { registerHooks } from '../hooks';
import { TenantMeta } from './sub-schema';

export enum ApplicationSettingsFields {
    AccountId = 'accountId',
    SegmentId = 'segmentId',
    WfbEnabled = 'wfbEnabled',
    TenantMeta = 'tenantMeta',
    CreatedAt = 'createdAt',
    CreatedBy = 'createdBy',
    ModifiedAt = 'modifiedAt',
    ModifiedBy = 'modifiedBy',
    DeletedAt = 'deletedAt',
}

export type ApplicationSettingsFieldsType = `${ApplicationSettingsFields}`;

@Schema({ collection: 'application_settings' })
export class ApplicationSettings {
    @Prop({ required: true, type: MSchema.Types.Boolean })
    wfbEnabled: boolean;

    @Prop({ required: true, type: MSchema.Types.UUID })
    accountId: string;

    @Prop({ required: false, default: null, type: MSchema.Types.UUID })
    segmentId?: string;

    @Prop({ required: false, default: null, type: TenantMeta })
    tenantMeta?: TenantMeta;

    @Prop({ required: true, default: Date.now, type: MSchema.Types.Number })
    createdAt?: number;

    @Prop({ required: false, default: null, type: MSchema.Types.Number })
    modifiedAt?: number;

    @Prop({ required: false, default: null, type: MSchema.Types.UUID })
    createdBy?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.UUID })
    modifiedBy?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.Number })
    deletedAt?: number;
}

export type ApplicationSettingsDocument = HydratedDocument<ApplicationSettings>;
export const ApplicationSettingsSchema = SchemaFactory.createForClass(ApplicationSettings);

ApplicationSettingsSchema.index({ accountId: 1 }, { unique: true });

registerHooks(ApplicationSettingsSchema);

export type ApplicationSettingsQueryConditionType = {
    [ApplicationSettingsFields.AccountId]: string;
    [ApplicationSettingsFields.SegmentId]?: string;
};
