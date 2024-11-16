import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { registerHooks } from '../hooks';

export enum WorkspaceMembershipFields {
    UserId = 'userId',
    WorkspaceId = 'workspaceId',
    Role = 'role',
    AccountId = 'accountId',
    SegmentId = 'segmentId',
    ModifiedAt = 'modifiedAt',
}
export type WorkspaceMembershipFieldsType = `${WorkspaceMembershipFields}`;

@Schema({ collection: 'workspace_memberships' })
export class WorkspaceMembership {
    @Prop({ required: true, type: MSchema.Types.UUID })
    userId: string;

    @Prop({ required: true, type: MSchema.Types.UUID })
    workspaceId: string;

    @Prop({ required: true, type: MSchema.Types.UUID })
    role: string;

    @Prop({ required: true, type: MSchema.Types.UUID })
    accountId: string;

    @Prop({ required: false, default: null, type: MSchema.Types.UUID })
    segmentId?: string;

    @Prop({ required: false, default: Date.now, type: MSchema.Types.Number })
    modifiedAt?: number;
}

export type WorkspaceMembershipDocument = HydratedDocument<WorkspaceMembership>;
export const WorkspaceMembershipSchema = SchemaFactory.createForClass(WorkspaceMembership);

WorkspaceMembershipSchema.index({ accountId: 1, userId: 1, role: 1 });
WorkspaceMembershipSchema.index({
    accountId: 1,
    workspaceId: 1,
    userId: 1,
    role: 1,
});

registerHooks(WorkspaceMembershipSchema);

export type WorkspaceMembershipQueryConditionType = {
    [WorkspaceMembershipFields.AccountId]: string;
    [WorkspaceMembershipFields.SegmentId]?: string;
    [WorkspaceMembershipFields.Role]?: string;
    [WorkspaceMembershipFields.UserId]?: string | string[];
    [WorkspaceMembershipFields.WorkspaceId]?: string | string[];
};
