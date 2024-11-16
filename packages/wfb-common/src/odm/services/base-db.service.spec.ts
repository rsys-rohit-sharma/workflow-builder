import { Model } from 'mongoose';

import { WfbException } from '../../exceptions';
import { LoggerAdapter, LoggerFactory } from '../../logger';
import { RequestContext } from '../../types';
import { Workspace, WorkspaceFields, WorkspaceFieldsQueryConditionType } from '../models';
import { BaseDbService } from './base-db.service';

jest.mock('../helpers', () => {
    return {
        buildQuery: jest.fn().mockReturnValue({ exec: jest.fn() }),
    };
});

const { buildQuery } = jest.requireMock('../helpers');
const mockModel = {
    create: jest.fn(),
    insertMany: jest.fn(),
    findOneAndUpdate: jest.fn().mockReturnThis(),
    updateMany: jest.fn().mockReturnThis(),
    deleteMany: jest.fn().mockReturnThis(),
    deleteOne: jest.fn().mockReturnThis(),
    countDocuments: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    find: jest.fn(),
    exec: jest.fn(),
    bulkWrite: jest.fn(),
    aggregate: jest.fn(),
    updateOne: jest.fn().mockReturnThis(),
};

const mockContext = () => {
    return {
        userId: 'userId',
        accountId: 'accountId',
        segmentId: 'segmentId',
    } as unknown as RequestContext;
};

class DummyClass extends BaseDbService<
    WorkspaceFields,
    Workspace,
    WorkspaceFieldsQueryConditionType,
    WorkspaceFieldsQueryConditionType
> {}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const baseDbService = new DummyClass(mockModel as unknown as Model<any>);

