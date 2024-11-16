import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { registerHooks } from '../hooks';

export enum ApplicationRoleFields {
    RoleId = 'roleId',
    Name = 'name',
    DisplayName = 'displayName',
    Description = 'description',
    Permissions = 'permissions',
    CanDelete = 'canDelete',
    IsInternalOnly = 'isInternalOnly',
    AccountId = 'accountId',
    SegmentId = 'segmentId',
    CreatedAt = 'createdAt',
    ModifiedAt = 'modifiedAt',
    CreatedBy = 'createdBy',
    ModifiedBy = 'modifiedBy',
    DeletedAt = 'deletedAt',
}

@Schema({ collection: 'application_roles' })
export class ApplicationRole {
    @Prop({ required: true, type: MSchema.Types.UUID })
    roleId: string;

    @Prop({ required: true, type: MSchema.Types.String })
    name: string;

    @Prop({ required: true, type: MSchema.Types.String })
    displayName: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    description?: string;

    @Prop({ required: false, default: [], type: [MSchema.Types.String] })
    permissions?: string[];

    @Prop({ required: true, type: MSchema.Types.UUID })
    accountId: string;

    @Prop({ required: true, default: null, type: MSchema.Types.UUID })
    segmentId?: string;

    @Prop({ required: true, default: true, type: MSchema.Types.Boolean })
    canDelete: boolean;

    @Prop({ required: true, default: false, type: MSchema.Types.Boolean })
    isInternalOnly: boolean;

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

export type ApplicationRoleFieldsType = `${ApplicationRoleFields}`;
export type ApplicationRoleDocument = HydratedDocument<ApplicationRole>;
export const ApplicationRoleSchema = SchemaFactory.createForClass(ApplicationRole);

ApplicationRoleSchema.index({ accountId: 1, roleId: 1 }, { unique: true });
ApplicationRoleSchema.index({ accountId: 1, name: 1 });

registerHooks(ApplicationRoleSchema);

export type ApplicationRoleFieldsQueryConditionType = {
    [ApplicationRoleFields.AccountId]: string;
    [ApplicationRoleFields.SegmentId]?: string;
    [ApplicationRoleFields.Permissions]?: string;
    [ApplicationRoleFields.Name]?: string | string[];
    [ApplicationRoleFields.RoleId]?: string | string[];
};
