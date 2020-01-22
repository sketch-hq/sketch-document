import fs from 'fs'
import chalk from 'chalk'
import path from 'path'
import { getAjvInstance } from './ajv.mjs'
import util from 'util'
import npmModule from '../dist/index.js'
import referenceFiles from '@sketch-hq/sketch-reference-files'

const { red, green, inverse, gray, whiteBright } = chalk

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

const docValidator = ajv.compile(npmModule.default.document)
const metaValidator = ajv.compile(npmModule.default.meta)
const userValidator = ajv.compile(npmModule.default.user)
const pageValidator = ajv.compile(npmModule.default.page)

const integrationTest = version => {
  console.log(inverse(`\n  Testing against document ${version}  \n`))

  const referenceFileGroup = referenceFiles.default.find(
    group => group.document === version,
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
  const { versions } = npmModule.default
  for (const version of versions) {
    integrationTest(version)
  }
} catch (err) {
  console.error(err)
  process.exit(1)
}
