import { trace, TracingNamespaceKey } from '@simpplr/tracing';
import { BSON, UUID } from 'bson';
import {
    CallbackWithoutResultAndOptionalError,
    Document,
    MongooseDocumentMiddleware,
    MongooseQueryMiddleware,
    Schema,
    SchemaType,
} from 'mongoose';

import { LoggerFactory } from '../../logger';

const accountIdField = 'accountId';
const segmentIdField = 'segmentId';

type TenantDocument = Document & {
    [accountIdField]: string;
    [segmentIdField]?: string;
};

export const _getAccountId = (uuidObj?: boolean) => {
    const accountId = trace.tracingNamespace.get(TracingNamespaceKey.ACCOUNT_ID);
    if (!accountId) {
        throw new Error(`AccountId is not found in call context.`);
    }

    if (uuidObj) {
        return new UUID(accountId);
    }

    return accountId;
};

export const _validateAccountId = function (documentAccountId: string) {
    const logger = LoggerFactory.getLogger('ODM _validateAccountId');

    if (!documentAccountId) {
        throw new Error(`AccountId is not provided in the document.`);
    }

    const accountId = _getAccountId();
    if (documentAccountId !== accountId) {
        throw new Error(
            `Document.accountId ({${documentAccountId}}) is not matching with tracing.accountId {${accountId}}.`,
        );
    } else {
        logger.debug(`AccountId matched {${documentAccountId}}).`);
    }
};

const documentMethods: MongooseDocumentMiddleware[] = [
    'validate',
    'save',
    'updateOne',
    'deleteOne',
    'deleteOne',
    'updateOne',
    'validate',
];

const queryMethods: MongooseQueryMiddleware[] = [
    'countDocuments',
    'deleteMany',
    'estimatedDocumentCount',
    'find',
    'findOne',
    'findOneAndDelete',
    'findOneAndReplace',
    'findOneAndUpdate',
    'replaceOne',
    'updateMany',
];

const _registerDocumentHooks = (schema: Schema, method: MongooseDocumentMiddleware) => {
    const logger = LoggerFactory.getLogger('ODM _registerDocumentHooks');

    schema.pre(method, function (this: TenantDocument, next: CallbackWithoutResultAndOptionalError) {
        try {
            logger.debug(`Going to validate Document hook for ${method}`);
            if (!this.get(accountIdField)) {
                this.set(accountIdField, _getAccountId());
            }
            _validateAccountId(this[accountIdField] || this.get(accountIdField));
            next();
        } catch (error) {
            logger.error({
                method,
                error,
            });
            next(error as Error);
        }
    });
};

export const _registerQueryHooks = (schema: Schema, method: MongooseQueryMiddleware) => {
    const logger = LoggerFactory.getLogger('ODM _registerQueryHooks');

    logger.debug(`Going to register pre hook for ${method}`);
    schema.pre(method, function (next: CallbackWithoutResultAndOptionalError) {
        try {
            logger.debug(`Going to add accountId for ${method}`);
            if (!this.getFilter()[accountIdField]) {
                this.where(accountIdField, _getAccountId());
            }
            logger.debug({ 'Executing query': this.getQuery() });
            next();
        } catch (error) {
            logger.error({
                method,
                error,
            });
            next(error as Error);
        }
    });
};

export const _registerAggregateHooks = (schema: Schema) => {
    schema.pre('aggregate', function () {
        const accountId = _getAccountId(true);
        // Add a $match state to the beginning of each pipeline.
        this.pipeline().unshift({
            $match: { [accountIdField]: { $eq: accountId } },
        });
    });
};

export const _registerInsertManyHooks = (schema: Schema) => {
    const method = 'insertMany';
    schema.pre(method, function (this: TenantDocument, next: CallbackWithoutResultAndOptionalError) {
        const logger = LoggerFactory.getLogger('ODM _registerInsertManyHooks');

        try {
            logger.debug(`Going to validate accountId for ${method}`);
            _validateAccountId(this[accountIdField]);
            next();
        } catch (error) {
            logger.error({
                method,
                error,
            });
            next(error as Error);
        }
    });
};

const selectExcludedFields = {
    [accountIdField]: true,
    [segmentIdField]: true,
    _id: true,
};

const BSONCtors = {
    UUID: BSON.UUID,
    ObjectId: BSON.ObjectId,
};

const handleFieldTransformation = (field: SchemaType, fieldName: string, schema: Schema) => {
    if (selectExcludedFields[fieldName]) {
        schema.path(fieldName).select(false);
    }

    const InstanceConstructor = BSONCtors[field.instance];
    if (!InstanceConstructor) {
        return;
    }

    field.get((v: typeof InstanceConstructor) => (v ? v.toString() : v));
    field.set((v: string) => (v ? new InstanceConstructor(v) : v));
    field.transform((v: typeof InstanceConstructor) => (v ? v.toString() : v));
};

export const _addFieldTransformations = (schema: Schema) => {
    schema.set('toJSON', { getters: true });
    schema.set('toObject', { getters: true });

    Object.keys(schema.paths).forEach((fieldName) => {
        const field = schema.paths[fieldName];
        handleFieldTransformation(field, fieldName, schema);
    });
};

export const registerHooks = (schema: Schema) => {
    queryMethods.forEach((method: MongooseQueryMiddleware) => _registerQueryHooks(schema, method));
    documentMethods.forEach((method: MongooseDocumentMiddleware) => _registerDocumentHooks(schema, method));
    _registerInsertManyHooks(schema);
    _addFieldTransformations(schema);
};
