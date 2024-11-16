import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

import { ApplicationSettings, User, Workspace } from '../odm';
import { ServerTimingService } from './response.types';

interface ParsedQs {
    [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

interface Permissions {
    [key: string]: boolean;
}

export enum REQUEST_CONTEXT_DATA_TYPES {
    USER = 'user',
    WORKSPACE = 'workspace',
    APPLICATION_SETTINGS = 'applicationSettings',
}

export type RequestContext = {
    hrtime?: [number, number];
    url?: string;
    reqHeaders?: IncomingHttpHeaders;
    params?: Record<string, string>;
    queryParam?: ParsedQs;
    accountId: string;
    segmentId?: string;
    workspaceId?: string;
    userId?: string;
    userRole?: string;
    host?: string;
    feHost?: string;
    isAppManager?: boolean;
    apiName?: string;
    user?: User;
    workspace?: Workspace;
    applicationSettings?: ApplicationSettings;
    correlationId?: string;
    remoteCacheVersion?: string;
    isReqCachingEnabled?: boolean;
    serverTiming?: ServerTimingService;
};

export type WfbRequest = Request & {
    context: RequestContext;
    workspace?: {
        scope: string[];
    };
};
