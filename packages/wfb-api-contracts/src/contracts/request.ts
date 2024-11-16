import { type Static, Type } from '@sinclair/typebox';

export const GenericGetApiRequestSchema = Type.Object({
    size: Type.String(),
    nextPageToken: Type.String(),
});

export type GenericGetApiRequestType<RequestAdditionalPropertiesType = unknown> = Static<
    typeof GenericGetApiRequestSchema
> &
    RequestAdditionalPropertiesType;
