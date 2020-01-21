import { JSONSchema7 } from 'json-schema'

type Schemas = {
  version: number // Latest supported Sketch document version
  versions: number[] // All supported versions
  document: JSONSchema7
  fileFormat: JSONSchema7
  meta: JSONSchema7
  page: JSONSchema7
  user: JSONSchema7
}

const schemas: Schemas = {
  version: 123,
  versions: [121, 122, 123],
  fileFormat: require('./file-format.schema.json'),
  document: require('./document.schema.json'),
  meta: require('./meta.schema.json'),
  page: require('./page.schema.json'),
  user: require('./user.schema.json'),
}

export default schemas
