import moment from 'moment-timezone';

export function formatDate(date: Date, formatString: string, timezone?: string): string {
    if (timezone) {
        return moment(date).tz(timezone).format(formatString);
    }

    return moment(date).utc().format(formatString);
}

export function formatTimestamp(timestamp: number, formatString: string, timezone?: string): string {
    const date = new Date(timestamp);
    return formatDate(date, formatString, timezone);
}

export function formatTimestampToMMDDYYYYHHMM(timestamp: number, timezone?: string): string {
    return formatTimestamp(timestamp, 'MMM DD, YYYY hh:mm A', timezone);
}
