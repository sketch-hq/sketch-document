/**
 * Build all distributable schemas into the `dist` folder.
 */

import { writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { assemble } from './assemble.mjs'
import { basename } from 'path'

const build = async entry => {
  const schema = await assemble(entry)
  writeFileSync(
    `dist/${basename(entry, '.yaml')}.json`,
    JSON.stringify(schema, null, 2),
    { encoding: 'utf8' },
  )
}

;(async () => {
  const keepAlive = setTimeout(() => {}, Infinity)
  execSync('rm -rf dist')
  execSync('mkdir -p dist')
  try {
    await Promise.all([
      build('schema/file-format.schema.yaml'),
      build('schema/document.schema.yaml'),
      build('schema/meta.schema.yaml'),
      build('schema/user.schema.yaml'),
      build('schema/layers/page.schema.yaml'),
    ])
    execSync('yarn prettier --write "dist/*.json"')
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
  clearTimeout(keepAlive)
})()