describe('BaseDbService', () => {
    const mockLogger = {
        debug: jest.fn(),
        error: jest.fn(),
    };

    const getDummyDoc = () => ({
        userId: 'userId',
        accountId: 'accountId',
        workspaceId: 'workspaceId',
    });

    beforeEach(() => {
        LoggerFactory.getLogger = () => mockLogger as unknown as LoggerAdapter;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a document', async () => {
            const docData = getDummyDoc();
            mockModel.create.mockResolvedValueOnce(docData);

            const createdDocument = await baseDbService.create(mockContext(), docData);

            expect(mockModel.create).toHaveBeenCalledWith(docData);
            expect(createdDocument).toBe(docData);
        });

        it('should throw WfbException on error', async () => {
            const docData = getDummyDoc();
            const error = new Error('Create Error');
            mockModel.create.mockRejectedValueOnce(error);

            await expect(baseDbService.create(mockContext(), docData)).rejects.toThrow(WfbException);

            expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('updateOne', () => {
        it('should update a document', async () => {
            const query = getDummyDoc();
            const updatedData = {};
            const existingComment = {};
            mockModel.findOneAndUpdate.mockReturnThis();
            mockModel.exec.mockResolvedValueOnce(existingComment);

            const result = await baseDbService.updateOne(mockContext(), query, updatedData);

            expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
                query,
                {
                    $set: {
                        ...updatedData,
                        modifiedAt: expect.any(Number),
                        modifiedBy: 'userId',
                    },
                },
                expect.objectContaining({
                    upsert: false,
                    new: true,
                    select: '-__v -_id',
                }),
            );
            expect(mockModel.exec).toHaveBeenCalledTimes(1);
            expect(result).toBe(existingComment);
        });

        it('should throw NotFoundException if document not found', async () => {
            const query = {
                accountId: 'nonExistingAccountId',
                workspaceId: 'workspaceId',
            };
            const updatedData = {};
            mockModel.findOneAndUpdate.mockReturnThis();
            mockModel.exec.mockResolvedValueOnce(null);

            await expect(baseDbService.updateOne(mockContext(), query, updatedData)).rejects.toThrow(WfbException);

            expect(mockModel.exec).toHaveBeenCalledTimes(1);
        });

        it('should throw WfbException on error', async () => {
            const query = {
                accountId: 'accountId',
                workspaceId: 'workspaceId',
            };
            const updatedData = {};
            mockModel.findOneAndUpdate.mockReturnThis();
            const error = new Error('Update Error');
            mockModel.exec.mockRejectedValueOnce(error);

            await expect(baseDbService.updateOne(mockContext(), query, updatedData)).rejects.toThrow(WfbException);

            expect(mockModel.exec).toHaveBeenCalledTimes(1);
            expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('deleteOne', () => {
        it('should delete a document', async () => {
            const query = {
                accountId: 'accountId',
                workspaceId: 'workspaceId',
            };
            const existingComment = { _id: '123' };
            mockModel.findOneAndUpdate.mockReturnThis();
            mockModel.exec.mockResolvedValueOnce(existingComment);

            const result = await baseDbService.deleteOne(mockContext(), query);

            expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
                query,
                {
                    $set: {
                        deletedAt: expect.any(Number),
                        modifiedAt: expect.any(Number),
                        modifiedBy: 'userId',
                    },
                },
                { select: '-__v' },
            );
            expect(mockModel.exec).toHaveBeenCalledTimes(1);
            expect(result).toBe(existingComment);
        });

        it('should throw NotFoundException if document not found', async () => {
            const query = {
                accountId: 'accountId',
                workspaceId: 'workspaceId',
            };
            mockModel.findOneAndUpdate.mockReturnThis();
            mockModel.exec.mockResolvedValueOnce(null);

            await expect(baseDbService.deleteOne(mockContext(), query)).rejects.toThrow(WfbException);

            expect(mockModel.exec).toHaveBeenCalledTimes(1);
        });

        it('should throw WfbException on error', async () => {
            const query = {
                accountId: 'accountId',
                workspaceId: 'workspaceId',
            };
            const error = new Error('Delete Error');
            mockModel.findOneAndUpdate.mockReturnThis();
            mockModel.exec.mockRejectedValueOnce(error);

            await expect(baseDbService.deleteOne(mockContext(), query)).rejects.toThrow(WfbException);

            expect(mockModel.exec).toHaveBeenCalledTimes(1);
            expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('findMany', () => {
        it('should find many documents with $in clause', async () => {
            const queryParams = {
                condition: {
                    accountId: 'accountId',
                    workspaceId: ['workspaceId', 'workspaceId2'],
                },
            };
            const documents = [{}, {}];
            mockModel.find = jest.fn();
            buildQuery.mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(documents),
            });

            const result = await baseDbService.findMany(mockContext(), queryParams);

            expect(mockModel.find).toHaveBeenCalledWith({
                ...queryParams.condition,
                workspaceId: {
                    $in: ['workspaceId', 'workspaceId2'],
                },
                accountId: 'accountId',
            });
            expect(result).toBe(documents);
        });

        it('should find many documents without $in clause', async () => {
            const queryParams = {
                condition: {
                    accountId: 'accountId',
                    workspaceId: ['workspaceId'],
                },
            };
            const documents = [{}, {}];
            mockModel.find = jest.fn();
            buildQuery.mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(documents),
            });

            const result = await baseDbService.findMany(mockContext(), queryParams);

            expect(mockModel.find).toHaveBeenCalledWith({
                ...queryParams.condition,
                workspaceId: 'workspaceId',
                accountId: 'accountId',
            });
            expect(result).toBe(documents);
        });

        it('should throw WfbException on error', async () => {
            const queryParams = {
                condition: {
                    accountId: 'accountId',
                    workspaceId: ['workspaceId', 'workspaceId2'],
                },
            };
            const error = new Error('Find Error');
            mockModel.find = jest.fn();
            buildQuery.mockReturnValue({ exec: jest.fn().mockRejectedValue(error) });

            await expect(baseDbService.findMany(mockContext(), queryParams)).rejects.toThrow(WfbException);

            expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('findOne', () => {
        it('should find one document without $in clause', async () => {
            const queryParams = {
                condition: {
                    accountId: 'accountId',
                    workspaceId: ['workspaceId'],
                    userId: 'userId',
                },
            };
            const document = {};
            mockModel.findOne = jest.fn();
            buildQuery.mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce({
                    toJSON: jest.fn().mockReturnValue(document),
                }),
            });

            const result = await baseDbService.findOne(mockContext(), queryParams);

            expect(mockModel.findOne).toHaveBeenCalledWith({
                ...queryParams.condition,
                workspaceId: 'workspaceId',
                accountId: 'accountId',
            });
            expect(result).toBe(document);
        });

        it('should find one document with $in clause', async () => {
            const queryParams = {
                condition: {
                    accountId: 'accountId',
                    workspaceId: ['workspaceId', 'workspaceId2'],
                    userId: 'userId',
                },
            };
            const document = {};
            mockModel.findOne = jest.fn();
            buildQuery.mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce({
                    toJSON: jest.fn().mockReturnValue(document),
                }),
            });

            const result = await baseDbService.findOne(mockContext(), queryParams);

            expect(mockModel.findOne).toHaveBeenCalledWith({
                ...queryParams.condition,
                workspaceId: {
                    $in: ['workspaceId', 'workspaceId2'],
                },
                accountId: 'accountId',
            });
            expect(result).toBe(document);
        });

        it('should throw WfbException on error', async () => {
            const queryParams = {
                condition: {
                    accountId: 'accountId',
                    workspaceId: 'workspaceId',
                    userId: 'userId',
                },
            };
            const error = new Error('Find Error');
            mockModel.findOne = jest.fn();
            buildQuery.mockReturnValue({ exec: jest.fn().mockRejectedValue(error) });

            await expect(baseDbService.findOne(mockContext(), queryParams)).rejects.toThrow(WfbException);

            expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('createMany', () => {
        it('should create multiple documents', async () => {
            const docData = [getDummyDoc()];
            const insertedDocuments = [getDummyDoc()];
            mockModel.insertMany.mockResolvedValueOnce(insertedDocuments);

            const result = await baseDbService.createMany(mockContext(), docData);

            expect(mockModel.insertMany).toHaveBeenCalledWith(docData);
            expect(result).toBe(insertedDocuments);
        });

        it('should throw WfbException on error', async () => {
            const docData = [getDummyDoc()];
            const error = new Error('Create Many Error');
            mockModel.insertMany.mockRejectedValueOnce(error);

            await expect(baseDbService.createMany(mockContext(), docData)).rejects.toThrow(WfbException);

            expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('updateMany', () => {
        it('should update multiple documents', async () => {
            const query = {
                accountId: 'accountId',
                workspaceId: 'workspaceId',
            };
            const updatedData = {};
            const result = {};

            mockModel.updateMany.mockReturnThis();
            mockModel.exec.mockResolvedValueOnce(result);
            baseDbService.findMany = jest.fn().mockResolvedValueOnce([getDummyDoc()]);

            const updated = await baseDbService.updateMany(mockContext(), query, updatedData);

            expect(mockModel.updateMany).toHaveBeenCalledWith(
                query,
                {
                    $set: {
                        ...updatedData,
                        modifiedAt: expect.any(Number),
                        modifiedBy: 'userId',
                    },
                },
                {},
            );
            expect(updated).toBe(result);
            // expect(baseDbService.findMany).toHaveBeenCalledTimes(1);
        });

        it('should throw WfbException on error', async () => {
            const query = {
                accountId: 'accountId',
                workspaceId: 'workspaceId',
            };
            const updatedData = {};
            const error = new Error('Update Many Error');

            mockModel.updateMany.mockReturnThis();
            mockModel.exec.mockRejectedValueOnce(error);

            await expect(baseDbService.updateMany(mockContext(), query, updatedData)).rejects.toThrow(WfbException);
            expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('deleteMany', () => {
        it('should delete multiple documents', async () => {
            const query = {
                accountId: 'accountId',
                workspaceId: 'workspaceId',
            };

            mockModel.updateMany.mockReturnThis();
            mockModel.exec.mockResolvedValueOnce({});
            baseDbService.findMany = jest.fn().mockResolvedValueOnce([getDummyDoc()]);

            const deleted = await baseDbService.deleteMany(mockContext(), query);

            expect(mockModel.updateMany).toHaveBeenCalledWith(query, {
                $set: {
                    deletedAt: expect.any(Number),
                    modifiedAt: expect.any(Number),
                    modifiedBy: 'userId',
                },
            });
            expect(mockModel.exec).toHaveBeenCalledTimes(1);
            expect(deleted).toBe(undefined);
            // expect(baseDbService.findMany).toHaveBeenCalledTimes(1);
        });

        it('should throw WfbException on error', async () => {
            const query = {
                accountId: 'accountId',
                workspaceId: 'workspaceId',
            };
            const error = new Error('Delete Many Error');

            mockModel.updateMany.mockReturnThis();
            mockModel.exec.mockRejectedValueOnce(error);

            await expect(baseDbService.deleteMany(mockContext(), query)).rejects.toThrow(WfbException);
            expect(mockModel.exec).toHaveBeenCalledTimes(1);
            expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('removeOne', () => {
        it('should remove one document', async () => {
            const query = {
                accountId: 'accountId',
                workspaceId: 'workspaceId',
            };
            mockModel.deleteOne.mockReturnThis();
            mockModel.exec.mockResolvedValueOnce({});

            const removed = await baseDbService.removeOne(mockContext(), query);

            expect(mockModel.deleteOne).toHaveBeenCalledWith(query);
            expect(mockModel.exec).toHaveBeenCalledTimes(1);
            expect(removed).toBe(undefined);
        });

        it('should throw WfbException on error', async () => {
            const query = {
                accountId: 'accountId',
                workspaceId: 'workspaceId',
            };
            const error = new Error('Remove One Error');

            mockModel.deleteOne.mockReturnThis();
            mockModel.exec.mockRejectedValueOnce(error);

            await expect(baseDbService.removeOne(mockContext(), query)).rejects.toThrow(WfbException);
            expect(mockModel.exec).toHaveBeenCalledTimes(1);
            expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('removeMany', () => {
        it('should remove many documents', async () => {
            const query = {
                accountId: 'accountId',
                workspaceId: 'workspaceId',
            };

            mockModel.deleteMany.mockReturnThis();
            mockModel.exec.mockResolvedValueOnce({});
            baseDbService.findMany = jest.fn().mockResolvedValueOnce([getDummyDoc()]);

            const removed = await baseDbService.removeMany(mockContext(), query);

            expect(mockModel.deleteMany).toHaveBeenCalledWith(query);
            expect(mockModel.exec).toHaveBeenCalledTimes(1);
            expect(removed).toBe(undefined);
            //expect(baseDbService.findMany).toHaveBeenCalledTimes(1);
        });

        it('should throw WfbException on error', async () => {
            const query = {
                accountId: 'accountId',
                workspaceId: 'workspaceId',
            };
            const error = new Error('Remove One Error');

            mockModel.deleteMany.mockReturnThis();
            mockModel.exec.mockRejectedValueOnce(error);

            await expect(baseDbService.removeMany(mockContext(), query)).rejects.toThrow(WfbException);
            expect(mockModel.exec).toHaveBeenCalledTimes(1);
            expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('count', () => {
        const condition = {} as WorkspaceFieldsQueryConditionType;
        it('should count a document', async () => {
            const docData = getDummyDoc();

            mockModel.countDocuments.mockReturnThis();
            mockModel.exec.mockResolvedValueOnce(1);

            const result = await baseDbService.count(docData, condition);

            expect(mockModel.countDocuments).toHaveBeenCalledWith({
                ...condition,
                accountId: 'accountId',
            });
            expect(result).toBe(1);
        });

        it('should throw WfbException on error', async () => {
            const docData = getDummyDoc();
            const error = new Error('Count Error');

            mockModel.countDocuments.mockReturnThis();
            mockModel.exec.mockRejectedValueOnce(error);

            await expect(baseDbService.count(docData, condition)).rejects.toThrow(WfbException);
            expect(mockModel.countDocuments).toHaveBeenCalledWith({
                ...condition,
                accountId: 'accountId',
            });
            expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe('validateValues', () => {
        const context = mockContext();
        const condition = {
            accountId: 'accountId',
            workspaceId: ['workspaceId'],
            userId: 'userId',
        };
        const docData = getDummyDoc();
        const includedAttributes = Object.keys(docData);

        it('should return false if no document found', async () => {
            const documentData = getDummyDoc();
            baseDbService.findOne = jest.fn().mockResolvedValueOnce(null);

            const result = await baseDbService.validateValues(context, condition, documentData);

            expect(result).toBe(null);
            expect(baseDbService.findOne).toHaveBeenCalledWith(context, {
                condition,
                includedAttributes,
            });
        });

        it('should return false if values not matched', async () => {
            const documentData = getDummyDoc();
            baseDbService.findOne = jest.fn().mockResolvedValueOnce({
                ...documentData,
                userId: 'otherUserId',
            });

            const result = await baseDbService.validateValues(context, condition, documentData);

            expect(result).toBe(false);
            expect(baseDbService.findOne).toHaveBeenCalledWith(context, {
                condition,
                includedAttributes,
            });
        });

        it('should return true if values matched', async () => {
            const documentData = getDummyDoc();
            baseDbService.findOne = jest.fn().mockResolvedValueOnce(documentData);

            const result = await baseDbService.validateValues(context, condition, documentData);

            expect(result).toBe(true);
            expect(baseDbService.findOne).toHaveBeenCalledWith(context, {
                condition,
                includedAttributes,
            });
        });
    });

    describe('exists', () => {
        const context = mockContext();
        const condition = {
            accountId: 'accountId',
            workspaceId: ['workspaceId'],
            userId: 'userId',
        };

        it('should return false if count = 0 ', async () => {
            baseDbService.count = jest.fn().mockResolvedValueOnce(0);

            const result = await baseDbService.exists(context, condition);

            expect(result).toBe(false);
            expect(baseDbService.count).toHaveBeenCalledWith(context, condition);
        });

        it('should return true if count > 0 ', async () => {
            baseDbService.count = jest.fn().mockResolvedValueOnce(1);

            const result = await baseDbService.exists(context, condition);

            expect(result).toBe(true);
            expect(baseDbService.count).toHaveBeenCalledWith(context, condition);
        });
    });

    describe('bulkUpdate', () => {
        const context = mockContext();
        it('should perform bulk update operation successfully', async () => {
            const condition = {
                accountId: 'exampleAccountId',
                workspaceId: 'workspaceId',
            };
            const updatedData = { userId: 'testUserId' };
            const batchSize = 1;
            const parallel = true;
            const mockQuery = {
                select: jest.fn().mockReturnThis(),
                batchSize: jest.fn().mockReturnThis(),
                cursor: jest.fn(),
            };
            mockModel.find.mockReturnValueOnce(mockQuery);
            const mockDocument = { _id: 'someId' };
            const mockCursor = {
                next: jest
                    .fn()
                    .mockImplementationOnce(() => Promise.resolve(mockDocument))
                    .mockImplementationOnce(() => Promise.resolve(null)),
            };
            mockQuery.cursor.mockReturnValue(mockCursor);
            mockQuery.cursor.mockReturnValueOnce(mockCursor);
            mockModel.bulkWrite.mockResolvedValueOnce({});

            await baseDbService.bulkUpdate(context, condition, updatedData, {
                batchSize,
                parallel,
            });

            expect(mockModel.find).toHaveBeenCalledWith(condition);
            expect(mockQuery.select).toHaveBeenCalledWith('_id');
            expect(mockQuery.batchSize).toHaveBeenCalledWith(batchSize);
            expect(mockQuery.cursor).toHaveBeenCalled();
            expect(mockModel.bulkWrite).toHaveBeenCalledWith([
                {
                    updateOne: {
                        filter: { _id: mockDocument._id },
                        update: { $set: updatedData },
                    },
                },
            ]);
        });
        it('should perform bulk update operation successfully - isParallel false', async () => {
            const condition = {
                accountId: 'exampleAccountId',
                workspaceId: 'workspaceId',
            };
            const updatedData = { userId: 'testUserId' };
            const batchSize = 4;
            const parallel = false;
            const mockQuery = {
                select: jest.fn().mockReturnThis(),
                batchSize: jest.fn().mockReturnThis(),
                cursor: jest.fn(),
            };
            mockModel.find.mockReturnValueOnce(mockQuery);

            const mockCursor = {
                next: jest
                    .fn()
                    .mockImplementationOnce(() => Promise.resolve({}))
                    .mockImplementationOnce(() => Promise.resolve(null)),
            };
            mockQuery.cursor.mockReturnValue(mockCursor);
            mockQuery.cursor.mockReturnValueOnce(mockCursor);
            mockModel.bulkWrite.mockResolvedValueOnce({});

            await baseDbService.bulkUpdate(context, condition, updatedData, {
                batchSize,
                parallel,
            });

            expect(mockModel.find).toHaveBeenCalledWith(condition);
            expect(mockQuery.select).toHaveBeenCalledWith('_id');
            expect(mockQuery.batchSize).toHaveBeenCalledWith(batchSize);
            expect(mockQuery.cursor).toHaveBeenCalled();
            expect(mockModel.bulkWrite).toHaveBeenCalled();
        });

        it('should perform bulk update check errorCount', async () => {
            const condition = {
                accountId: 'exampleAccountId',
                workspaceId: 'workspaceId',
            };
            const updatedData = { userId: 'testUserId' };
            const batchSize = 4;
            const parallel = false;
            const mockQuery = {
                select: jest.fn().mockReturnThis(),
                batchSize: jest.fn().mockReturnThis(),
                cursor: jest.fn(),
            };
            mockModel.find.mockReturnValueOnce(mockQuery);

            const mockCursor = {
                next: jest
                    .fn()
                    .mockImplementationOnce(() => Promise.resolve({}))
                    .mockImplementationOnce(() => Promise.resolve(null)),
            };
            mockQuery.cursor.mockReturnValue(mockCursor);

            const mockError = new Error('bulkWrite error');
            mockModel.bulkWrite = jest.fn().mockRejectedValue(mockError);

            const result = await baseDbService.bulkUpdate(context, condition, updatedData, {
                batchSize,
                parallel,
            });

            expect(mockQuery.cursor).toHaveBeenCalled();
            expect(mockModel.bulkWrite).toHaveBeenCalled();
            expect(result).toBeDefined();
            expect(result.errorCount).toBe(1);
            expect(result.failedBatches).toHaveLength(1);
        });

        it('should handle errors during bulk update operation', async () => {
            const condition = {
                accountId: 'exampleAccountId',
                workspaceId: 'workspaceId',
            };
            const updatedData = { userId: 'testUserId' };
            const batchSize = 10;
            const parallel = true;

            mockModel.bulkWrite.mockRejectedValueOnce(new Error('Database error'));

            await expect(
                baseDbService.bulkUpdate(context, condition, updatedData, {
                    batchSize,
                    parallel,
                }),
            ).rejects.toThrow(WfbException);
        });
    });
});
