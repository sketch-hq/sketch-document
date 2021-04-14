/**
 * Build all distributable schemas into the `dist` folder.
 */

import process from 'process'

import { writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { basename } from 'path'

import { assemble } from './assemble'

const build = async (entry: string) => {
  const schema = await assemble(entry)
  writeFileSync(
    `src/${basename(entry, '.yaml')}.json`,
    JSON.stringify(schema, null, 2),
    { encoding: 'utf8' },
  )
}

/**
 * Both paths for the directory containing the schemas, as well as the directory
 * the generated JSON Schema should be written to must be provided as a
 * command-line argument.
 *
 *   ts-node build-schemas.ts <schema-dir> <output-dir>
 */
const main = async (args: string[]) => {
  const [schemaDir, outDir] = args.slice(2, 4) // user defined args start at index 2
  if (!schemaDir) {
    console.error('missing path to directory containing schemas')
    process.exit(1)
  }
  if (!outDir) {
    console.error('missing path to output directory for generated JSON Schema')
    process.exit(1)
  }

  try {
    await Promise.all([
      build(`${schemaDir}/file-format.schema.yaml`),
      build(`${schemaDir}/document.schema.yaml`),
      build(`${schemaDir}/meta.schema.yaml`),
      build(`${schemaDir}/user.schema.yaml`),
      build(`${schemaDir}/layers/page.schema.yaml`),
    ])
    execSync(`yarn prettier --write "${outDir}/*.json"`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main(process.argv)
