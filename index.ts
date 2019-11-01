import { JSONSchema7 } from 'json-schema'

type Schemas = {
  version: number
  document: JSONSchema7
  fileFormat: JSONSchema7
  meta: JSONSchema7
  page: JSONSchema7
  user: JSONSchema7
}

const schemas: Schemas = {
  version: 121,
  fileFormat: require('./file-format.schema.json'),
  document: require('./document.schema.json'),
  meta: require('./meta.schema.json'),
  page: require('./page.schema.json'),
  user: require('./user.schema.json'),
}

export default schemas
