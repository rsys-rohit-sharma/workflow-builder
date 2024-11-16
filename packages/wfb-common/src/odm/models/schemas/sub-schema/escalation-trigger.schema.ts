import { Prop } from '@nestjs/mongoose';
import { Schema as MSchema } from 'mongoose';

export enum EscalationTriggerFields {
    EscalationOrder = 'escalationOrder',
    TriggerCondition = 'triggerCondition',
    EscalateAfter = 'escalateAfter',
    EscalateToUsers = 'escalateToUsers',
}

export class EscalationTrigger {
    @Prop({ required: true, default: 0, type: MSchema.Types.Number })
    escalationOrder: number;

    @Prop({ required: true, type: MSchema.Types.Number })
    triggerCondition: string;

    @Prop({ required: true, type: MSchema.Types.Number })
    escalateAfter?: string;

    @Prop({ required: true, type: Array<MSchema.Types.UUID> })
    escalateToUsers: string[];
}

export type EscalationTriggerFieldsType = `${EscalationTriggerFields}`;
