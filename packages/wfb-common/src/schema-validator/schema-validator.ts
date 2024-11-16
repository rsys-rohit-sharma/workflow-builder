import { TypeCompiler } from '@sinclair/typebox/compiler';

export const validate = (schema: any, value: object) => {
    const C = TypeCompiler.Compile(schema);

    const isValid = C.Check(value);
    const all = [...C.Errors(value)];

    return {
        isValid,
        errors: all.length > 0 ? JSON.stringify(all) : '',
    };
};
