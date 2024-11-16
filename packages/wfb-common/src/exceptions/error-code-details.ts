import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from './error-codes';
import { ExceptionDetailType } from './types';

const ERROR_CODE_DETAILS: Record<ErrorCode, ExceptionDetailType> = {
    [ErrorCode.PARTIAL_CHANGE]: {
        httpStatus: HttpStatus.PARTIAL_CONTENT,
        message: 'Partial Change',
        ufMessage: 'There was a partial change in the request.',
        httpStatusCodeText: 'Bad Request',
    },
    [ErrorCode.INVALID_INPUT]: {
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'Invalid Input',
        ufMessage: 'The input provided is invalid.',
        httpStatusCodeText: 'Bad Request',
    },
    [ErrorCode.THIRDPARTY_SERVICE_ERROR]: {
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Third Party Service Error',
        ufMessage: 'An error occurred while communicating with a third-party service.',
        httpStatusCodeText: 'Internal Server Error',
    },
    [ErrorCode.DATABASE_ERROR]: {
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Database Error',
        ufMessage: 'An error occurred while performing database operation.',
        httpStatusCodeText: 'Internal Server Error',
    },
    [ErrorCode.INVALID_WORKSPACE]: {
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'Invalid Workspace',
        ufMessage: 'The workspace specified is invalid.',
        httpStatusCodeText: 'Bad Request',
    },
    [ErrorCode.INACTIVE_WORKSPACE]: {
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'Inactive Workspace',
        ufMessage: 'The workspace specified is inactive.',
        httpStatusCodeText: 'Bad Request',
    },
    [ErrorCode.USER_NOT_FOUND]: {
        httpStatus: HttpStatus.NOT_FOUND,
        message: 'User Not Found',
        ufMessage: 'The user specified was not found.',
        httpStatusCodeText: 'Not Found',
    },
    [ErrorCode.DOCUMENT_NOT_FOUND]: {
        httpStatus: HttpStatus.NOT_FOUND,
        message: 'Document Not Found',
        ufMessage: 'The document specified was not found.',
        httpStatusCodeText: 'Not Found',
    },
    [ErrorCode.INTERNAL_SERVER_ERROR]: {
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        ufMessage: 'An internal server error occurred.',
        httpStatusCodeText: 'Internal Server Error',
    },
    [ErrorCode.UNEXPECTED_ERROR]: {
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unexpected Error',
        ufMessage: 'An unexpected error occurred.',
        httpStatusCodeText: 'Internal Server Error',
    },
    [ErrorCode.ACTION_NOT_ALLOWED]: {
        httpStatus: HttpStatus.FORBIDDEN,
        message: 'Action Not Allowed',
        ufMessage: 'The action is not allowed for the user.',
        httpStatusCodeText: 'Forbidden',
    },
    [ErrorCode.ACCOUNT_DETAILS_NOT_FOUND]: {
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'Account Details Not Found',
        ufMessage: 'The account details were not found.',
        httpStatusCodeText: 'Bad Request',
    },
    [ErrorCode.USER_ID_MISSING_IN_CONTEXT]: {
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'User ID Missing in Context',
        ufMessage: 'User ID is missing in the context.',
        httpStatusCodeText: 'Bad Request',
    },
    [ErrorCode.WORKSPACE_ID_MISSING_IN_CONTEXT]: {
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'Workspace ID Missing in Context',
        ufMessage: 'Workspace ID is missing in the context.',
        httpStatusCodeText: 'Bad Request',
    },
    [ErrorCode.SERVICE_CATEGORY_NAME_EXISTS]: {
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'Service Category Name already Exists',
        ufMessage: 'Service Category Name already Exists.',
        httpStatusCodeText: 'Bad Request',
    },
    [ErrorCode.INVALID_HEADERS]: {
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'Invalid Headers',
        ufMessage: 'Headers received in the request are invalid.',
        httpStatusCodeText: 'Bad Request',
    },
    [ErrorCode.WORKSPACE_NOT_FOUND]: {
        httpStatus: HttpStatus.NOT_FOUND,
        message: 'Workspace Not Found',
        ufMessage: 'The workspace specified was not found.',
        httpStatusCodeText: 'Not Found',
    },
    [ErrorCode.VALIDATION_DTO_NOT_DEFINED]: {
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Validation DTO Not found/defined',
        ufMessage: 'The DTO used here is not defined or not referenced properly.',
        httpStatusCodeText: 'Internal Server Error',
    },
    [ErrorCode.INVALID_CONTENT_IDS]: {
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'Invalid Content IDs',
        ufMessage: 'The content IDs provided are invalid.',
        httpStatusCodeText: 'Bad Request',
    },
    [ErrorCode.PROBES_ERROR]: {
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Probes Error',
        ufMessage: 'An error occurred while probing the service pod health.',
        httpStatusCodeText: 'Internal Server Error',
    },
    [ErrorCode.AUTHORIZATION_ERROR]: {
        httpStatus: HttpStatus.FORBIDDEN,
        message: 'Authorization Error',
        ufMessage: 'The user is not authorized to perform this action.',
        httpStatusCodeText: 'Forbidden',
    },
    [ErrorCode.ENRICH_CONTEXT_ERROR]: {
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Enrich Context Error',
        ufMessage: 'An error occurred while enriching the context.',
        httpStatusCodeText: 'Internal Server Error',
    },
};

export const getErrorCodeDetails = (code: ErrorCode): ExceptionDetailType => {
    return ERROR_CODE_DETAILS[code];
};
