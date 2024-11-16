import { UUID } from 'bson';

import { _generateAuditFields } from '../helper';

export const prepareBusinessHour = (accountId: UUID, businessHourId: UUID) => [
    {
        businessHourId: businessHourId,
        name: 'Default',
        description: 'Default business Calender',
        timezoneName: 'America/Los_Angeles',
        timezoneGmtOffset: 'UTC -08:00',
        isOperationalAllHours: false,
        isDefaultBusinessHour: true,
        canDelete: false,
        accountId,
        segmentId: null,
        workspaceId: null,
        workingHours: [
            {
                day: 'Monday',
                isEnabled: true,
                startTime: '08:00',
                endTime: '17:00',
                hours: 9,
            },
            {
                day: 'Tuesday',
                isEnabled: true,
                startTime: '08:00',
                endTime: '16:00',
                hours: 8,
            },
            {
                day: 'Wednesday',
                isEnabled: true,
                startTime: '08:00',
                endTime: '16:00',
                hours: 8,
            },
            {
                day: 'Thursday',
                isEnabled: true,
                startTime: '08:00',
                endTime: '16:00',
                hours: 8,
            },
            {
                day: 'Friday',
                isEnabled: true,
                startTime: '08:00',
                endTime: '16:00',
                hours: 8,
            },
            {
                day: 'Saturday',
                isEnabled: true,
                startTime: '08:00',
                endTime: '16:00',
                hours: 8,
            },
            {
                day: 'Sunday',
                isEnabled: true,
                startTime: '08:00',
                endTime: '16:00',
                hours: 8,
            },
        ],
        holidayList: [],
        ..._generateAuditFields(),
        __v: 0,
    },
];
