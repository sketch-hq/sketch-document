/**
 * This file is the entry point to {@link @sketch-hq/sketch-file-format}.
 */

import { JSONSchema7 } from 'json-schema'

/// All *.schema.json are generated from the schema YAML source by
/// the `build:schemas` script defined in package.json.
import fileFormatSchema from './file-format.schema.json'
import docSchema from './document.schema.json'
import metaSchema from './meta.schema.json'
import pageSchema from './page.schema.json'
import userSchema from './user.schema.json'

export type Schemas = {
  version: number // Latest supported Sketch document version
  versions: number[] // All supported versions
  document: JSONSchema7
  fileFormat: JSONSchema7
  meta: JSONSchema7
  page: JSONSchema7
  user: JSONSchema7
}

const schemas: Schemas = {
  version: [...metaSchema.properties.version.enum].pop() || 0,
  versions: [...metaSchema.properties.version.enum],
  fileFormat: fileFormatSchema as JSONSchema7,
  document: docSchema as JSONSchema7,
  meta: metaSchema as JSONSchema7,
  page: pageSchema as JSONSchema7,
  user: userSchema as JSONSchema7,
}

export default schemas
