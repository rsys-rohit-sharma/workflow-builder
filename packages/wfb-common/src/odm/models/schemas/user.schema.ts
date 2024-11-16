import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

import { registerHooks } from '../hooks';
import { Address } from './sub-schema';

export enum UserFields {
    UserId = 'userId',
    RoleId = 'roleId',
    FirstName = 'firstName',
    LastName = 'lastName',
    Email = 'email',
    Phone = 'phone',
    Mobile = 'mobile',
    Status = 'status',
    ProfileImageUrlOriginal = 'profileImageUrlOriginal',
    Department = 'department',
    IsActive = 'isActive',
    ManagerId = 'managerId',
    Locale = 'locale',
    Language = 'language',
    Title = 'title',
    AudienceIMemberOf = 'audienceIMemberOf',
    Roles = 'roles',
    Pronouns = 'pronouns',
    Address = 'address',
    TimezoneName = 'timezoneName',
    TimezoneGmtOffset = 'timezoneGmtOffset',
    AccountId = 'accountId',
    SegmentId = 'segmentId',
    CreatedAt = 'createdAt',
    CreatedBy = 'createdBy',
    ModifiedAt = 'modifiedAt',
    ModifiedBy = 'modifiedBy',
    DeletedAt = 'deletedAt',
}

@Schema()
export class User {
    @Prop({ required: true, type: MSchema.Types.UUID })
    userId: string;

    @Prop({ required: true, type: MSchema.Types.String })
    firstName: string;

    @Prop({ required: true, type: MSchema.Types.UUID })
    roleId: string;

    @Prop({ required: true, type: MSchema.Types.String })
    lastName: string;

    @Prop({ required: true, type: MSchema.Types.String })
    email: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    phone?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    mobile?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    pronouns?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    timezoneName?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    timezoneGmtOffset?: string;

    @Prop({ required: true, type: MSchema.Types.String })
    status: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    profileImageUrlOriginal?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    department?: string;

    @Prop({ required: true, type: MSchema.Types.Boolean })
    isActive: boolean;

    @Prop({ required: false, default: null, type: MSchema.Types.UUID })
    managerId?: string;

    @Prop({ required: false, default: null, type: Address })
    address?: Address;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    locale?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    language?: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    title?: string;

    @Prop({ required: false, default: [], type: Array<MSchema.Types.UUID> })
    audienceIMemberOf?: string[];

    @Prop({ required: false, default: [], type: MSchema.Types.Array })
    roles?: string[];

    @Prop({ required: true, type: MSchema.Types.UUID })
    accountId: string;

    @Prop({ required: false, default: null, type: MSchema.Types.UUID })
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

export type UserFieldsType = `${UserFields}`;
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index(
    { accountId: 1, userId: 1, segmentId: 1 },
    { unique: true, partialFilterExpression: { isActive: true } },
);

registerHooks(UserSchema);

export type UserFieldsQueryConditionType = {
    [UserFields.AccountId]: string;
    [UserFields.SegmentId]?: string;
    [UserFields.IsActive]?: boolean;
    [UserFields.UserId]?: string | string[];
};
