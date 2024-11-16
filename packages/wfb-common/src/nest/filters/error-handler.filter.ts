import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { HTTPStatusCodes } from '@simpplr/backend-commons';

import { ApiMetadataKeys, ApiStatus, VALIDATION_FAIL_ERROR_MESSAGE } from '../../constants';
import { WfbException, ErrorCode } from '../../exceptions';
import { ExceptionResponseType } from '../../exceptions/types';
import { LoggerFactory } from '../../logger';
import { WfbRequest, WfbResponse } from '../../types';
import { elapsedTime } from '../../utils';

type ExtractedErrData = {
    code: string;
    cause: unknown;
    message: string;
    ufMessage: string;
    details: unknown;
    statusCode: number;
};
@Catch(Error)
export class ErrorHandlerFilter implements ExceptionFilter {
    private readonly logger = LoggerFactory.getLogger('ErrorHandlerFilter');

    catch(err: Error, host: ExecutionContextHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<WfbResponse>();
        const request = ctx.getRequest<WfbRequest>();
        const apiName = request?.context ? request.context[ApiMetadataKeys.API_NAME] : '';
        const { statusCode, message, cause, details, ufMessage, code } = this._extractErrorDetails(err);
        this.logger.error({
            message,
            cause,
            details,
            statusCode,
            apiName,
        });

        response.status(statusCode).json({
            status: ApiStatus.ERROR,
            message,
            errors: [
                {
                    apiName,
                    message: ufMessage,
                    // Don't want to reveal internal details if it's not a validation error
                    ...(message === VALIDATION_FAIL_ERROR_MESSAGE && cause ? { cause } : {}),
                    code,
                    details,
                },
            ],
            timestamp: Date.now(),
            ...(request?.context?.hrtime ? { delay: elapsedTime(request.context.hrtime) } : {}),
        });
    }

    protected _extractErrorDetails(err: Error): ExtractedErrData {
        if (err instanceof WfbException) {
            const { code, message, ufMessage, details } = err.getResponse() as ExceptionResponseType;
            const statusCode = err.getStatus();
            return {
                code,
                cause: err.cause,
                message,
                ufMessage,
                details,
                statusCode,
            };
        }

        if (err instanceof HttpException) {
            const statusCode = err.getStatus();
            const { message, cause } = err;
            const details = err.getResponse() as {
                statusCode: number;
                message: string;
            };
            const code =
                details?.message === VALIDATION_FAIL_ERROR_MESSAGE
                    ? ErrorCode.INVALID_INPUT
                    : HTTPStatusCodes[statusCode].TXT_CODE;

            if (details?.message) {
                delete details.message;
            }

            if (details?.statusCode) {
                delete details.statusCode;
            }

            return {
                code,
                cause,
                message,
                ufMessage: 'An error occurred while processing the request.',
                details,
                statusCode,
            };
        }

        const cause = err;
        const { message } = err;
        const ufMessage = 'An error occurred while processing the request.';
        const code = ErrorCode.INTERNAL_SERVER_ERROR;
        const statusCode = 500;

        return {
            statusCode,
            code,
            cause,
            message,
            ufMessage,
            details: null,
        };
    }
}
