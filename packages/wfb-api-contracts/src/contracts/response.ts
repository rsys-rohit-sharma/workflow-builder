import { Static, TObject, TProperties, Type } from '@sinclair/typebox';

import { API_STATUS, ApiStatus } from '../constants';

const ApiStatusSchema = Type.Union([Type.Literal(API_STATUS.SUCCESS), Type.Literal(API_STATUS.ERROR)]);

export type ApiStatusType = Static<typeof ApiStatusSchema>;

export type GenericApiResponseType<ResponseDataType> = {
    status: `${ApiStatus.SUCCESS}`;
    message: string;
    result: ResponseDataType;
};

export type ListApiResponseType<ResponseDataType> = GenericApiResponseType<{
    listOfItems: ResponseDataType[];
    size: number;
    nextPageToken: number;
    filter?: string;
    sortBy?: string;
    total?: number;
    totalRecords?: number;
}>;

export type ListAllApiResponseType<ResponseDataType> = GenericApiResponseType<{
    listOfItems: ResponseDataType[];
}>;

export function getGenericApiResponseTypeSchema<T extends TProperties>(resDataSchema: TObject<T>) {
    return Type.Object({
        status: Type.Union([Type.Literal(API_STATUS.SUCCESS)]),
        message: Type.String(),
        result: resDataSchema,
    });
}

export const getListAllApiGenericResponseTypeSchema = <T extends TProperties, U extends TProperties>(
    listItemSchema: TObject<T>,
    additionalProps: TObject<U> = Type.Object({}) as TObject<U>,
) => {
    return getGenericApiResponseTypeSchema(
        Type.Composite([
            Type.Object({
                listOfItems: Type.Array(listItemSchema),
            }),
            additionalProps,
        ]),
    );
};

export const getListApiGenericResponseTypeSchema = <T extends TProperties, U extends TProperties>(
    listItemSchema: TObject<T>,
    additionalProps: TObject<U> = Type.Object({}) as TObject<U>,
) => {
    return getGenericApiResponseTypeSchema(
        Type.Composite([
            Type.Object({
                listOfItems: Type.Array(listItemSchema),
                size: Type.Number(),
                nextPageToken: Type.Number(),
                filter: Type.Optional(Type.String()),
                sortBy: Type.Optional(Type.String()),
                total: Type.Optional(Type.Number()),
                totalRecords: Type.Optional(Type.Number()),
            }),
            additionalProps,
        ]),
    );
};
