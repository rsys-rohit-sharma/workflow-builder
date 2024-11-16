import { UUID } from 'bson';

import { _generateAuditFields, _generateBsonUUID, _getAccountIdOfTemplate } from '../helper';

export const prepareAgentGroups = (workspaceId: UUID, businessHourId: UUID, accountId?: UUID) => {
    const tid = accountId ? _getAccountIdOfTemplate() : accountId;
    return [
        {
            agentGroupId: _generateBsonUUID(),
            name: 'HR Operation Team',
            description: 'Hr Operation Team',
            businessHourId,
            accountId: tid,
            workspaceId,
            segmentId: null,
            agentCount: 0,
            automationRules: [],
            isDefaultBusinessHour: true,
            isAccessRestrictedToGroup: false,
            ..._generateAuditFields(),
            __v: 0,
        },
        {
            agentGroupId: _generateBsonUUID(),
            name: 'Benefits and compensation team',
            description: 'Benefits and compensation team',
            businessHourId,
            workspaceId,
            accountId: tid,
            segmentId: null,
            agentCount: 0,
            automationRules: [],
            isDefaultBusinessHour: true,
            isAccessRestrictedToGroup: false,
            ..._generateAuditFields(),
            __v: 0,
        },
        {
            agentGroupId: _generateBsonUUID(),
            name: 'Employee relation team',
            description: 'Employee relation team',
            businessHourId,
            workspaceId,
            accountId: tid,
            segmentId: null,
            agentCount: 0,
            automationRules: [],
            isDefaultBusinessHour: true,
            isAccessRestrictedToGroup: false,
            ..._generateAuditFields(),
            __v: 0,
        },
    ];
};
