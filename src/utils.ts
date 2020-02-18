import Ajv from 'ajv'

/**
 * Configure Ajv instance in one place.
 */
const getAjvInstance = () => {
  const ajv = new Ajv({
    verbose: true,
    strictKeywords: true,
    extendRefs: 'fail',
  })
  ajv.addKeyword('deprecated', {
    validate: (schema: any) => typeof schema === 'boolean',
  })
  ajv.addKeyword('enumDescriptions', {
    validate: (schema: any, _data: any, parent: any) =>
      Array.isArray(schema) &&
      Array.isArray(parent.enum) &&
      schema.length === parent.enum.length,
  })
  return ajv
}

export { getAjvInstance }
