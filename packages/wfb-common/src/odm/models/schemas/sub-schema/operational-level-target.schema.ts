import { Prop } from '@nestjs/mongoose';
import { Schema as MSchema } from 'mongoose';

export enum OperationalLevelTargetFields {
    ResolveWithinValue = 'resolveWithinValue',
    ResolveWithinUnit = 'resolveWithinUnit',
    OperationalHours = 'operationalHours',
}

export class OperationalLevelTarget {
    @Prop({ required: false, default: 0, type: MSchema.Types.Number })
    resolveWithinValue?: number;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    resolveWithinUnit?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    operationalHours?: string;
}

export type OperationalLevelTargetFieldsType = `${OperationalLevelTargetFields}`;
