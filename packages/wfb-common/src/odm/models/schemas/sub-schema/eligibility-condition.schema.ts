import { Prop } from '@nestjs/mongoose';
import { Schema as MSchema } from 'mongoose';

export enum EligibilityConditionFields {
    TicketField = 'ticketField',
    Operator = 'operator',
    MatchValue = 'matchValue',
}

export class EligibilityCondition {
    @Prop({ required: true, type: MSchema.Types.String })
    ticketField: string;

    @Prop({ required: true, type: MSchema.Types.String })
    operator: string;

    @Prop({ required: true, type: MSchema.Types.String })
    matchValue?: string;
}

export type EligibilityConditionFieldsType = `${EligibilityConditionFields}`;
