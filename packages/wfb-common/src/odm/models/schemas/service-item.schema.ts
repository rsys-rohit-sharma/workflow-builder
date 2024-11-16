import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { registerHooks } from '../hooks';

export enum ServiceItemFields {
    ServiceItemId = 'serviceItemId',
    Name = 'name',
    AccountId = 'accountId',
    ServiceCategoryId = 'serviceCategoryId',
    ServiceItemFormId = 'serviceItemFormId',
    Description = 'description',
    ShortDescription = 'shortDescription',
    IconImage = 'iconImage',
    WorkspaceId = 'workspaceId',
    IsRequestForVisibleInPortal = 'isRequestForVisibleInPortal',
    SegmentId = 'segmentId',
    Status = 'status',
    SubjectTemplate = 'subjectTemplate',
    Placeholders = 'placeholders',
    AdditionalServiceIds = 'additionalServiceIds',
    RequestVisibilityToAgentType = 'requestVisibilityToAgentType',
    RequestAgentGroups = 'requestAgentGroups',
    CreatedAt = 'createdAt',
    ModifiedAt = 'modifiedAt',
    CreatedBy = 'createdBy',
    ModifiedBy = 'modifiedBy',
    DeletedAt = 'deletedAt',
}

@Schema({ collection: 'service_items' })
export class ServiceItem {
    @Prop({ required: true, type: MSchema.Types.UUID })
    serviceItemId: string;

    @Prop({ required: true, type: MSchema.Types.String })
    name: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    description?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    shortDescription?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    iconImage?: string;

    @Prop({ default: false, type: MSchema.Types.Boolean })
    isRequestForVisibleInPortal?: boolean;

    @Prop({ required: false, type: MSchema.Types.UUID })
    serviceItemFormId?: string;

    @Prop({ required: true, type: MSchema.Types.UUID })
    serviceCategoryId: string;

    @Prop({ required: false, type: MSchema.Types.UUID })
    workspaceId: string;

    @Prop({ required: true, type: MSchema.Types.UUID })
    accountId: string;

    @Prop({ required: false, type: MSchema.Types.UUID })
    segmentId?: string;

    @Prop({
        default: 'draft',
        type: MSchema.Types.String,
    })
    status: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    subjectTemplate?: string;

    @Prop({ required: false, default: [], type: [MSchema.Types.String] })
    placeholders?: string[];

    @Prop({ required: false, default: [], type: Array<MSchema.Types.UUID> })
    additionalServiceIds?: string[];

    @Prop({
        default: 'null',
        type: MSchema.Types.String,
    })
    requestVisibilityToAgentType?: string;

    @Prop({ required: false, default: [], type: Array<MSchema.Types.UUID> })
    requestAgentGroups?: string[];

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

export type ServiceItemFieldsType = `${ServiceItemFields}`;
export type ServiceItemDocument = HydratedDocument<ServiceItem>;
export const ServiceItemSchema = SchemaFactory.createForClass(ServiceItem);

ServiceItemSchema.index({ accountId: 1, serviceItemId: 1 }, { unique: true });
ServiceItemSchema.index({ accountId: 1, workspaceId: 1, serviceCategoryId: 1 });
ServiceItemSchema.index({
    accountId: 1,
    workspaceId: 1,
    serviceCategoryId: 1,
    name: 1,
});

registerHooks(ServiceItemSchema);

export type ServiceItemFieldsQueryConditionType = {
    [ServiceItemFields.AccountId]: string;
    [ServiceItemFields.SegmentId]?: string;
    [ServiceItemFields.ServiceItemId]?: string | string[];
    [ServiceItemFields.ServiceItemFormId]?: string | string[];
    [ServiceItemFields.ServiceCategoryId]?: string | string[];
    [ServiceItemFields.WorkspaceId]?: string | string[];
};
