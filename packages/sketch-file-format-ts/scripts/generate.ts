import * as ts from 'typescript'
import { writeFileSync } from 'fs'
import { execSync } from 'child_process'
// @ts-ignore
import schemasv1 from '@sketch-hq/sketch-file-format-1'
// @ts-ignore
import schemasv2 from '@sketch-hq/sketch-file-format-2'
import schemasv3 from '@sketch-hq/sketch-file-format-3'
import { JSONSchema7 } from 'json-schema'
import {
  schemaToTopLevelDeclaration,
  isLayerSchema,
  isGroupSchema,
  isObjectSchema,
} from './utils'

type SchemaMap = {
  [key: string]: JSONSchema7
}

const generate = (version: string, schemas: any) => {
  const outFile = `${version}-types.ts`
  const definitions: SchemaMap = {
    ...((schemas.document.definitions as SchemaMap) || {}),
    ...((schemas.fileFormat.definitions as SchemaMap) || {}),
    ...((schemas.meta.definitions as SchemaMap) || {}),
    ...((schemas.user.definitions as SchemaMap) || {}),
  }

  const contents: JSONSchema7 = {
    ...schemas.fileFormat,
    $id: '#Contents',
  }

  const document: JSONSchema7 = {
    ...schemas.document,
    $id: '#Document',
  }

  const anyLayer: JSONSchema7 = {
    description: 'Union of all layers',
    $id: '#AnyLayer',
    oneOf: Object.keys(definitions)
      .map((key) => definitions[key])
      .filter((schema) => isLayerSchema(schema))
      .map((schema) => ({
        $ref: schema.$id,
      })),
  }

  const anyGroup: JSONSchema7 = {
    description: 'Union of all group layers',
    $id: '#AnyGroup',
    oneOf: Object.keys(definitions)
      .map((key) => definitions[key])
      .filter((schema) => isGroupSchema(schema))
      .map((schema) => ({
        $ref: schema.$id,
      })),
  }

  const anyObject: JSONSchema7 = {
    description: 'Union of all objects, i.e. objects with a _class property',
    $id: '#AnyObject',
    oneOf: Object.keys(definitions)
      .map((key) => definitions[key])
      .filter((schema) => isObjectSchema(schema))
      .map((schema) => ({
        $ref: schema.$id,
      })),
  }

  const allClasses: string[] = [
    ...new Set(
      Object.keys(definitions)
        .map((key) => definitions[key])
        .map((schema) => {
          const klass = schema?.properties?._class
          return typeof klass === 'object' && 'const' in klass
            ? (klass.const as string)
            : ''
        })
        .filter(Boolean)
        .sort(),
    ),
  ]

  const classValues: JSONSchema7 = {
    description: 'Enum of all possible _class property values',
    $id: '#ClassValue',
    type: 'string',
    enum: allClasses,
    // @ts-ignore
    enumDescriptions: allClasses,
  }

  const classMap: JSONSchema7 = {
    description: 'A mapping of class values to object types',
    $id: '#ClassMap',
    type: 'object',
    additionalProperties: false,
    required: allClasses,
    properties: allClasses.reduce((acc, curr) => {
      const schema = Object.keys(definitions)
        .map((key) => definitions[key])
        .find((schema) => {
          const klass = schema?.properties?._class
          return (
            typeof klass === 'object' &&
            'const' in klass &&
            (klass.const as string) === curr
          )
        })
      return {
        [curr]: (schema && { $ref: schema.$id }) || {},
        ...acc,
      }
    }, {}),
  }

  const allDefinitions: SchemaMap = {
    ...definitions,
    Contents: contents,
    Document: document,
    AnyLayer: anyLayer,
    AnyGroup: anyGroup,
    AnyObject: anyObject,
    ClassValue: classValues,
    ClassMap: classMap,
  }

  const types: ts.DeclarationStatement[] = Object.keys(
    allDefinitions,
  ).map((key) => schemaToTopLevelDeclaration(allDefinitions[key]))

  writeFileSync(
    outFile,
    ts
      .createPrinter()
      .printList(
        ts.ListFormat.MultiLine,
        ts.factory.createNodeArray(types),
        ts.createSourceFile(
          outFile,
          '',
          ts.ScriptTarget.Latest,
          false,
          ts.ScriptKind.TS,
        ),
      ),
  )

  execSync(`yarn prettier --write ${outFile}`)
}

generate('v1', schemasv1)
generate('v2', schemasv2)
generate('v3', schemasv3)
