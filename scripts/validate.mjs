import Ajv from 'ajv'
import { assemble } from './assemble.mjs'

const ajv = new Ajv({
  extendRefs: 'fail',
  strictKeywords: true,
})

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
      // validate('schema/user.schema.yaml'),
    ])
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
  clearTimeout(keepAlive)
})()
