import { Type } from '@sinclair/typebox';

import { getListAllApiGenericResponseTypeSchema, ListAllApiResponseType } from '../response';
import { WorkspaceShortInfoSchema, WorkspaceShortInfoType } from './workspace';

export type GetWorkspaceTemplateListAllResponseType = ListAllApiResponseType<WorkspaceShortInfoType>;
export const GetWorkspaceTemplateListAllRespSchema = getListAllApiGenericResponseTypeSchema(WorkspaceShortInfoSchema);
export const GetWorkspaceTemplateListAllRespOpenApiSchema = Type.Strict(GetWorkspaceTemplateListAllRespSchema);
