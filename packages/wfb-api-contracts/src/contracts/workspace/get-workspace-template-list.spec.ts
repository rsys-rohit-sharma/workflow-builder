import { API_STATUS } from '../../constants';
import { validate } from '../../helpers/schema-validator';
import { getListAllApiGenericResponseTypeSchema } from '../response';
import {
    GetWorkspaceTemplateListAllRespOpenApiSchema,
    GetWorkspaceTemplateListAllRespSchema,
} from './get-workspace-template-list';
import { WorkspaceShortInfoSchema } from './workspace';

describe('GetWorkspaceTemplateListAllRespSchema', () => {
    it('should match schema generated by getListAllApiGenericResponseTypeSchema', () => {
        const expectedSchema = getListAllApiGenericResponseTypeSchema(WorkspaceShortInfoSchema);
        expect(GetWorkspaceTemplateListAllRespSchema).toEqual(expectedSchema);
    });

    it('should have a valid JSON transformation', () => {
        const schemaAsJSON = JSON.stringify(GetWorkspaceTemplateListAllRespSchema);
        const parsedSchema = JSON.parse(schemaAsJSON);
        expect(GetWorkspaceTemplateListAllRespOpenApiSchema).toEqual(parsedSchema);
    });

    it('should correctly validate data against the schema', () => {
        const validData = {
            status: API_STATUS.SUCCESS,
            message: 'Workspace Templates fetched successfully.',
            result: {
                listOfItems: [
                    {
                        name: 'Test Workspace',
                        description: 'Test Description',
                        workspaceId: '903fnf',
                    },
                ],
            },
        };

        const { errors, isValid } = validate(GetWorkspaceTemplateListAllRespSchema, validData);

        expect(isValid).toBeTruthy();
        expect(errors).toEqual('');
    });

    it('should invalidate incorrect data missing required fields', () => {
        const invalidData = {
            status: API_STATUS.SUCCESS,
            result: {
                listOfItems: [
                    {
                        name: 'Test Workspace',
                    },
                ],
            },
        };

        const { errors, isValid } = validate(GetWorkspaceTemplateListAllRespSchema, invalidData);
        expect(isValid).toBeFalsy();
        expect(errors).toBeTruthy();
    });
});
