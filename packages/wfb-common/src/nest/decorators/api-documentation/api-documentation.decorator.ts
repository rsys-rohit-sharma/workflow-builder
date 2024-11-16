import { applyDecorators, HttpStatus, SetMetadata } from '@nestjs/common';
import {
    ApiBody,
    ApiBodyOptions,
    ApiHeaderOptions,
    ApiHeaders,
    ApiParam,
    ApiParamOptions,
    ApiQuery,
    ApiQueryOptions,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { ApiMetadataKeys, REQUIRED_HEADERS_LIST } from '../../../constants';

export type ApiDocumentationOptions = {
    apiName: string;
    description?: string;
    tags?: string[];
    apiBodySchema?: object;
    apiQuerySchema?: object;
    apiParamSchema?: object;
    apiRequestHeadersOptions?: ApiHeaderOptions[];
    errorResponseSchema: object;
    apiResponses: {
        status: HttpStatus;
        schema: object;
        description: string;
    }[];
};

export const ApiDocumentationDecorator = (options: ApiDocumentationOptions) => {
    const {
        apiName,
        description = '',
        tags = [],
        apiBodySchema = null,
        apiQuerySchema = null,
        apiParamSchema = null,
        apiRequestHeadersOptions = [],
        apiResponses,
        errorResponseSchema,
    } = options;

    const methodDecorators: MethodDecorator[] = [];
    const classDecorators: ClassDecorator[] = [];

    // Apply class-level metadata
    classDecorators.push(SetMetadata(ApiMetadataKeys.API_NAME, apiName), ApiTags(...tags));
    if (description) {
        classDecorators.push(SetMetadata(ApiMetadataKeys.API_DESCRIPTION, description));
    }

    // Apply header requirements if specified
    classDecorators.push(ApiHeaders([...REQUIRED_HEADERS_LIST, ...apiRequestHeadersOptions]));

    // Apply method-level decorators
    if (apiBodySchema) {
        methodDecorators.push(ApiBody({ schema: apiBodySchema } as ApiBodyOptions));
    }

    if (apiQuerySchema) {
        methodDecorators.push(
            ApiQuery({
                name: 'Query Params',
                schema: apiQuerySchema,
            } as ApiQueryOptions),
        );
    }

    // Apply class-level decorators for parameters
    if (apiParamSchema) {
        classDecorators.push(
            ApiParam({
                name: 'Path Params',
                schema: apiParamSchema,
            } as ApiParamOptions),
        );
    }

    // Apply response decorators
    apiResponses.forEach((apiResponse) => {
        classDecorators.push(ApiResponse(apiResponse));
    });

    classDecorators.push(
        ApiResponse({
            status: '4XX',
            schema: errorResponseSchema,
            description: 'Response if request is invalid or user is not authorized',
        }),
        ApiResponse({
            status: '5XX',
            schema: errorResponseSchema,
            description: 'Response if something goes wrong on the server side',
        }),
    );

    return applyDecorators(...classDecorators, ...methodDecorators);
};
