import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { registerHooks } from '../hooks';
import { EligibilityCondition, EscalationTrigger, OperationalLevelTarget, ServiceLevelTarget } from './sub-schema';

export enum ApplicationPolicyFields {
    PolicyId = 'policyId',
    Name = 'name',
    Description = 'description',
    PolicyType = 'policyType',
    PolicyApplicableTo = 'policyApplicableTo',
    CanDelete = 'canDelete',
    IsEnabled = 'isEnabled',
    ServiceLevelTargets = 'serviceLevelTargets',
    OperationLevelTarget = 'operationLevelTarget',
    EscalationTriggers = 'escalationTriggers',
    PolicyConditionLogic = 'policyConditionLogic',
    EligibilityConditions = 'eligibilityConditions',
    AccountId = 'accountId',
    SegmentId = 'segmentId',
    WorkspaceId = 'workspaceId',
    CreatedAt = 'createdAt',
    ModifiedAt = 'modifiedAt',
    CreatedBy = 'createdBy',
    ModifiedBy = 'modifiedBy',
    DeletedAt = 'deletedAt',
}

@Schema({ collection: 'application_policies' })
export class ApplicationPolicy {
    @Prop({ required: true, type: MSchema.Types.UUID })
    policyId: string;

    @Prop({ required: true, type: MSchema.Types.String })
    name: string;

    @Prop({ required: true, type: MSchema.Types.String })
    description: string;

    @Prop({ required: true, type: MSchema.Types.String })
    policyType: string;

    @Prop({ required: true, type: MSchema.Types.String })
    policyApplicableTo: string;

    @Prop({ required: true, default: true, type: MSchema.Types.Boolean })
    canDelete: boolean;

    @Prop({ required: true, default: true, type: MSchema.Types.Boolean })
    isEnabled: boolean;

    @Prop({ required: false, default: [], type: [ServiceLevelTarget] })
    serviceLevelTargets?: ServiceLevelTarget[];

    @Prop({ required: false, default: null, type: OperationalLevelTarget })
    operationLevelTarget?: OperationalLevelTarget;

    @Prop({ required: false, default: [], type: [EscalationTrigger] })
    escalationTriggers?: EscalationTrigger[];

    @Prop({ required: false, default: [], type: [EligibilityCondition] })
    eligibilityConditions?: EligibilityCondition[];

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    policyConditionLogic?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.UUID })
    workspaceId?: string;

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

export type ApplicationPolicyFieldsType = `${ApplicationPolicyFields}`;
export type ApplicationPolicyDocument = HydratedDocument<ApplicationPolicy>;
export const ApplicationPolicySchema = SchemaFactory.createForClass(ApplicationPolicy);

ApplicationPolicySchema.index({ accountId: 1, policyId: 1 }, { unique: true });
ApplicationPolicySchema.index({ accountId: 1, workspaceId: 1, name: 1 });

registerHooks(ApplicationPolicySchema);

export type ApplicationPolicyFieldsQueryConditionType = {
    [ApplicationPolicyFields.AccountId]: string;
    [ApplicationPolicyFields.SegmentId]?: string;
    [ApplicationPolicyFields.PolicyId]?: string | string[];
    [ApplicationPolicyFields.WorkspaceId]?: string | string[];
    [ApplicationPolicyFields.PolicyType]?: string | string[];
    [ApplicationPolicyFields.PolicyApplicableTo]?: string | string[];
};
