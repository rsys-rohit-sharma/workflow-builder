import { ApiHeaderOptions } from '@nestjs/swagger';
import { TracingNamespaceKey } from '@simpplr/tracing';
import { Static, Type } from '@sinclair/typebox';

export const HEADERS = {
    ACCOUNT_ID: 'x-smtip-tid',
    SEGMENT_ID: 'x-smtip-sid',
    USER_ID: 'x-smtip-uid',
    CORRELATION_ID: 'x-smtip-cid',
    USER_ROLE: 'x-smtip-tenant-user-role',
    HOST: 'x-smtip-host',
    ROLE: 'x-smtip-tenant-user-role',
    SB_ID: 'x-smtip-sbid',
    FE_HOST: 'x-smtip-f-host',
    APP: 'x-smtip-app',
    WORKSPACE_ID: 'x-smtip-workspaceid',
    SF_ORG_ID: 'x-smtip-sf-orgid',
    SF_PEOPLE_ID: 'x-smtip-sf-peopleid',
    ACA_ORIGIN: 'Access-Control-Allow-Origin',
    ACA_CREDENTIALS: 'Access-Control-Allow-Credentials',
    ORIGIN: 'origin',
    REFERER: 'referer',
    CONTENT_TYPE: 'Content-Type',
    CONTENT_DISPOSITION: 'Content-Disposition',
    ACE_HEADERS: 'Access-Control-Expose-Headers',
    X_XSS_PROTECTION: 'x-xss-protection',
    X_FRAME_OPTIONS: 'x-frame-options',
    STRICT_TRANSPORT_SECURITY: 'strict-transport-security',
    REFERRER_POLICY: 'Referrer-Policy',
    CACHE_CONTROL: 'Cache-Control',
    X_CONTENT_TYPE_OPTIONS: 'X-Content-Type-Options',
    AUTHORIZATION: 'authorization',
};

export const HEADER_VALUES = {
    [HEADERS.X_XSS_PROTECTION]: '1; mode=block',
    [HEADERS.X_FRAME_OPTIONS]: 'SAMEORIGIN',
    [HEADERS.STRICT_TRANSPORT_SECURITY]: 'max-age=31536000; includeSubdomain',
    [HEADERS.REFERRER_POLICY]: 'origin-when-cross-origin',
    [HEADERS.CACHE_CONTROL]: 'no-store',
    [HEADERS.X_CONTENT_TYPE_OPTIONS]: 'nosniff',
};

export const BULK_WRITE_DEFAULT_BATCH_SIZE = 10;
export enum EnvType {
    DEV = 'dev',
    TEST = 'test',
    PROD = 'prod',
    QA = 'qa',
    UAT = 'uat',
    PERF = 'perf',
}
const NodeEnvType = Type.Enum(EnvType);
export type NODE_ENV_TYPE = Static<typeof NodeEnvType>;

export const REQUIRED_HEADERS_LIST: ApiHeaderOptions[] = [
    {
        name: HEADERS.ACCOUNT_ID,
        required: true,
        description: 'Account ID (UUID)',
        schema: {
            type: 'string',
            example: 'de312c41-6790-4f85-a175-91066c433453',
        },
    },
    {
        name: HEADERS.USER_ID,
        required: true,
        description: 'User ID (UUID)',
        schema: {
            type: 'string',
            example: '7d39c30f-3bef-4b11-8a97-29bdc135ae74',
        },
    },
    // {
    //     name: HEADERS.USER_ROLE,
    //     required: true,
    //     description: 'User Role',
    //     schema: {
    //         type: 'string',
    //         example: 'a8d8c6b0-8968-44a7-a034-00110cc25817',
    //     },
    // },
    // {
    //     name: HEADERS.HOST,
    //     required: true,
    //     description: 'Backend Host',
    //     schema: {
    //         type: 'string',
    //         example: 'beta-api.dev.simpplr.xyz',
    //     },
    // },
    // {
    //     name: HEADERS.FE_HOST,
    //     required: true,
    //     description: "FE Host",
    //     schema: {
    //         type: "string",
    //         example: "beta.dev.simpplr.xyz",
    //     },
    // },
    {
        name: HEADERS.SEGMENT_ID,
        required: false,
        description: 'Segment ID (UUID)',
        schema: {
            type: 'string',
            example: '',
        },
    },
];

export const OUTBOX_EVENTS_HEADER_KEYS = {
    ACCOUNT_ID: 'account_id',
    ACCOUNTID: 'accountId',
    SEGMENT_ID: 'segment_id',
    SEGMENTID: 'segmentId',
    USER_ID: 'user_id',
    USERID: 'userId',
    USER_ROLE: 'user_role',
    USERROLE: 'userRole',
    CORRELATION_ID: 'correlation_id',
    CORRELATIONID: 'correlationId',
    FE_HOST: 'feHost',
    BE_HOST: 'host',
};

export const REQUEST_CONTEXT_KEYS = {
    ACCOUNT_ID: 'accountId',
    SEGMENT_ID: 'segmentId',
    USER_ID: 'userId',
    CORRELATION_ID: 'correlationId',
    FE_HOST: 'feHost',
    BE_HOST: 'host',
    USER_ROLE: 'userRole',
    REQ_HEADERS: 'reqHeaders',
};

