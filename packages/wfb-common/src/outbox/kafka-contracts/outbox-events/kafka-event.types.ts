import { Static, TObject, TProperties, Type } from '@sinclair/typebox';

import { AggregateTypeValues } from './change-stream.types';

export function getGenericKafkaPayloadSchema<T extends TProperties>(entityDataSchema: TObject<T>) {
    return Type.Object({
        payload: entityDataSchema,
    });
}

export const KafkaOutboxEventHeadersSchema = Type.Object({
    aggregate_id: Type.String(),
    account_id: Type.String(),
    eventType: Type.String(),
    tenant_info: Type.Object({
        accountId: Type.String(),
        parentAccountId: Type.Optional(Type.String()),
    }),
    metadata: Type.Object({
        userId: Type.String(),
        accountId: Type.String(),
        correlationId: Type.String(),
        'x-smtip-cid': Type.String(),
        'x-smtip-tid': Type.String(),
        'x-smtip-uid': Type.String(),
        'x-smtip-host': Type.Optional(Type.String()),
        'x-smtip-f-host': Type.Optional(Type.String()),
        'x-smtip-tenant-user-role': Type.Optional(Type.String()),
    }),
    aggregate_type: Type.Enum(AggregateTypeValues),
});

export type KafkaOutboxEventHeadersType = Static<typeof KafkaOutboxEventHeadersSchema>;
