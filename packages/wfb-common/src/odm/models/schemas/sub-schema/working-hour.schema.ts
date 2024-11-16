import { Prop } from '@nestjs/mongoose';
import { Schema as MSchema } from 'mongoose';

export enum WorkingHourFields {
    Day = 'day',
    StartTime = 'startTime',
    EndTime = 'endTime',
    IsEnabled = 'isEnabled',
    Hours = 'hours',
}

export class WorkingHour {
    @Prop({ required: true, type: MSchema.Types.String })
    day: string;

    @Prop({ required: true, type: MSchema.Types.String })
    startTime: string;

    @Prop({ required: true, type: MSchema.Types.String })
    endTime: string;

    @Prop({ required: true, default: true, type: MSchema.Types.Boolean })
    isEnabled: boolean;

    @Prop({ required: true, default: 8, type: MSchema.Types.Number })
    hours: number;
}

export type WorkingHourFieldsType = `${WorkingHourFields}`;
