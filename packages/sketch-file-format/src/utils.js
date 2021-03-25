import Ajv from 'ajv';
/**
 * Configure Ajv instance in one place.
 */
const getAjvInstance = () => {
    const ajv = new Ajv({
        verbose: true,
        strict: true,
    });
    ajv.addKeyword({
        keyword: 'deprecated',
        validate: (schema) => typeof schema === 'boolean',
    });
    ajv.addKeyword({
        keyword: 'enumDescriptions',
        validate: (schema, _data, parent) => Array.isArray(schema) &&
            Array.isArray(parent.enum) &&
            schema.length === parent.enum.length,
    });
    return ajv;
};
export { getAjvInstance };
