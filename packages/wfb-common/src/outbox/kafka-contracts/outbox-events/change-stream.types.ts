import { ParsedIncomingMessage } from '@simpplr/common-message-broker';

import { DBOperation } from '../../../constants';

export type ChangeStreamUpdateDescription = {
    removedFields?: null | string;
    updatedFields?: null | string; // example "{\"first_name\": \"Anne Marie\"}" New Value - "Anne Marie\"
    truncatedArrays?: null | string;
};

export type ParsedChangeStreamUpdateDescription = {
    removedFields?: null | Record<string, unknown>;
    updatedFields?: null | Record<string, unknown>;
    truncatedArrays?: null | Record<string, unknown>;
};

export type ChangeStreamMessageData = {
    after: string | null;
    before: string | null;
    op: DBOperation;
    source?: {
        collection: string;
        connector: string;
        db: string;
        lsid: string | null;
        name: string;
        ord: number;
        sequence: string | null;
        snapshot: string;
        ts_ms: number;
        ts_ns: number;
        ts_us: number;
        txnNumber: string | null;
        version: string;
        wallTime: number;
    };
    transaction?: string | null;
    ts_ms?: number;
    updateDescription?: ChangeStreamUpdateDescription;
};

export type ChangeStreamMessage = ParsedIncomingMessage<string, ChangeStreamMessageData>;
export type ParsedChangeStreamEventData<EntityDataType> = {
    after: EntityDataType | null; // will null in case of delete operation
    before: EntityDataType | null; // will null in case of insert operation
    op: DBOperation;
    updateDescription?: ParsedChangeStreamUpdateDescription;
};

export enum AggregateTypeValues {
    WORKSPACE_MODERATION = 'Workspace',
    WORKSPACE_INTERACTION = 'Workspace_Interaction',
}
