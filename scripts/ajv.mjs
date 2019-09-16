import Ajv from 'ajv'

const getAjvInstance = () => {
  const ajv = new Ajv({
    verbose: true,
    strictKeywords: true,
    extendRefs: 'fail',
  })
  ajv.addKeyword('deprecated', {
    validate: () => true,
  })
  ajv.addKeyword('enumDescriptions', {
    validate: (schema, data, parent) =>
      Array.isArray(schema) &&
      Array.isArray(parent.enum) &&
      schema.length === parent.enum.length,
  })
  return ajv
}

export { getAjvInstance }
