import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { registerHooks } from '../hooks';

export enum ApplicationPermissionFields {
    PermissionId = 'permissionId',
    Action = 'action',
    Resource = 'resource',
    Description = 'description',
    TargetRole = 'targetRole',
    ResourcePath = 'resourcePath',
    ParentId = 'parentId',
    SelectionMode = 'selectionMode',
    AccountId = 'accountId',
    SegmentId = 'segmentId',
    CreatedAt = 'createdAt',
    ModifiedAt = 'modifiedAt',
    CreatedBy = 'createdBy',
    ModifiedBy = 'modifiedBy',
    DeletedAt = 'deletedAt',
}

@Schema({ collection: 'application_permissions' })
export class ApplicationPermission {
    @Prop({ required: true, type: MSchema.Types.UUID })
    permissionId: string;

    @Prop({ required: true, type: MSchema.Types.String })
    action: string;

    @Prop({ required: true, type: MSchema.Types.String })
    resource: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    resourcePath?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    description?: string;

    @Prop({ required: true, type: [MSchema.Types.String] })
    targetRole: string;

    @Prop({ required: false, default: null, type: MSchema.Types.UUID })
    parentId?: string;

    @Prop({ required: false, default: null, type: [MSchema.Types.String] })
    selectionMode?: string;

    @Prop({ required: true, type: MSchema.Types.UUID })
    accountId: string;

    @Prop({ required: true, default: null, type: MSchema.Types.UUID })
    segmentId?: string;

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

export type ApplicationPermissionFieldsType = `${ApplicationPermissionFields}`;
export type ApplicationPermissionDocument = HydratedDocument<ApplicationPermission>;
export const ApplicationPermissionSchema = SchemaFactory.createForClass(ApplicationPermission);

ApplicationPermissionSchema.index({ accountId: 1, permissionId: 1 }, { unique: true });
ApplicationPermissionSchema.index({ accountId: 1, targetRole: 1 });
ApplicationPermissionSchema.index({ accountId: 1, action: 1, resource: 1 });

registerHooks(ApplicationPermissionSchema);

export type ApplicationPermissionFieldsQueryConditionType = {
    [ApplicationPermissionFields.AccountId]: string;
    [ApplicationPermissionFields.SegmentId]?: string;
    [ApplicationPermissionFields.ParentId]?: string;
    [ApplicationPermissionFields.Action]?: string | string[];
    [ApplicationPermissionFields.PermissionId]?: string | string[];
    [ApplicationPermissionFields.TargetRole]?: string | string[];
    [ApplicationPermissionFields.Resource]?: string | string[];
    [ApplicationPermissionFields.ResourcePath]?: string | string[];
};
