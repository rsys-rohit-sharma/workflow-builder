import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

import { HEADER_VALUES, HEADERS, SERVER_TIMING_KEYS } from '../../constants';
import { WfbRequest, WfbResponse, RequestContext } from '../../types';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    setReqContext(req: WfbRequest, res: WfbResponse): RequestContext {
        return {
            accountId: req.headers[HEADERS.ACCOUNT_ID] as string,
            userId: req.headers[HEADERS.USER_ID] as string,
            userRole: req.headers[HEADERS.USER_ROLE] as string,
            host: req.headers[HEADERS.HOST] as string,
            feHost: req.headers[HEADERS.FE_HOST] as string,
            segmentId: (req.headers[HEADERS.SEGMENT_ID] as string) || null,
            workspaceId: (req.headers[HEADERS.WORKSPACE_ID] as string) || null,
            hrtime: process.hrtime(),
            url: req.url,
            reqHeaders: req.headers,
            params: req.params || {},
            queryParam: req.query || {},
            correlationId: req.headers[HEADERS.CORRELATION_ID] as string,
            serverTiming: {
                startTime: res.startTime,
                endTime: res.endTime,
                setMetric: res.setMetric,
            },
        };
    }

    async use(req: WfbRequest, res: WfbResponse, next: NextFunction) {
        res?.startTime?.(SERVER_TIMING_KEYS.REQ_CONTEXT_BUILD.name, SERVER_TIMING_KEYS.REQ_CONTEXT_BUILD.description);
        const nextWrapper = (...args) => {
            res?.endTime?.(SERVER_TIMING_KEYS.REQ_CONTEXT_BUILD.name);
            next(...args);
        };

        res.set(HEADERS.ACA_ORIGIN, req.headers.origin);
        res.set(HEADERS.ACA_CREDENTIALS, 'true');
        res.set(HEADERS.X_XSS_PROTECTION, HEADER_VALUES[HEADERS.X_XSS_PROTECTION]);
        res.set(HEADERS.X_FRAME_OPTIONS, HEADER_VALUES[HEADERS.X_FRAME_OPTIONS]);
        res.set(HEADERS.STRICT_TRANSPORT_SECURITY, HEADER_VALUES[HEADERS.STRICT_TRANSPORT_SECURITY]);
        res.set(HEADERS.REFERRER_POLICY, HEADER_VALUES[HEADERS.REFERRER_POLICY]);
        res.set(HEADERS.CACHE_CONTROL, HEADER_VALUES[HEADERS.CACHE_CONTROL]);
        res.set(HEADERS.X_CONTENT_TYPE_OPTIONS, HEADER_VALUES[HEADERS.X_CONTENT_TYPE_OPTIONS]);

        req.context = this.setReqContext(req, res);
        nextWrapper();
    }
}
