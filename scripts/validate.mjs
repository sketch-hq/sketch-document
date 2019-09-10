/**
 * Script for validating the schema for correctness against the Draft 7 meta
 * schema at http://json-schema.org/draft-07/schema. The deferencing step
 * involves resolving all $ref values and combining into a single schema object.
 */

import refParser from 'json-schema-ref-parser'
import Ajv from 'ajv'
import flatted from 'flatted'

const ajv = new Ajv({
  extendRefs: 'fail',
  strictKeywords: true,
})

refParser.bundle('schema/file-format.schema.yaml', (err, schema) => {
  if (err) {
    console.error(err.message)
    process.exit(1)
  }
  const valid = ajv.validateSchema(schema)
  if (!valid) {
    console.error(JSON.stringify(ajv.errors, null, 2))
    process.exit(1)
  }
  process.exit(0)
})
