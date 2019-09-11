/**
 * Assemble a schema.
 */

import yaml from 'js-yaml'
import fs from 'fs'
import globby from 'globby'
import changeCase from 'change-case'
import { basename } from 'path'
import deepdash from 'deepdash'
import _ from 'lodash'
import jsont from 'json-transforms'
import mergeAllOf from 'json-schema-merge-allof'

deepdash(_)

const pathToId = path => changeCase.pascalCase(basename(path, '.schema.yaml'))

const loadSchema = path =>
  new Promise((resolve, reject) => {
    try {
      const schema = {
        ...yaml.safeLoad(fs.readFileSync(path, 'utf8')),
        $id: `#${pathToId(path)}`,
      }
      resolve(schema)
    } catch (e) {
      reject(e)
    }
  })

const gatherSchemas = async pattern => {
  const paths = await globby(pattern)
  const schemas = await Promise.all(paths.map(loadSchema))
  return schemas.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.$id.substring(1)]: curr,
    }),
    {},
  )
}

const assemble = async entry => {
  let output = {
    ...(await loadSchema(entry)),
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: `https://www.sketch.com/schemas/${basename(entry, '.yaml')}.json`,
  }

  let definitions = await gatherSchemas('**/*.schema.yaml')
  const abstractSchemas = await gatherSchemas('**/*abstract*.schema.yaml')

  // Abstract schemas are a device to reduce code duplication while schema
  // authoring, they aren't a concept we want to leak into the final schema
  // output. So replace $refs to abstract schemas with the abstract schema
  // contents

  const replaceAbstractRefs = jsont.pathRule('.$ref', ({ context, match }) => {
    if (typeof match === 'string' && match.includes('abstract')) {
      const { title, description, $id, $ref, ...rest } = abstractSchemas[
        pathToId(match)
      ]
      return _.cloneDeep(rest)
    } else {
      return context
    }
  })
  // Run the transform for each level of "inheritance". Currently twice since
  // we have AbstractLayer > AbstractGroup.
  definitions = jsont.transform(definitions, [
    replaceAbstractRefs,
    jsont.identity,
  ])
  definitions = jsont.transform(definitions, [
    replaceAbstractRefs,
    jsont.identity,
  ])

  // Next convert the rest of the $refs to internal $id refs

  definitions = _.mapDeep(definitions, (v, k) => {
    if (k === '$ref') {
      return `#${pathToId(v)}`
    }
    return v
  })

  output.definitions = definitions

  mergeAllOf(output)

  /**
   * TODO
   * - Process out abstract $refs in top level properties
   * - Process $refs in top level properties to internal $id refs
   * - Scan schema for unused definitions and remove
   *   - Unused definition is one that isn't referenced by any actual $ref
   */

  return output
}

export { assemble }
