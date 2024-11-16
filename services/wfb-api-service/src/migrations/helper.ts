import { generateUUIDV4 } from '@simpplr/backend-commons';
import { ACCOUNT_ID_FOR_WORKSPACE_TEMPLATES } from '@simpplr/wfb-common';
import { UUID } from 'bson';
import { Db } from 'mongodb';

export function _generateBsonUUID(uuid?: string): UUID {
    return uuid ? new UUID(generateUUIDV4()) : new UUID(uuid);
}

export function _getAccountIdOfTemplate(): UUID {
    return new UUID(ACCOUNT_ID_FOR_WORKSPACE_TEMPLATES);
}

export async function _insertDocument(db: Db, collectionName: string, document: object, session: any): Promise<void> {
    await db.collection(collectionName).insertOne(document, { session });
}

export async function _insertManyDocuments(
    db: Db,
    collectionName: string,
    documents: object[],
    session?: any,
): Promise<void> {
    await db.collection(collectionName).insertMany(documents, { session });
}

export async function _dropCollections(db: Db, collections: string[]): Promise<void> {
    for (const collectionName of collections) {
        const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
        if (collectionExists) {
            await db.collection(collectionName).drop();
            console.log(`Dropped collection: ${collectionName}`);
        } else {
            console.warn(`Collection not found: ${collectionName}`);
        }
    }
}

export function _generateAuditFields() {
    return {
        createdAt: new Date(),
        modifiedAt: new Date(),
        createdBy: null,
        modifiedBy: null,
        deletedAt: null,
    };
}
