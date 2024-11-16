import { Type } from '@sinclair/typebox';

import { GenericApiResponseType, getGenericApiResponseTypeSchema } from '../response';
import { WorkspaceSchema, WorkspaceType } from './workspace';

export type GetWorkspaceTemplateResponseType = GenericApiResponseType<WorkspaceType>;
export const GetWorkspaceTemplateRespSchema = getGenericApiResponseTypeSchema(WorkspaceSchema);
export const GetWorkspaceTemplateRespOpenApiSchema = Type.Strict(GetWorkspaceTemplateRespSchema);
