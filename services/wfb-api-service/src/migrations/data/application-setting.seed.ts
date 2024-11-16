import { UUID } from 'bson';

import { _generateAuditFields } from '../helper';

export const prepareApplication = (accountId: UUID) => [
    {
        accountId,
        segmentId: null,
        wfbEnabled: true,
        applicationSegments: [],
        applicationAudience: [],
        tenantMetadata: {
            feHost: 'feHost',
            appName: 'Radiansys',
        },
        ..._generateAuditFields(),
        __v: 0,
    },
];
