import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { registerHooks } from '../hooks';

export enum GroupAutomationRuleFields {
    RuleId = 'ruleId',
    Order = 'order',
    Name = 'name',
    TicketStatus = 'ticketStatus',
    DurationUnassignedMinutes = 'durationUnassignedMinutes',
    ActionType = 'actionType',
    Recipients = 'recipients',
    ModifiedAt = 'modifiedAt',
}

export class GroupAutomationRule {
    @Prop({ required: true, type: MSchema.Types.UUID })
    RuleId: string;

    @Prop({ required: true, default: 0, type: MSchema.Types.Number })
    Order: number;

    @Prop({ required: true, type: MSchema.Types.String })
    name: string;

    @Prop({ required: true, type: MSchema.Types.String })
    ticketStatus: string;

    @Prop({ required: true, type: MSchema.Types.Number })
    durationUnassignedMinutes: number;

    @Prop({ required: true, type: MSchema.Types.String })
    actionType: string;

    @Prop({ required: true, type: Array<MSchema.Types.UUID> })
    recipients: string[];

    @Prop({ required: true, type: MSchema.Types.Number })
    modifiedAt: number;
}

export type GroupAutomationRuleFieldsType = `${GroupAutomationRuleFields}`;

export enum AgentGroupFields {
    AgentGroupId = 'agentGroupId',
    Name = 'name',
    Description = 'description',
    BusinessHourId = 'businessHourId',
    WorkspaceId = 'workspaceId',
    IsDefaultBusinessHour = 'isDefaultBusinessHour',
    IsAccessRestrictedToGroup = 'isAccessRestrictedToGroup',
    AccountId = 'accountId',
    AgentCount = 'agentCount',
    SegmentId = 'segmentId',
    CreatedAt = 'createdAt',
    ModifiedAt = 'modifiedAt',
    CreatedBy = 'createdBy',
    ModifiedBy = 'modifiedBy',
    DeletedAt = 'deletedAt',
}

@Schema({ collection: 'agent_groups' })
export class AgentGroup {
    @Prop({ required: true, type: MSchema.Types.UUID })
    agentGroupId: string;

    @Prop({ required: true, type: MSchema.Types.String })
    name: string;

    @Prop({ required: true, type: MSchema.Types.String })
    description: string;

    @Prop({ required: true, type: MSchema.Types.UUID })
    businessHourId: string;

    @Prop({ required: false, default: false, type: MSchema.Types.Boolean })
    isDefaultBusinessHour?: boolean;

    @Prop({ required: true, default: false, type: MSchema.Types.Boolean })
    isAccessRestrictedToGroup: boolean;

    @Prop({ required: false, default: [], type: [GroupAutomationRule] })
    groupAutomationRules?: GroupAutomationRule[];

    @Prop({ required: true, type: MSchema.Types.UUID })
    accountId: string;

    @Prop({ required: true, default: null, type: MSchema.Types.UUID })
    segmentId?: string;

    @Prop({ required: true, type: MSchema.Types.UUID })
    workspaceId: string;

    @Prop({ required: false, default: 0, type: MSchema.Types.Number })
    agentCount?: number;

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

export type AgentGroupFieldsType = `${AgentGroupFields}`;
export type AgentGroupDocument = HydratedDocument<AgentGroup>;
export const AgentGroupSchema = SchemaFactory.createForClass(AgentGroup);

AgentGroupSchema.index({ accountId: 1, agentGroupId: 1 }, { unique: true });
AgentGroupSchema.index({ accountId: 1, workspaceId: 1, name: 1 });

registerHooks(AgentGroupSchema);

export type AgentGroupFieldsQueryConditionType = {
    [AgentGroupFields.AccountId]: string;
    [AgentGroupFields.SegmentId]?: string;
    [AgentGroupFields.DeletedAt]?: string;
    [AgentGroupFields.AgentGroupId]?: string | string[];
    [AgentGroupFields.BusinessHourId]?: string | string[];
    [AgentGroupFields.IsAccessRestrictedToGroup]?: boolean;
};
