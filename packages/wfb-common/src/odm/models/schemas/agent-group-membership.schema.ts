import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { registerHooks } from '../hooks';

export enum AgentGroupMembershipFields {
    UserId = 'userId',
    AgentGroupId = 'agentGroupId',
    WorkspaceId = 'workspaceId',
    Role = 'role',
    AccountId = 'accountId',
    SegmentId = 'segmentId',
    ModifiedAt = 'modifiedAt',
}
export type AgentGroupMembershipFieldsType = `${AgentGroupMembershipFields}`;

@Schema({ collection: 'agent_group_memberships' })
export class AgentGroupMembership {
    @Prop({ required: true, type: MSchema.Types.UUID })
    agentGroupId: string;

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

export type AgentGroupMembershipDocument = HydratedDocument<AgentGroupMembership>;
export const AgentGroupMembershipSchema = SchemaFactory.createForClass(AgentGroupMembership);

AgentGroupMembershipSchema.index({ accountId: 1, userId: 1, role: 1 });
AgentGroupMembershipSchema.index({
    accountId: 1,
    workspaceId: 1,
    userId: 1,
    role: 1,
});
AgentGroupMembershipSchema.index({
    accountId: 1,
    agentGroupId: 1,
    workspaceId: 1,
    userId: 1,
    role: 1,
});

registerHooks(AgentGroupMembershipSchema);

export type AgentGroupMembershipQueryConditionType = {
    [AgentGroupMembershipFields.AccountId]: string;
    [AgentGroupMembershipFields.SegmentId]?: string;
    [AgentGroupMembershipFields.Role]?: string;
    [AgentGroupMembershipFields.UserId]?: string | string[];
    [AgentGroupMembershipFields.WorkspaceId]?: string | string[];
    [AgentGroupMembershipFields.AgentGroupId]?: string | string[];
};
