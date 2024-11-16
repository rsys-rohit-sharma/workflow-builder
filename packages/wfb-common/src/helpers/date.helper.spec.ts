import { formatDate, formatTimestamp, formatTimestampToMMDDYYYYHHMM } from './date.helper';

describe('Date Helper Functions', () => {
    describe('formatDate', () => {
        it('should format date without timezone', () => {
            const date = new Date('2024-07-31T11:50:00Z');
            const formatString = 'MMM DD, YYYY hh:mm A';
            const formattedDate = formatDate(date, formatString);
            expect(formattedDate).toBe('Jul 31, 2024 11:50 AM');
        });

        it('should format date with timezone', () => {
            const date = new Date('2024-07-31T11:50:00Z');
            const formatString = 'MMM DD, YYYY hh:mm A';
            const timezone = 'America/New_York';
            const formattedDate = formatDate(date, formatString, timezone);
            expect(formattedDate).toBe('Jul 31, 2024 07:50 AM');
        });
    });

    describe('formatTimestamp', () => {
        it('should format timestamp without timezone', () => {
            const timestamp = Date.parse('2024-07-31T11:50:00Z');
            const formatString = 'MMM DD, YYYY hh:mm A';
            const formattedDate = formatTimestamp(timestamp, formatString);
            expect(formattedDate).toBe('Jul 31, 2024 11:50 AM');
        });

        it('should format timestamp with timezone', () => {
            const timestamp = Date.parse('2024-07-31T11:50:00Z');
            const formatString = 'MMM DD, YYYY hh:mm A';
            const timezone = 'America/New_York';
            const formattedDate = formatTimestamp(timestamp, formatString, timezone);
            expect(formattedDate).toBe('Jul 31, 2024 07:50 AM');
        });
    });

    describe('formatTimestampToMMDDYYYYHHMM', () => {
        it('should format timestamp to "MMM DD, YYYY hh:mm A" without timezone', () => {
            const timestamp = Date.parse('2024-07-31T11:50:00Z');
            const formattedDate = formatTimestampToMMDDYYYYHHMM(timestamp);
            expect(formattedDate).toBe('Jul 31, 2024 11:50 AM');
        });

        it('should format timestamp to "MMM DD, YYYY hh:mm A" with timezone', () => {
            const timestamp = Date.parse('2024-07-31T11:50:00Z');
            const timezone = 'America/New_York';
            const formattedDate = formatTimestampToMMDDYYYYHHMM(timestamp, timezone);
            expect(formattedDate).toBe('Jul 31, 2024 07:50 AM');
        });
    });
});
