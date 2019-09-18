import fs from 'fs'
import chalk from 'chalk'
import path from 'path'
import { getAjvInstance } from './ajv.mjs'
import util from 'util'

const { red, green, inverse, gray, whiteBright } = chalk
const versions = ['57']
const ajv = getAjvInstance()

const loadJson = async filepath => (await import(filepath)).default

const createValidator = async filepath => ajv.compile(await loadJson(filepath))

const validate = async (validator, filepath) => {
  const name = path.basename(filepath)
  const valid = validator(await loadJson(filepath))
  if (valid) {
    console.log(green('  ', name, 'OK'))
  } else {
    console.log(red('  ', name, 'failed'))
    let output = ''
    validator.errors
      .filter(error => error.keyword === 'required')
      .forEach(error => {
        const { keyword, dataPath, schemaPath, params, message, data } = error
        output += '\n'
        output += `message: ${message}\n`
        output += `keyword: ${keyword}\n`
        output += `schemaPath: ${schemaPath}\n`
        output += `dataPath: ${dataPath}\n`
        output += `params: ${util.inspect(params, { depth: 0 })}\n`
        output += `data: ${util.inspect(data, { depth: 0 })}\n`
      })
    console.log(gray(output.replace(/^/gm, '     ')))
  }
  return validator.errors || []
}

;(async () => {
  try {
    const keepAlive = setTimeout(() => {}, Infinity)

    const docValidator = await createValidator('../dist/document.schema.json')
    const metaValidator = await createValidator('../dist/meta.schema.json')
    const userValidator = await createValidator('../dist/user.schema.json')
    const pageValidator = await createValidator('../dist/page.schema.json')

    const errors = []

    for (const version of versions) {
      console.log(inverse(`\n  Sketch ${version}  \n`))
      const folders = await fs.promises.readdir(`reference-files/${version}`)
      for (const folder of folders) {
        console.log(whiteBright(folder))
        errors.push(
          ...(await validate(
            docValidator,
            `../reference-files/${version}/${folder}/document.json`,
          )),
        )
        errors.push(
          ...(await validate(
            metaValidator,
            `../reference-files/${version}/${folder}/meta.json`,
          )),
        )
        errors.push(
          ...(await validate(
            userValidator,
            `../reference-files/${version}/${folder}/user.json`,
          )),
        )
        const pages = await fs.promises.readdir(
          `reference-files/${version}/${folder}/pages`,
        )
        for (const page of pages) {
          errors.push(
            ...(await validate(
              pageValidator,
              `../reference-files/${version}/${folder}/pages/${page}`,
            )),
          )
        }
      }
    }

    if (errors.length > 0) {
      console.error(red(`\n${errors.length} errors\n`))
      process.exit(1)
    } else {
      process.exit(0)
    }
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
