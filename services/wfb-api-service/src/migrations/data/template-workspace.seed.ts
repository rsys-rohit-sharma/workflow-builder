import { UUID } from 'bson';

import { _generateAuditFields, _getAccountIdOfTemplate } from '../helper';

export const prepareWorkspace = (workspaceId: UUID, accountId?: UUID) => {
    const tid = accountId ? _getAccountIdOfTemplate() : accountId;
    return [
        {
            workspaceId,
            name: 'Hr',
            description: 'Hr Workspace',
            workspaceType: 'account',
            accountId: tid,
            audienceId: null,
            segmentId: null,
            iconImage: null,
            status: 'draft',
            components: [
                {
                    componentType: 'service_catalog',
                    componentName: 'Service Catalog',
                },
            ],
            version: 1,
            agentCount: 0,
            completionPercentage: 0,
            ..._generateAuditFields(),
            __v: 0,
        },
    ];
};
