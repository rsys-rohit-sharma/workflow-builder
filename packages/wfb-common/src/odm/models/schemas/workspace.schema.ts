import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { registerHooks } from '../hooks';

export enum ComponentFields {
    ComponentName = 'componentName',
    ComponentType = 'componentType',
}

export class Component {
    @Prop({ required: true, type: MSchema.Types.String })
    componentName: string;

    @Prop({ required: true, type: MSchema.Types.String })
    componentType: string;
}

export type ComponentFieldsType = `${ComponentFields}`;

export enum WorkspaceFields {
    WorkspaceId = 'workspaceId',
    Name = 'name',
    Description = 'description',
    AccountId = 'accountId',
    SegmentId = 'segmentId',
    AudienceId = 'audienceId',
    WorkspaceType = 'workspaceType',
    IconImage = 'iconImage',
    Version = 'version',
    CompletionPercentage = 'completionPercentage',
    AgentCount = 'agentCount',
    Status = 'status',
    Components = 'components',
    CreatedAt = 'createdAt',
    ModifiedAt = 'modifiedAt',
    CreatedBy = 'createdBy',
    ModifiedBy = 'modifiedBy',
    DeletedAt = 'deletedAt',
}

@Schema()
export class Workspace {
    @Prop({ required: true, type: MSchema.Types.UUID })
    workspaceId: string;

    @Prop({ required: true, type: MSchema.Types.String })
    name: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    description?: string;

    @Prop({ required: true, type: MSchema.Types.String })
    workspaceType: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    iconImage?: string;

    @Prop({ required: true, type: MSchema.Types.Number })
    version: number;

    @Prop({ required: true, default: 'draft', type: MSchema.Types.String })
    status: string;

    @Prop({ required: false, default: 0, type: MSchema.Types.Number })
    agentCount?: number;

    @Prop({ required: false, default: 0, type: MSchema.Types.Number })
    completionPercentage?: number;

    @Prop({ required: false, default: [], type: [Component] })
    components?: Component[];

    @Prop({ required: true, type: MSchema.Types.UUID })
    accountId: string;

    @Prop({ required: true, default: null, type: MSchema.Types.UUID })
    segmentId?: string;

    @Prop({ required: true, default: null, type: MSchema.Types.UUID })
    audienceId?: string;

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

export type WorkspaceFieldsType = `${WorkspaceFields}`;
export type WorkspaceDocument = HydratedDocument<Workspace>;
export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);

WorkspaceSchema.index({ accountId: 1, workspaceId: 1 }, { unique: true });

registerHooks(WorkspaceSchema);

export type WorkspaceFieldsQueryConditionType = {
    [WorkspaceFields.AccountId]: string;
    [WorkspaceFields.WorkspaceId]?: string;
    [WorkspaceFields.SegmentId]?: string;
    [WorkspaceFields.AudienceId]?: string;
    [WorkspaceFields.WorkspaceType]?: string;
    [WorkspaceFields.Version]?: number;
};
