import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { registerHooks } from '../hooks';
import { Holiday, WorkingHour } from './sub-schema';

export enum ApplicationBusinessHourFields {
    BusinessHourId = 'businessHourId',
    Name = 'name',
    Description = 'description',
    TimezoneName = 'timezoneName',
    TimezoneGmtOffset = 'timezoneGmtOffset',
    IsOperationalAllHours = 'isOperationalAllHours',
    IsDefaultBusinessHour = 'isDefaultBusinessHour',
    CanDelete = 'canDelete',
    WorkingHours = 'workingHours',
    HolidayList = 'holidayList',
    AccountId = 'accountId',
    SegmentId = 'segmentId',
    WorkspaceId = 'workspaceId',
    CreatedAt = 'createdAt',
    ModifiedAt = 'modifiedAt',
    CreatedBy = 'createdBy',
    ModifiedBy = 'modifiedBy',
    DeletedAt = 'deletedAt',
}

@Schema({ collection: 'application_business_hours' })
export class ApplicationBusinessHour {
    @Prop({ required: true, type: MSchema.Types.UUID })
    businessHourId: string;

    @Prop({ required: true, type: MSchema.Types.String })
    name: string;

    @Prop({ required: true, type: MSchema.Types.String })
    description: string;

    @Prop({ required: true, type: MSchema.Types.String })
    timezoneName: string;

    @Prop({ required: true, type: MSchema.Types.String })
    timezoneGmtOffset: string;

    @Prop({ required: true, default: false, type: MSchema.Types.Boolean })
    isOperationalAllHours: boolean;

    @Prop({ required: true, default: false, type: MSchema.Types.Boolean })
    isDefaultBusinessHour: boolean;

    @Prop({ required: false, default: [], type: [WorkingHour] })
    workingHours?: WorkingHour[];

    @Prop({ required: false, default: [], type: [Holiday] })
    holidayList?: Holiday[];

    @Prop({ required: true, default: true, type: MSchema.Types.Boolean })
    canDelete: boolean;

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

export type ApplicationBusinessHourFieldsType = `${ApplicationBusinessHourFields}`;
export type ApplicationBusinessHourDocument = HydratedDocument<ApplicationBusinessHour>;
export const ApplicationBusinessHourSchema = SchemaFactory.createForClass(ApplicationBusinessHour);

ApplicationBusinessHourSchema.index({ accountId: 1, businessHourId: 1 }, { unique: true });
ApplicationBusinessHourSchema.index({ accountId: 1, workspaceId: 1, name: 1 });

registerHooks(ApplicationBusinessHourSchema);

export type ApplicationBusinessHourFieldsQueryConditionType = {
    [ApplicationBusinessHourFields.AccountId]: string;
    [ApplicationBusinessHourFields.SegmentId]?: string;
    [ApplicationBusinessHourFields.WorkspaceId]?: string | string[];
    [ApplicationBusinessHourFields.BusinessHourId]?: string | string[];
};
