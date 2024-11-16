import { NotFoundException } from '@nestjs/common';
import { Document, HydratedDocument, Model, MongooseUpdateQueryOptions, Query, QueryOptions } from 'mongoose';

import { BULK_WRITE_DEFAULT_BATCH_SIZE } from '../../constants';
import { WfbException, ErrorCode } from '../../exceptions';
import { LoggerFactory } from '../../logger';
import { PopulateParam, QueryParams, RequestContext } from '../../types';
import { buildQuery } from '../helpers';

type TenantIdentifier = {
    accountId: string;
    segmentId?: string;
    audienceId?: string;
};

export enum DbOperationMethod {
    CREATE = 'create',
    CREATE_MANY = 'createMany',
    UPDATE_ONE = 'updateOne',
    UPDATE_MANY = 'updateMany',
    DELETE_ONE = 'deleteOne',
    DELETE_MANY = 'deleteMany',
    REMOVE_ONE = 'removeOne',
    REMOVE_MANY = 'removeMany',
    FIND_ONE = 'findOne',
    FIND_MANY = 'findMany',
    COUNT = 'count',
    EXISTS = 'exists',
    BULK_UPDATE = 'bulkUpdate',
}

export abstract class BaseDbService<
    FieldsType,
    DocumentType,
    SingleDocFetchConditionType extends TenantIdentifier,
    MultiDocFetchConditionType extends TenantIdentifier,
    HDocumentType extends Document = HydratedDocument<DocumentType>,
