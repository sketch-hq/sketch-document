/**
 * Validate the distributed schemas against the meta-schema. This ensures the
 * schema structure and keywords are valid according to the JSON Schema spec.
 */

import { assemble } from './assemble.mjs'
import { getAjvInstance } from './ajv.mjs'

const ajv = getAjvInstance()

const validate = async entry => {
  const schema = await assemble(entry)
  const valid = ajv.validateSchema(schema)
  if (!valid) {
    throw JSON.stringify(ajv.errors, null, 2)
  }
}

;(async () => {
  const keepAlive = setTimeout(() => {}, Infinity)
  try {
    await Promise.all([
      validate('schema/file-format.schema.yaml'),
      validate('schema/document.schema.yaml'),
      validate('schema/meta.schema.yaml'),
      validate('schema/layers/page.schema.yaml'),
    ])
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
  clearTimeout(keepAlive)
})()
