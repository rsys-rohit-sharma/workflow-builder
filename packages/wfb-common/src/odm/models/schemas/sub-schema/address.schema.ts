import { Prop } from '@nestjs/mongoose';
import { Schema as MSchema } from 'mongoose';

export enum AddressFields {
    City = 'city',
    State = 'state',
    Address1 = 'address1',
    Address2 = 'address2',
    ZipCode = 'zipCode',
    CountryName = 'countryName',
}

export class Address {
    @Prop({ required: false, default: null, type: MSchema.Types.String })
    city: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    state: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    address1: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    address2: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    zipCode: string;

    @Prop({ required: false, default: null, type: MSchema.Types.String })
    countryName: string;
}

export type AddressFieldsType = `${AddressFields}`;
