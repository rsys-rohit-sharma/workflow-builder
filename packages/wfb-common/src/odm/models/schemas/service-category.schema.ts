import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { registerHooks } from '../hooks';

export enum ServiceCategoryFields {
    ServiceCategoryId = 'serviceCategoryId',
    Name = 'name',
    Description = 'description',
    ShortDescription = 'shortDescription',
    AccountId = 'accountId',
    WorkspaceId = 'workspaceId',
    SegmentId = 'segmentId',
    CreatedAt = 'createdAt',
    ModifiedAt = 'modifiedAt',
    CreatedBy = 'createdBy',
    ModifiedBy = 'modifiedBy',
    DeletedAt = 'deletedAt',
}
@Schema({ collection: 'service_categories' })
export class ServiceCategory {
    @Prop({ required: true, type: MSchema.Types.UUID })
    serviceCategoryId: string;

    @Prop({ required: true, type: MSchema.Types.UUID })
    accountId: string;

    @Prop({ required: false, type: MSchema.Types.UUID })
    segmentId?: string;

    @Prop({ required: true, type: MSchema.Types.UUID })
    workspaceId: string;

    @Prop({ required: true, type: MSchema.Types.String })
    name: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    description?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    shortDescription?: string;

    @Prop({ required: false, default: Date.now, type: MSchema.Types.Number })
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

export type ServiceCategoryFieldsType = `${ServiceCategoryFields}`;
export type ServiceCategoryDocument = HydratedDocument<ServiceCategory>;
export const ServiceCategorySchema = SchemaFactory.createForClass(ServiceCategory);

ServiceCategorySchema.index({ accountId: 1, serviceCategoryId: 1 }, { unique: true });
ServiceCategorySchema.index({ accountId: 1, workspaceId: 1, name: 1 });

registerHooks(ServiceCategorySchema);

export type ServiceCategoryFieldsQueryConditionType = {
    [ServiceCategoryFields.AccountId]: string;
    [ServiceCategoryFields.SegmentId]?: string;
    [ServiceCategoryFields.Name]?: string;
    [ServiceCategoryFields.WorkspaceId]?: string | string[];
    [ServiceCategoryFields.ServiceCategoryId]?: string | string[];
};