> {
    protected _logger = LoggerFactory.getLogger(`BaseDbService:${this.constructor.name}`);
    protected _model: Model<HDocumentType>;

    protected constructor(model: Model<HDocumentType>) {
        this._model = model;
    }

    async create(context: RequestContext, documentData: DocumentType): Promise<DocumentType> {
        try {
            return (await this._model.create(documentData)) as DocumentType;
        } catch (error) {
            this._logger.error({
                [`Error while inserting document in ${this._model.name}`]: error,
            });
            throw WfbException.fromError(error, ErrorCode.DATABASE_ERROR);
        }
    }

    async createMany(context: RequestContext, documentData: DocumentType[]): Promise<DocumentType[]> {
        try {
            return (await this._model.insertMany(documentData)) as DocumentType[];
        } catch (error) {
            this._logger.error({
                [`Error while inserting documents in ${this._model.name}`]: error,
            });
            throw WfbException.fromError(error, ErrorCode.DATABASE_ERROR);
        }
    }

    async updateOne(
        context: RequestContext,
        condition: SingleDocFetchConditionType,
        updatedData: Partial<DocumentType>,
        options?: QueryOptions<DocumentType>,
    ): Promise<DocumentType> {
        try {
            const { userId } = context;
            const finalCondition = this._transformWhereCondition(context, condition, DbOperationMethod.UPDATE_ONE);
            const existingDocument = (await this._model
                .findOneAndUpdate(
                    finalCondition,
                    {
                        $set: {
                            ...updatedData,
                            modifiedAt: Date.now(),
                            modifiedBy: userId,
                        },
                    },
                    { upsert: false, new: true, select: '-__v -_id', ...(options || {}) },
                )
                .exec()) as DocumentType;

            if (!existingDocument) {
                throw new WfbException(ErrorCode.DOCUMENT_NOT_FOUND, {
                    details: {
                        model: this._model.name,
                        condition,
                    },
                });
            }

            return existingDocument;
        } catch (error) {
            this._logger.error({
                [`Error while updating document(s) in ${this._model.name}`]: error,
            });
            throw WfbException.fromError(error, ErrorCode.DATABASE_ERROR);
        }
    }

    async updateMany(
        context: RequestContext,
        condition: MultiDocFetchConditionType,
        updatedData: Partial<DocumentType>,
        options?: MongooseUpdateQueryOptions<DocumentType>,
    ) {
        try {
            const { userId } = context;
            const finalCondition = this._transformWhereCondition(context, condition, DbOperationMethod.UPDATE_MANY);
            const updatedStats = await this._model
                .updateMany(
                    finalCondition,
                    {
                        $set: {
                            ...updatedData,
                            modifiedAt: Date.now(),
                            modifiedBy: userId,
                        },
                    },
                    { ...(options || {}) },
                )
                .exec();
            return updatedStats;
        } catch (error) {
            this._logger.error({
                [`Error while updating document(s) in ${this._model.name}`]: error,
            });
            throw WfbException.fromError(error, ErrorCode.DATABASE_ERROR);
        }
    }

    async deleteOne(context: RequestContext, condition: SingleDocFetchConditionType) {
        try {
            const { userId } = context;
            const finalCondition = this._transformWhereCondition(context, condition, DbOperationMethod.DELETE_ONE);
            const existingDocument = await this._model
                .findOneAndUpdate(
                    finalCondition,
                    {
                        $set: {
                            modifiedAt: Date.now(),
                            modifiedBy: userId,
                            deletedAt: Date.now(),
                        },
                    },
                    { select: '-__v' },
                )
                .exec();

            if (!existingDocument) {
                throw new NotFoundException(`Document does not exist.`);
            }
            return existingDocument;
        } catch (error) {
            this._logger.error({
                [`Error while deleting (soft) document(s) in ${this._model.name}`]: error,
            });
            throw WfbException.fromError(error, ErrorCode.DATABASE_ERROR);
        }
    }

    async deleteMany(context: RequestContext, condition: MultiDocFetchConditionType) {
        try {
            const { userId } = context;
            const finalCondition = this._transformWhereCondition(context, condition, DbOperationMethod.DELETE_MANY);
            await this._model
                .updateMany(finalCondition, {
                    $set: {
                        modifiedBy: userId,
                        modifiedAt: Date.now(),
                        deletedAt: Date.now(),
                    },
                })
                .exec();
        } catch (error) {
            this._logger.error({
                [`Error while deleting (soft) document(s) in ${this._model.name}`]: error,
            });
            throw WfbException.fromError(error, ErrorCode.DATABASE_ERROR);
        }
    }

    async removeOne(context: RequestContext, condition: SingleDocFetchConditionType) {
        try {
            const finalCondition = this._transformWhereCondition(context, condition, DbOperationMethod.REMOVE_ONE);
            await this._model.deleteOne(finalCondition).exec();
        } catch (error) {
            this._logger.error({
                [`Error while removing document in ${this._model.name}`]: error,
            });
            throw WfbException.fromError(error, ErrorCode.DATABASE_ERROR);
        }
    }

    async removeMany(context: RequestContext, condition: MultiDocFetchConditionType) {
        try {
            const finalCondition = this._transformWhereCondition(context, condition, DbOperationMethod.REMOVE_MANY);
            await this._model.deleteMany(finalCondition).exec();
        } catch (error) {
            this._logger.error({
                [`Error while removing documents in ${this._model.name}`]: error,
            });
            throw WfbException.fromError(error, ErrorCode.DATABASE_ERROR);
        }
    }

    async findOne(
        context: RequestContext,
        queryParams: QueryParams<FieldsType, SingleDocFetchConditionType>,
        populateParams?: PopulateParam[],
    ): Promise<DocumentType> {
        try {
            const { accountId } = context;
            const finalQueryParams = this._transformQueryParams(context, queryParams, DbOperationMethod.FIND_ONE);
            const { condition } = finalQueryParams;
            const finalCondition = this._transformWhereCondition(context, condition, DbOperationMethod.FIND_ONE);

            let query = this._model.findOne({ ...finalCondition, accountId });
            query = buildQuery<FieldsType, HDocumentType, typeof query>(query, finalQueryParams, populateParams);
            const finalQuery = this._transformQuery<HDocumentType, typeof query>(
                context,
                query,
                DbOperationMethod.FIND_ONE,
            );
            return (await finalQuery.exec())?.toJSON() as DocumentType;
        } catch (error) {
            this._logger.error({
                [`Error while fetching document from ${this._model.name}`]: error,
            });
            throw WfbException.fromError(error, ErrorCode.DATABASE_ERROR);
        }
    }

    async findMany(
        context: RequestContext,
        queryParams: QueryParams<FieldsType, MultiDocFetchConditionType>,
        populateParams?: PopulateParam[],
    ): Promise<DocumentType[]> {
        try {
            const { accountId } = context;
            const finalQueryParams = this._transformQueryParams(context, queryParams, DbOperationMethod.FIND_MANY);
            const { condition } = finalQueryParams;
            const finalCondition = this._transformWhereCondition(context, condition, DbOperationMethod.FIND_MANY);

            let query = this._model.find({ ...finalCondition, accountId });
            query = buildQuery<FieldsType, HDocumentType, typeof query>(query, finalQueryParams, populateParams);
            const finalQuery = this._transformQuery<HDocumentType, typeof query>(
                context,
                query,
                DbOperationMethod.FIND_MANY,
            );

            return (await finalQuery.exec()) as DocumentType[];
        } catch (error) {
            this._logger.error({
                [`Error while fetching documents from ${this._model.name}`]: error,
            });
            throw WfbException.fromError(error, ErrorCode.DATABASE_ERROR);
        }
    }

    async count(
        context: RequestContext,
        condition: SingleDocFetchConditionType | MultiDocFetchConditionType,
    ): Promise<number> {
        try {
            const { accountId } = context;
            const finalCondition = this._transformWhereCondition(context, condition, DbOperationMethod.COUNT);
            const query = this._model.countDocuments({
                ...finalCondition,
                accountId,
            });
            return await query.exec();
        } catch (error) {
            this._logger.error({
                [`Error while counting documents from ${this._model.name}`]: error,
            });
            throw WfbException.fromError(error, ErrorCode.DATABASE_ERROR);
        }
    }

    async exists(
        context: RequestContext,
        condition: SingleDocFetchConditionType | MultiDocFetchConditionType,
    ): Promise<boolean> {
        return (await this.count(context, condition)) > 0;
    }

    async validateValues(
        context: RequestContext,
        condition: SingleDocFetchConditionType,
        values: Partial<DocumentType>,
    ): Promise<boolean> {
        const includedAttributes = Object.keys(values) as FieldsType[];
        const existingDocument = await this.findOne(context, {
            condition,
            includedAttributes,
        });

        if (!existingDocument) {
            return null;
        }
        const jsonDoc = JSON.parse(JSON.stringify(existingDocument)) as DocumentType;
        return includedAttributes.every((key) => jsonDoc[key as string] === values[key as string]);
    }

    async bulkUpdate(
        context: RequestContext,
        condition: MultiDocFetchConditionType,
        updatedData: Partial<DocumentType>,
        options?: { batchSize?: number; parallel?: boolean },
    ) {
        try {
            const { batchSize = BULK_WRITE_DEFAULT_BATCH_SIZE, parallel = false } = options || {};
            const finalCondition = this._transformWhereCondition(context, condition, DbOperationMethod.FIND_MANY);
            const {
                successCount,
                errorCount,
                batchSize: processedBatchSize,
                failedBatches,
            } = await this._processBulkUpdate(finalCondition, updatedData, batchSize, parallel);

            return {
                successCount,
                errorCount,
                batchSize: processedBatchSize,
                failedBatches,
            };
        } catch (error) {
            this._logger.error({
                [`Error while updating document(s) in ${this._model.name}`]: error,
            });
            throw WfbException.fromError(error, ErrorCode.DATABASE_ERROR);
        }
    }

    protected async _processBulkUpdate(
        finalCondition: SingleDocFetchConditionType | MultiDocFetchConditionType,
        dataToUpdate: Partial<DocumentType>,
        batchSize: number,
        parallel: boolean,
    ) {
        const bulkOperationReqDetails = {
            operations: [],
            batchNumber: 1,
            parallel,
            successCount: 0,
            errorCount: 0,
            failedBatches: [],
        };

        const cursor = this._model.find(finalCondition).select('_id').batchSize(batchSize).cursor();
        let docs = await cursor.next();
        while (docs !== null) {
            bulkOperationReqDetails.operations.push({
                updateOne: {
                    filter: { _id: docs._id },
                    update: { $set: dataToUpdate },
                },
            });

            if (bulkOperationReqDetails.operations.length === batchSize) {
                const successCount = await this._performBulkWrite(
                    bulkOperationReqDetails.operations,
                    parallel,
                    bulkOperationReqDetails,
                );
                bulkOperationReqDetails.successCount += successCount;
                bulkOperationReqDetails.batchNumber += 1;
                bulkOperationReqDetails.operations = [];
            }

            docs = await cursor.next();
        }

        if (bulkOperationReqDetails.operations.length > 0) {
            const successCount = await this._performBulkWrite(
                bulkOperationReqDetails.operations,
                parallel,
                bulkOperationReqDetails,
            );
            bulkOperationReqDetails.successCount += successCount;
        }

        return {
            successCount: bulkOperationReqDetails.successCount,
            errorCount: bulkOperationReqDetails.errorCount,
            batchSize,
            failedBatches: bulkOperationReqDetails.failedBatches,
        };
    }

    protected async _performBulkWrite(operations, parallel: boolean, bulkOperationReqDetails) {
        try {
            if (parallel) {
                this._model.bulkWrite(operations);
            } else {
                await this._model.bulkWrite(operations);
            }
            return operations.length;
        } catch (error) {
            bulkOperationReqDetails.errorCount += operations.length;
            bulkOperationReqDetails.failedBatches.push(bulkOperationReqDetails.batchNumber);
            this._logger.error({
                [`Error while bulkUpdate in ${this._model.name}`]: error,
            });
            return 0;
        }
    }

    protected _transformQuery<DocType extends Document, QueryType extends Query<unknown, DocType>>(
        context: RequestContext,
        query: QueryType,
        dbOperationMethod: DbOperationMethod,
    ) {
        return query;
    }

    protected _transformQueryParams(
        context: RequestContext,
        queryParams: QueryParams<FieldsType, SingleDocFetchConditionType | MultiDocFetchConditionType>,
        dbOperationMethod: DbOperationMethod,
    ) {
        return queryParams;
    }

    protected _transformWhereCondition(
        context: RequestContext,
        condition: SingleDocFetchConditionType | MultiDocFetchConditionType,
        dbOperationMethod: DbOperationMethod,
    ) {
        Object.keys(condition).forEach((key) => {
            if (condition[key] && condition[key].constructor.name === 'Array') {
                if (condition[key].length === 1) {
                    const [value] = condition[key];
                    condition[key] = value;
                } else {
                    condition[key] = { $in: condition[key] };
                }
            }
        });
        return condition;
    }

    protected _buildSingleDocConditionFromDoc(context: RequestContext, doc: DocumentType): SingleDocFetchConditionType {
        return null as unknown as SingleDocFetchConditionType;
    }
}
