import { Static, Type } from '@sinclair/typebox';

export const UUID = Type.String({
    pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$',
});
export type UUIDType = Static<typeof UUID>;
