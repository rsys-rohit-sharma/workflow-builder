export enum ErrorCode {
    PARTIAL_CHANGE = 'PARTIAL_CHANGE',
    INVALID_INPUT = 'INVALID_INPUT',
    THIRDPARTY_SERVICE_ERROR = 'THIRDPARTY_SERVICE_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
    AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
    ACTION_NOT_ALLOWED = 'ACTION_NOT_ALLOWED',
    ACCOUNT_DETAILS_NOT_FOUND = 'ACCOUNT_DETAILS_NOT_FOUND',
    INVALID_HEADERS = 'INVALID_HEADERS',
    DOCUMENT_NOT_FOUND = 'DOCUMENT_NOT_FOUND',

    INVALID_WORKSPACE = 'INVALID_WORKSPACE',
    INACTIVE_WORKSPACE = 'INACTIVE_WORKSPACE',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    WORKSPACE_NOT_FOUND = 'WORKSPACE_NOT_FOUND',
    VALIDATION_DTO_NOT_DEFINED = 'VALIDATION_DTO_NOT_DEFINED',
    INVALID_CONTENT_IDS = 'INVALID_CONTENT_IDS',
    PROBES_ERROR = 'PROBES_ERROR',
    ENRICH_CONTEXT_ERROR = 'ENRICH_CONTEXT_ERROR',
    USER_ID_MISSING_IN_CONTEXT = 'USER_ID_MISSING_IN_CONTEXT',
    WORKSPACE_ID_MISSING_IN_CONTEXT = 'WORKSPACE_ID_MISSING_IN_CONTEXT',
    SERVICE_CATEGORY_NAME_EXISTS = 'SERVICE_CATEGORY_NAME_EXISTS',
}
