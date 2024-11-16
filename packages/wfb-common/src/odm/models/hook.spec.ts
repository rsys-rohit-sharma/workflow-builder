import { generateUUIDV4 } from '@simpplr/backend-commons';
import { ObjectId, UUID } from 'bson';

import { _addFieldTransformations, _getAccountId, _validateAccountId, registerHooks } from './hooks';

const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
};

jest.mock('../../logger', () => ({
    LoggerFactory: {
        getLogger: () => mockLogger,
    },
}));

jest.mock('@simpplr/tracing', () => ({
    trace: {
        tracingNamespace: {
            get: jest.fn(),
        },
    },
    TracingNamespaceKey: {
        ACCOUNT_ID: 'tid',
    },
}));

describe('registerHooks', () => {
    let mockSchema;

    beforeEach(() => {
        mockSchema = {
            pre: jest.fn(),
            set: jest.fn(),
            paths: [],
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        mockSchema.pre.mockReset();
    });

    it('should register hooks for query methods', () => {
        const {
            trace: { tracingNamespace },
        } = jest.requireMock('@simpplr/tracing');
        mockLogger.debug = jest.fn();
        tracingNamespace.get.mockReturnValue('mockAccountId');

        registerHooks(mockSchema);

        expect(mockSchema.pre).toHaveBeenCalledTimes(18); // Number of query methods
        expect(mockLogger.debug).toHaveBeenCalledWith('Going to register pre hook for countDocuments');
        expect(mockLogger.debug).toHaveBeenCalled();
    });

    it('should register hooks for document methods', () => {
        const {
            trace: { tracingNamespace },
        } = jest.requireMock('@simpplr/tracing');
        mockLogger.debug = jest.fn();
        tracingNamespace.get.mockReturnValue('mockAccountId');

        registerHooks(mockSchema);

        expect(mockSchema.pre).toHaveBeenCalledTimes(18); // Number of document methods
        expect(mockLogger.debug).toHaveBeenCalled();
        // ... other assertions for document methods
    });

    /* it('should register aggregate hooks', () => {
    const {
      trace: { tracingNamespace },
    } = jest.requireMock('@simpplr/tracing');
    mockLogger.debug = jest.fn();
    tracingNamespace.get.mockReturnValue('mockAccountId');

    registerHooks(mockSchema);

    expect(mockSchema.pre).toHaveBeenCalledTimes(18); // Number of document methods
    expect(mockLogger.debug).toHaveBeenCalled();
  }); */

    describe('_getAccountId', () => {
        const {
            trace: { tracingNamespace },
        } = jest.requireMock('@simpplr/tracing');
        beforeEach(() => {
            tracingNamespace.get.mockReset();
        });

        it('throws an error when accountId is not found', () => {
            tracingNamespace.get.mockReturnValue(undefined);
            expect(() => _getAccountId()).toThrow('AccountId is not found in call context.');
        });

        it('returns accountId as a string when uuidObj is false or not provided', () => {
            const accountId = generateUUIDV4();
            tracingNamespace.get.mockReturnValue(accountId);
            expect(_getAccountId()).toBe(accountId);
            expect(_getAccountId(false)).toBe(accountId);
        });

        it('returns accountId as a UUID object when uuidObj is true', () => {
            const accountId = generateUUIDV4();
            tracingNamespace.get.mockReturnValue(accountId);
            const result = _getAccountId(true);
            expect(result).toBeInstanceOf(UUID);
            expect(result.toString()).toBe(accountId);
        });
    });

    jest.mock('mongoose');
    describe('_addFieldTransformations', () => {
        let schema;

        beforeEach(() => {
            schema = {
                set: jest.fn(),
                get: jest.fn(),
                path: jest.fn().mockReturnThis(),
                select: jest.fn(),
                paths: [],
            };
        });

        it('sets toJSON and toObject settings', () => {
            _addFieldTransformations(schema);
            expect(schema.set).toHaveBeenCalledWith('toJSON', { getters: true });
            expect(schema.set).toHaveBeenCalledWith('toObject', { getters: true });
        });

        it('sets select to false for excluded fields', () => {
            const field = {
                instance: 'UUID',
                get: jest.fn(),
                set: jest.fn(),
                transform: jest.fn(),
            };
            schema.paths = { accountId: field, segmentId: field, _id: field };
            _addFieldTransformations(schema);
            expect(schema.path).toHaveBeenCalledWith('accountId');
            expect(schema.path).toHaveBeenCalledWith('segmentId');
            expect(schema.path).toHaveBeenCalledWith('_id');
        });

        it('sets get and set methods for UUID fields', () => {
            const field = {
                instance: 'UUID',
                get: jest.fn(),
                set: jest.fn(),
                transform: jest.fn(),
            };
            schema.paths = { uuidId: field };
            _addFieldTransformations(schema);
            expect(field.get).toHaveBeenCalledWith(expect.any(Function));
            expect(field.set).toHaveBeenCalledWith(expect.any(Function));
        });

        it('sets get and set methods for ObjectId fields', () => {
            const field = {
                instance: 'ObjectId',
                get: jest.fn(),
                set: jest.fn(),
                transform: jest.fn(),
            };
            schema.paths = { objectId: field };
            _addFieldTransformations(schema);
            expect(field.get).toHaveBeenCalledWith(expect.any(Function));
            expect(field.set).toHaveBeenCalledWith(expect.any(Function));
        });

        it('field.get:uuid returns null when the input is null', () => {
            const field = {
                instance: 'UUID',
                get: jest.fn((callback) => callback(null)),
                set: jest.fn(),
                transform: jest.fn(),
            };
            schema.paths = { uuidId: field };
            _addFieldTransformations(schema);
            expect(field.get).toHaveReturnedWith(null);
        });

        it('field.get:uuidreturns the string representation of the UUID when the input is a UUID', () => {
            const uuid = new UUID();
            const field = {
                instance: 'UUID',
                get: jest.fn((callback) => callback(uuid)),
                set: jest.fn(),
                transform: jest.fn(),
            };
            schema.paths = { uuidId: field };
            _addFieldTransformations(schema);
            expect(field.get).toHaveReturnedWith(uuid.toString());
        });

        it('field.set:uuid returns null when the input is null', () => {
            const field = {
                instance: 'UUID',
                set: jest.fn((callback) => callback(null)),
                get: jest.fn(),
                transform: jest.fn(),
            };
            schema.paths = { uuidId: field };
            _addFieldTransformations(schema);
            expect(field.set).toHaveReturnedWith(null);
        });

        it('field.set:uuid returns the string representation of the UUID when the input is a UUID', () => {
            const uuid = '550e8400-e29b-41d4-a716-446655440000';
            const field = {
                instance: 'UUID',
                set: jest.fn((callback) => callback(uuid)),
                get: jest.fn(),
                transform: jest.fn(),
            };
            schema.paths = { uuidId: field };
            _addFieldTransformations(schema);
            const returnedValue = field.set.mock.results[0].value;
            expect(returnedValue).toBeInstanceOf(UUID);
            expect(returnedValue.toString()).toEqual(uuid);
        });

        it('field.get:objectid returns null when the input is null', () => {
            const field = {
                instance: 'ObjectId',
                get: jest.fn((callback) => callback(null)),
                set: jest.fn(),
                transform: jest.fn(),
            };
            schema.paths = { objectId: field };
            _addFieldTransformations(schema);
            expect(field.get).toHaveReturnedWith(null);
        });

        it('field.get:objectid returns the string representation of the ObjectId when the input is a ObjectId', () => {
            const uuid = new ObjectId();
            const field = {
                instance: 'ObjectId',
                get: jest.fn((callback) => callback(uuid)),
                set: jest.fn(),
                transform: jest.fn(),
            };
            schema.paths = { objectId: field };
            _addFieldTransformations(schema);
            expect(field.get).toHaveReturnedWith(uuid.toString());
        });

        it('field.set:objectid returns null when the input is null', () => {
            const field = {
                instance: 'ObjectId',
                set: jest.fn((callback) => callback(null)),
                get: jest.fn(),
                transform: jest.fn(),
            };
            schema.paths = { objectId: field };
            _addFieldTransformations(schema);
            expect(field.set).toHaveReturnedWith(null);
        });

        it('field.set:objectid returns the string representation of the ObjectId when the input is a ObjectId', () => {
            const uuid = new ObjectId('507f181e810c18729de860ea').toString();
            const field = {
                instance: 'ObjectId',
                set: jest.fn((callback) => callback(uuid)),
                get: jest.fn(),
                transform: jest.fn(),
            };
            schema.paths = { objectId: field };
            _addFieldTransformations(schema);
            const returnedValue = field.set.mock.results[0].value;
            expect(returnedValue).toBeInstanceOf(ObjectId);
            expect(returnedValue.toString()).toEqual(uuid);
        });
    });

    describe('_validateAccountId', () => {
        const {
            trace: { tracingNamespace },
        } = jest.requireMock('@simpplr/tracing');

        jest.mock('./hooks', () => ({
            ...jest.requireActual('./hooks'),
            _getAccountId: jest.fn(),
        }));

        const { _getAccountId } = jest.requireMock('./hooks');

        beforeEach(() => {
            tracingNamespace.get.mockImplementation(() => generateUUIDV4());
            (_getAccountId as jest.Mock).mockReset();
        });

        it('throws an error when documentAccountId is not provided', () => {
            expect(() => _validateAccountId('')).toThrow('AccountId is not provided in the document.');
        });

        it('throws an error when documentAccountId does not match accountId', () => {
            const documentAccountId = generateUUIDV4();
            const accountId = generateUUIDV4();
            tracingNamespace.get.mockImplementation(() => accountId);
            (_getAccountId as jest.Mock).mockReturnValue(accountId);
            expect(() => _validateAccountId(documentAccountId)).toThrow(
                `Document.accountId ({${documentAccountId}}) is not matching with tracing.accountId {${accountId}}.`,
            );
        });

        it('does not throw an error when documentAccountId matches accountId', () => {
            const accountId = generateUUIDV4();
            tracingNamespace.get.mockImplementation(() => accountId);
            (_getAccountId as jest.Mock).mockReturnValue(accountId);
            expect(() => _validateAccountId(accountId)).not.toThrow();
        });
    });
});