export const TRACING_HEADERS = [
    {
        nsKey: TracingNamespaceKey.ACCOUNT_ID as string,
        requiredHeaderKey: HEADERS.ACCOUNT_ID,
        fallbackHeaderKey1: OUTBOX_EVENTS_HEADER_KEYS.ACCOUNT_ID,
        fallbackHeaderKey2: OUTBOX_EVENTS_HEADER_KEYS.ACCOUNTID,
        reqContextKey: REQUEST_CONTEXT_KEYS.ACCOUNT_ID,
    },
    {
        nsKey: TracingNamespaceKey.USER_ID as string,
        requiredHeaderKey: HEADERS.USER_ID,
        fallbackHeaderKey1: OUTBOX_EVENTS_HEADER_KEYS.USER_ID,
        fallbackHeaderKey2: OUTBOX_EVENTS_HEADER_KEYS.USERID,
        reqContextKey: REQUEST_CONTEXT_KEYS.USER_ID,
    },
    {
        nsKey: TracingNamespaceKey.FE_HOST as string,
        requiredHeaderKey: HEADERS.FE_HOST,
        fallbackHeaderKey1: OUTBOX_EVENTS_HEADER_KEYS.FE_HOST,
        fallbackHeaderKey2: OUTBOX_EVENTS_HEADER_KEYS.FE_HOST,
        reqContextKey: REQUEST_CONTEXT_KEYS.FE_HOST,
    },
    {
        nsKey: TracingNamespaceKey.BE_HOST as string,
        requiredHeaderKey: HEADERS.HOST,
        fallbackHeaderKey1: OUTBOX_EVENTS_HEADER_KEYS.BE_HOST,
        fallbackHeaderKey2: OUTBOX_EVENTS_HEADER_KEYS.BE_HOST,
        reqContextKey: REQUEST_CONTEXT_KEYS.BE_HOST,
    },
    {
        nsKey: TracingNamespaceKey.BE_HOST as string,
        requiredHeaderKey: HEADERS.USER_ROLE,
        fallbackHeaderKey1: OUTBOX_EVENTS_HEADER_KEYS.USER_ROLE,
        fallbackHeaderKey2: OUTBOX_EVENTS_HEADER_KEYS.USERROLE,
        reqContextKey: REQUEST_CONTEXT_KEYS.USER_ROLE,
    },
    {
        nsKey: 'sid',
        requiredHeaderKey: HEADERS.SEGMENT_ID,
        fallbackHeaderKey1: OUTBOX_EVENTS_HEADER_KEYS.SEGMENT_ID,
        fallbackHeaderKey2: OUTBOX_EVENTS_HEADER_KEYS.SEGMENTID,
        reqContextKey: REQUEST_CONTEXT_KEYS.SEGMENT_ID,
    },
];

export const SERVER_TIMING_KEYS = {
    REQ_CONTEXT_BUILD: {
        name: 'reqValidationAndContextBuild',
        description: 'Req Validation & Ctx Build',
    },
    DB: {
        name: 'db',
        description: 'Database Query',
    },
    REQ_VALIDATION_AND_PREP: {
        name: 'reqValidationAndPrep',
        description: 'Req Validation & Prep',
    },
    RESPONSE_PREP: {
        name: 'responsePrep',
        description: 'Response Preparation',
    },
    AUTH_GUARD_CHECK: {
        name: 'authGuardCheck',
        description: 'Auth Guard Check',
    },
};

export enum ApiStatus {
    SUCCESS = 'success',
    ERROR = 'error',
}

export enum ApiMetadataKeys {
    API_NAME = 'apiName',
    API_DESCRIPTION = 'apiDescription',
}

export enum DBOperation {
    DELETE = 'd',
    UPDATE = 'u',
    CREATE = 'c',
    READ = 'r',
}

export const VALIDATION_FAIL_ERROR_MESSAGE = 'Validation failed';
export const DEFAULT_PAGE_SIZE = 10;
export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
    ASCENDING = 'ascending',
    DESCENDING = 'descending',
}

export enum ComponentType {
    SERVICE_CATALOG = 'serviceCatalog',
}

export enum SharedKafkaEvents {
    INGEST_HISTORICAL_DATA = 'ingest_historical_data',
}

export enum FeatureFlag {
    VAULT_ENABLED = 'beta_wfb_service_vault',
}

export const FAILURE_LOG_TYPES = {
    KAFKA: 'kafka',
    API: 'API',
};

export const USER_ROLES = {
    END_USER: 'a8d8c6b0-8968-44a7-a034-00110cc25817',
    APP_MANAGER: '3c774e6c-02b6-4b61-9d7d-03d083540136',
};

export const ACCOUNT_ID_FOR_WORKSPACE_TEMPLATES = '36d3df89-75ae-4bc6-883d-cedf955d8f6a';

export const USER_STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    PROFILE_COMPLETION_PENDING: 'ProfileCompletionPending',
    FREEZED: 'Freezed',
};

export const API_ENDPOINTS = {
    MODIFY_FF_TARGET_GROUP: (targetGroupId: string) =>
        `${process.env.SIMPPLR_TENANT_MGMT_MS_BASE_URL}/v1/accounts/ff/target-groups/${targetGroupId}`,
    GET_PERMISSIONS: (aId: string, rId: string, isSubFeatureRequired = false) =>
        `${process.env.SIMPPLR_IDENTITY_MGMT_MS_BASE_URL}/v1/identity/internal/accounts/permissions?account_id=${aId}&role_id=${rId}${isSubFeatureRequired ? '&action=subfeatureList' : ''}`,
    GET_APP_CONFIG: () => `${process.env.SIMPPLR_TENANT_INTRANET_MS_BASE_URL}/v1/account/internal/appConfig`,
    GET_BRANDING_AND_TENANT_INFO: () =>
        `${process.env.SIMPPLR_TENANT_INTRANET_MS_BASE_URL}/v1/account/internal/branding-and-tenant-info`,
};
