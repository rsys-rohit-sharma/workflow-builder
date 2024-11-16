import { HEADERS } from '../constants';
import { WfbRequest, RequestContext } from '../types';

export const elapsedTime = (startHrTime: [number, number]) => {
    const elapsedHrTime = process.hrtime(startHrTime);
    return elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
};

export const makeRequestContext = (context: Partial<RequestContext> & { accountId: string }): RequestContext => {
    return {
        accountId: context.accountId,
        userId: context.userId || '',
        hrtime: context.hrtime || process.hrtime(),
        url: context.url || '',
        reqHeaders: context.reqHeaders || {},
        params: context.params || {},
        queryParam: context.queryParam || {},
        segmentId: context.segmentId,
        userRole: context.userRole || '',
        isAppManager: context.isAppManager || false,
    };
};

export const getHeaders = (context: RequestContext) => {
    const headers = {
        [HEADERS.ACCOUNT_ID]: context.accountId,
        [HEADERS.USER_ID]: context.userId,
        [HEADERS.ROLE]: context.userRole,
        [HEADERS.HOST]: context.host,
        [HEADERS.FE_HOST]: context.feHost,
    };
    return headers;
};

export const stripNulls = (obj: Record<string, unknown>): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    Object.keys(obj).forEach((key) => {
        const value = obj[key];

        if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
                result[key] = value
                    .filter((item) => item !== null && item !== undefined)
                    .map((item) =>
                        typeof item === 'object' && item !== null ? stripNulls(item as Record<string, unknown>) : item,
                    );
            } else if (typeof value === 'object') {
                result[key] = stripNulls(value as Record<string, unknown>);
            } else {
                result[key] = value;
            }
        }
    });

    return result;
};

export const commaSeparatedStringToArray = (commaSeparatedStr: string): string[] =>
    commaSeparatedStr
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item);

export const getSchemaPaths = (req: WfbRequest) => {
    const { path } = req;
    const newPath = path.replace(/[0-9a-fA-F-]{36}/g, 'uuid');
    return `${req.method}_${req.baseUrl}${newPath}`;
};

export const getUniqueStrings = (arr: string[]): string[] => {
    return [...new Set(arr)];
};
