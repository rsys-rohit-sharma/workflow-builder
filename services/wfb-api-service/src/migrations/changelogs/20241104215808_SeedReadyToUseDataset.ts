import { MigrationInterface } from 'mongo-migrate-ts';
import { Db } from 'mongodb';

import {
    prepareAgentGroups,
    prepareApplication,
    prepareApplicationUser,
    prepareBusinessHour,
    preparePermission,
    prepareRoles,
    prepareServiceCatalog,
    prepareWorkspace,
} from '../data';
import { prepareApplicationPolicy } from '../data/application-policy.seed';
import { _dropCollections, _generateBsonUUID, _insertManyDocuments } from '../helper';

export class SeedReadyToUseDataset20241104215808 implements MigrationInterface {
    public async up(db: Db, client: any): Promise<void> {
        const session = client.startSession();

        try {
            const [accountId, templateWorkspaceId, mainWorkspaceId, businessHourId] = [
                _generateBsonUUID(),
                _generateBsonUUID(),
                _generateBsonUUID(),
                _generateBsonUUID(),
            ];
            await session.withTransaction(async () => {
                await seedWorkspaceTemplate(db, templateWorkspaceId, businessHourId, session);
                await seedAccountData(db, accountId, mainWorkspaceId, businessHourId, session);
            });
        } finally {
            await session.endSession();
        }
    }

    public async down(db: Db, client: any): Promise<void> {
        await _dropCollections(db, [
            'users',
            'application_settings',
            'application_policies',
            'application_business_hours',
            'application_permissions',
            'application_roles',
            'workspaces',
            'agent_groups',
            'service_categories',
            'service_items',
        ]);
    }
}

// Function to seed workspace template data
async function seedWorkspaceTemplate(db: Db, templateWorkspaceId: any, businessHourId: any, session: any) {
    const [templateItems, templateCategory] = prepareServiceCatalog(templateWorkspaceId);

    await _insertManyDocuments(db, 'workspaces', prepareWorkspace(templateWorkspaceId), session);
    await _insertManyDocuments(db, 'agent_groups', prepareAgentGroups(templateWorkspaceId, businessHourId), session);
    await _insertManyDocuments(db, 'service_categories', templateCategory, session);
    await _insertManyDocuments(db, 'service_items', templateItems, session);
}

// Function to seed main account data
async function seedAccountData(db: Db, accountId: any, mainWorkspaceId: any, businessHourId: any, session: any) {
    const [workspaceItems, workspaceCategory] = prepareServiceCatalog(mainWorkspaceId, accountId);

    await _insertManyDocuments(db, 'application_settings', prepareApplication(accountId), session);
    await _insertManyDocuments(db, 'application_roles', prepareRoles(accountId), session);
    await _insertManyDocuments(db, 'application_permissions', preparePermission(accountId), session);
    await _insertManyDocuments(db, 'users', prepareApplicationUser(accountId), session);
    await _insertManyDocuments(db, 'application_policies', prepareApplicationPolicy(accountId), session);
    await _insertManyDocuments(
        db,
        'application_business_hours',
        prepareBusinessHour(accountId, businessHourId),
        session,
    );
    await _insertManyDocuments(db, 'workspaces', prepareWorkspace(mainWorkspaceId, accountId), session);
    await _insertManyDocuments(
        db,
        'agent_groups',
        prepareAgentGroups(mainWorkspaceId, businessHourId, accountId),
        session,
    );
    await _insertManyDocuments(db, 'service_categories', workspaceCategory, session);
    await _insertManyDocuments(db, 'service_items', workspaceItems, session);
}
