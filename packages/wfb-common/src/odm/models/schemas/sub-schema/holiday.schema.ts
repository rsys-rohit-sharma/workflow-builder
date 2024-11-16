import { Prop } from '@nestjs/mongoose';
import { Schema as MSchema } from 'mongoose';

export enum HolidayFields {
    Name = 'name',
    Date = 'date',
}

export class Holiday {
    @Prop({ required: true, type: MSchema.Types.String })
    name: string;

    @Prop({ required: true, type: MSchema.Types.Number })
    date: number;
}

export type HolidayFieldsType = `${HolidayFields}`;
