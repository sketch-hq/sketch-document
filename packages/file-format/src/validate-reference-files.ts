import chalk from 'chalk'
import referenceFiles from '@sketch-hq/sketch-reference-files'
import util from 'util'

import { getAjvInstance } from './utils'
import { ErrorObject, ValidateFunction } from 'ajv'

import docSchema from './document.schema.json'
import metaSchema from './meta.schema.json'
import pageSchema from './page.schema.json'
import userSchema from './user.schema.json'

const { red, green, inverse, gray, whiteBright } = chalk

const ajv = getAjvInstance()
// @ts-ignore
const refFiles: typeof referenceFiles = referenceFiles.default

const validate = (validator: ValidateFunction, data: any, name: string) => {
  const valid = validator(data)
  if (valid) {
    console.log(green(`  ${name} schema OK`))
  } else {
    console.log(red(`  ${name} schema failed`))
    let output = ''
    validator.errors!.forEach((error: ErrorObject) => {
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

const docValidator = ajv.compile(docSchema)
const metaValidator = ajv.compile(metaSchema)
const userValidator = ajv.compile(userSchema)
const pageValidator = ajv.compile(pageSchema)

console.log(process.argv)

const integrationTest = (document: number) => {
  console.log(inverse(`\n  Testing against document ${document}  \n`))

  const referenceFileGroup = refFiles.find(
    (group) => group.document === document,
  )

  if (!referenceFileGroup) {
    console.log(gray('\nSkipped - no reference files for version\n'))
    return
  }

  const errors = []
  for (const file of referenceFileGroup.files) {
    console.log(whiteBright(file.name))
    errors.push(...validate(docValidator, file.data.document, 'Document'))
    errors.push(...validate(metaValidator, file.data.meta, 'Meta'))
    errors.push(...validate(userValidator, file.data.user, 'User'))
    for (const page of file.data.pages) {
      errors.push(
        ...validate(pageValidator, page, `Page "${page.do_objectID}"`),
      )
    }
  }

  if (errors.length > 0) {
    console.error(red(`\n${errors.length} errors\n`))
    throw 'Failed'
  } else {
    console.log(green('\nSuccess\n'))
  }
}

try {
  const versions = process.argv[2].split(',').map((v) => parseInt(v))
  for (const version of versions) {
    integrationTest(version)
  }
} catch (err) {
  console.error(err)
  process.exit(1)
}
