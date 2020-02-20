import StreamZip from 'node-stream-zip'
import { ErrorObject } from 'ajv'
import util from 'util'

import { getAjvInstance } from './utils'
import schema from './file-format.schema.json'

// TODO: This `fromFile` (and presumably a `toFile`) function should be
// published publically in the future
const fromFile = async (filepath: string): Promise<any> => {
  const archive = new StreamZip({
    file: filepath,
    storeEntries: true,
  })

  const contents = await new Promise((resolve): void => {
    archive.on('ready', (): void => {
      const document = JSON.parse(
        archive.entryDataSync('document.json').toString(),
      )
      const pages = document.pages.map((page: { _ref: string }): void =>
        JSON.parse(archive.entryDataSync(`${page._ref}.json`).toString()),
      )
      resolve({
        document: {
          ...document,
          pages,
        },
        meta: JSON.parse(archive.entryDataSync('meta.json').toString()),
        user: JSON.parse(archive.entryDataSync('user.json').toString()),
      })
    })
  })

  archive.close()

  return contents
}

const main = async () => {
  const filepath = process.argv[2]
  const file = await fromFile(filepath)
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
