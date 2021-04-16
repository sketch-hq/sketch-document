import StreamZip from 'node-stream-zip'
import { ErrorObject } from 'ajv'
import util from 'util'

import { getAjvInstance } from './utils'
import schema from '../src/file-format.schema.json'
import { fromFile, SketchFile } from '../../file'

const main = async () => {
  const filepath = process.argv[2]
  const file: SketchFile = await fromFile(filepath)
  const ajv = getAjvInstance()
  ajv.validate(schema, file)
  if (ajv.errors) {
    let output = ''
    ajv.errors!.forEach((error: ErrorObject) => {
      const { keyword, dataPath, schemaPath, params, message, data } = error
      output += '\n'
      output += `message: ${message}\n`
      output += `keyword: ${keyword}\n`
      output += `schemaPath: ${schemaPath}\n`
      output += `dataPath: ${dataPath}\n`
      output += `params: ${util.inspect(params, { depth: 0 })}\n`
      output += `data: ${util.inspect(data, { depth: 0 })}\n`
    })
    console.log(output)
    process.exit(1)
  } else {
    console.log(`File valid`)
  }
}

main()
