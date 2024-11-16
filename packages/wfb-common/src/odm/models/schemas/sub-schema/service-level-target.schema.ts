import { Prop } from '@nestjs/mongoose';
import { Schema as MSchema } from 'mongoose';

export enum ServiceLevelTargetFields {
    Severity = 'severity',
    RespondWithinValue = 'respondWithinValue',
    RespondWithinUnit = 'respondWithinUnit',
    ResolveWithinValue = 'resolveWithinValue',
    ResolveWithinUnit = 'resolveWithinUnit',
    CompleteWithinValue = 'completeWithinValue',
    CompleteWithinUnit = 'completeWithinUnit',
    OperationalHours = 'operationalHours',
    IsEscalationEmailEnabled = 'isEscalationEmailEnabled',
}

export class ServiceLevelTarget {
    @Prop({ required: true, type: MSchema.Types.Number })
    severity: number;

    @Prop({ required: false, default: 0, type: MSchema.Types.Number })
    respondWithinValue?: number;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    respondWithinUnit?: string;

    @Prop({ required: false, default: 0, type: MSchema.Types.Number })
    resolveWithinValue?: number;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    resolveWithinUnit?: string;

    @Prop({ required: false, default: 0, type: MSchema.Types.Number })
    completeWithinValue?: number;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    completeWithinUnit?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    operationalHours?: string;

    @Prop({ required: true, default: false, type: MSchema.Types.Boolean })
    isEscalationEmailEnabled: boolean;
}

export type ServiceLevelTargetFieldsType = `${ServiceLevelTargetFields}`;
