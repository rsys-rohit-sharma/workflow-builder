import { type Static, Type } from '@sinclair/typebox';

import { SharedKafkaEvents } from '../constants';

export enum ENTITIES_VALUES {
    WORKSPACE = 'workspace.workspace.*',
}

const ingestHistoricalDataRequestDetails = Type.Object({
    accountId: Type.String(),
    entity: Type.Enum(ENTITIES_VALUES),
    targetTopic: Type.String(),
    email: Type.String(),
    includeAllEntityData: Type.Boolean(),
});

const ingestHistoricalDataRequest = Type.Object({
    category: Type.Literal(SharedKafkaEvents.INGEST_HISTORICAL_DATA),
    details: ingestHistoricalDataRequestDetails,
});

export type IngestHistoricalDataRequestType = Static<typeof ingestHistoricalDataRequest>;
export type IngestHistoricalDataRequestDetailsType = Static<typeof ingestHistoricalDataRequestDetails>;
