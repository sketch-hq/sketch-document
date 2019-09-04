/**
 * Builds a distributable schema into the dist folder.
 */

import refParser from 'json-schema-ref-parser'
import { writeFileSync } from 'fs'
import { execSync } from 'child_process'

refParser.dereference('schema/file-format.schema.yaml', (err, schema) => {
  if (err) {
    console.error(err.message)
    process.exit(1)
  }
  execSync('rm -rf dist')
  execSync('mkdir -p dist')
  writeFileSync(
    'dist/file-format.schema.json',
    JSON.stringify(schema, null, 2),
    {
      encoding: 'utf8',
    },
  )
  process.exit(0)
})
