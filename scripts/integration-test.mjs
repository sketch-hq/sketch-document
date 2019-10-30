import fs from 'fs'
import chalk from 'chalk'
import path from 'path'
import { getAjvInstance } from './ajv.mjs'
import util from 'util'
import npmModule from '../index.js'
import referenceFiles from '@sketch-hq/sketch-reference-files'

const { red, green, inverse, gray, whiteBright } = chalk

const referenceFileGroup = referenceFiles.default.find(
  group => group.document === npmModule.version,
)

const ajv = getAjvInstance()

const validate = (validator, data, name) => {
  const valid = validator(data)
  if (valid) {
    console.log(green(`  ${name} schema OK`))
  } else {
    console.log(red(`  ${name} schema failed`))
    let output = ''
    validator.errors.forEach(error => {
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

const docValidator = ajv.compile(npmModule.document)
const metaValidator = ajv.compile(npmModule.meta)
const userValidator = ajv.compile(npmModule.user)
const pageValidator = ajv.compile(npmModule.page)

const integrationTest = () => {
  console.log(inverse(`\n  Testing against document ${npmModule.version}\n `))

  const errors = []
  for (const file of referenceFileGroup.files) {
    console.log(whiteBright(file.name))
    errors.push(...validate(docValidator, file.data.document, 'Document'))
    errors.push(...validate(metaValidator, file.data.meta, 'Meta'))
    errors.push(...validate(userValidator, file.data.user, 'User'))
    for (const page of file.data.pages) {
      errors.push(...validate(pageValidator, page, 'Page'))
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
  integrationTest()
} catch (err) {
  console.error(err)
  process.exit(1)
}
