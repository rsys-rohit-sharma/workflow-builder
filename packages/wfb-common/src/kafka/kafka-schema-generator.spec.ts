import { TSchema, Type } from '@sinclair/typebox';

import { getJsonSchemaFromObject, typeboxToKafkaConnect } from './kafka-schema-generator';

describe('typeboxToKafkaConnect', () => {
    it('should convert typebox schema to Kafka Connect schema', () => {
        const typeboxSchema: TSchema = Type.Object({
            name: Type.String(),
            memberCount: Type.Optional(Type.Number()),
            isAllowedToClear: Type.Boolean(),
            colors: Type.Object({
                type: Type.Optional(Type.Array(Type.String())),
            }),
            form: Type.Any(),
        });

        const expectedKafkaConnectSchema = {
            fields: [
                {
                    field: 'name',
                    optional: undefined,
                    type: 'string',
                },
                {
                    field: 'memberCount',
                    optional: undefined,
                    type: 'int64',
                },
                {
                    field: 'isAllowedToClear',
                    optional: undefined,
                    type: 'boolean',
                },
                {
                    field: 'colors',
                    fields: [
                        {
                            field: 'type',
                            items: {
                                optional: undefined,
                                type: 'string',
                            },
                            optional: undefined,
                            type: 'array',
                        },
                    ],
                    optional: undefined,
                    type: 'struct',
                },
                { field: 'form', type: 'string', optional: true },
            ],
            optional: undefined,
            type: 'struct',
        };

        const kafkaConnectSchema = typeboxToKafkaConnect(typeboxSchema);

        expect(kafkaConnectSchema).toEqual(expectedKafkaConnectSchema);
    });
});

describe('getJsonSchemaForObject', () => {
    it('should generate JSON schema from object', () => {
        const input = {
            name: 'HR',
            memberCount: 30,
            isAllowedToClear: true,
        };

        const expectedSchema = Type.Object({
            name: Type.String(),
            memberCount: Type.Number(),
            isAllowedToClear: Type.Boolean(),
        });

        const jsonSchemaFromObject = getJsonSchemaFromObject(input);

        expect(jsonSchemaFromObject).toEqual(expectedSchema);
    });

    it('should generate schema for nested object', () => {
        const input = {
            name: 'John Doe',
            address: {
                street: '123 Main St',
                city: 'New York',
            },
        };

        const expectedSchema = Type.Object({
            name: Type.String(),
            address: Type.Object({
                street: Type.String(),
                city: Type.String(),
            }),
        });

        const jsonSchemaFromObject = getJsonSchemaFromObject(input);

        expect(jsonSchemaFromObject).toEqual(expectedSchema);
    });

    it('should generate schema for object with array of objects', () => {
        const input = {
            name: 'HR',
            components: [
                {
                    componentName: 'Service Catalog',
                    componentType: 'service_catalog',
                },
            ],
        };

        const expectedSchema = Type.Object({
            name: Type.String(),
            components: Type.Array(
                Type.Object({
                    componentName: Type.String(),
                    componentType: Type.String(),
                }),
            ),
        });

        const jsonSchemaFromObject = getJsonSchemaFromObject(input);

        expect(jsonSchemaFromObject).toEqual(expectedSchema);
    });

    it('should handle empty arrays as Type.Any()', () => {
        const input = {
            name: 'IT',
            components: [],
            componentType: undefined,
        };

        const expectedSchema = Type.Object({
            name: Type.String(),
            components: Type.Array(Type.Any()),
            componentType: Type.Any(),
        });

        const jsonSchemaFromObject = getJsonSchemaFromObject(input);

        expect(jsonSchemaFromObject).toEqual(expectedSchema);
    });

    it('should handle undefined as Type.Any()', () => {
        const input = {
            name: 'IT',
            componentType: undefined,
        };

        const expectedSchema = Type.Object({
            name: Type.String(),
            componentType: Type.Any(),
        });

        const jsonSchemaFromObject = getJsonSchemaFromObject(input);

        expect(jsonSchemaFromObject).toEqual(expectedSchema);
    });
});
