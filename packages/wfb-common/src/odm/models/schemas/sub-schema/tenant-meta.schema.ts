import { Prop } from '@nestjs/mongoose';

export enum TenantMetaFields {
    FeHost = 'feHost',
    AppName = 'appName',
}

export class TenantMeta {
    @Prop({ required: true })
    feHost: string;
    appName: string;
}

export type TenantMetaFieldsType = `${TenantMetaFields}`;
