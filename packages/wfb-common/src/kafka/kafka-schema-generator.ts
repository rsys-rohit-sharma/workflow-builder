import { TObject, TSchema, Type } from '@sinclair/typebox';

export type KafkaConnectSchema = {
    type: 'string' | 'int32' | 'boolean' | 'struct' | 'array';
    optional?: boolean;
    fields?: Array<KafkaConnectField>;
    items?: KafkaConnectSchema;
};

type KafkaConnectField = {
    field: string;
    type: 'string' | 'int32' | 'boolean' | 'struct' | 'array';
    optional?: boolean;
    fields?: Array<KafkaConnectField>;
    items?: KafkaConnectSchema;
};

export const typeboxToKafkaConnect = (schema: TSchema): KafkaConnectSchema => {
    const transformField = (field) => {
        if (field.type === 'string') return { type: 'string', optional: field.optional };
        if (field.type === 'number') {
            return { type: 'int64', optional: field.optional };
        }
        if (field.type === 'boolean') return { type: 'boolean', optional: field.optional };
        if (field.type === 'array') {
            return {
                type: 'array',
                optional: field.optional,
                items: transformField(field.items),
            };
        }
        if (field.type === 'object') {
            return {
                type: 'struct',
                fields: Object.entries(field.properties).map(([key, value]) => ({
                    field: key,
                    ...transformField(value),
                })),
                optional: field.optional,
            };
        }
        return { type: 'string', optional: true };
    };

    return {
        type: 'struct',
        fields: Object.entries(schema.properties).map(([key, value]) => ({
            field: key,
            ...transformField(value),
        })),
        optional: schema.optional,
    };
};

export function getJsonSchemaFromObject(obj: unknown): TObject {
    const schemaProperties: Record<string, TSchema> = {};

    Object.keys(obj).forEach((key) => {
        const value = obj[key];

        if (typeof value === 'string') {
            schemaProperties[key] = Type.String();
        } else if (typeof value === 'number') {
            schemaProperties[key] = Type.Number();
        } else if (typeof value === 'boolean') {
            schemaProperties[key] = Type.Boolean();
        } else if (Array.isArray(value)) {
            schemaProperties[key] = Type.Array(value.length ? getJsonSchemaFromObject(value[0]) : Type.Any());
        } else if (typeof value === 'object' && value !== null) {
            schemaProperties[key] = getJsonSchemaFromObject(value);
        } else {
            schemaProperties[key] = Type.Any();
        }
    });

    return Type.Object(schemaProperties);
}
