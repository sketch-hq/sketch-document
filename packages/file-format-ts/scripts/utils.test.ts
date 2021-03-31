import { schemaToTypeNode, schemaToTopLevelDeclaration } from './utils'
import * as ts from 'typescript'
import { JSONSchema7 } from 'json-schema'
import { format } from 'prettier'

/**
 * Test helper to visualise/print a statement for snapshotting.
 */
const printStatement = (statement: ts.Statement) => {
  const printer = ts.createPrinter()
  return format(
    printer.printNode(
      ts.EmitHint.Unspecified,
      statement,
      ts.createSourceFile(
        '',
        '',
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TS,
      ),
    ),
    {
      parser: 'typescript',
      semi: false,
      singleQuote: true,
    },
  ).replace(/[\r\n]+$/, '')
}

/**
 * Test helper to visualise/print a type node for snapshotting.
 */
const printTypeNode = (node: ts.TypeNode) => {
  const statementWrapper = ts.createTypeAliasDeclaration(
    undefined,
    undefined,
    ts.createIdentifier('TestType'),
    undefined,
    node,
  )
  return printStatement(statementWrapper)
}

describe('schemaToTypeNode', () => {
  test('Handles string', () => {
    const schema: JSONSchema7 = { type: 'string' }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = string"`,
    )
  })

  test('Handles string enum', () => {
    const schema: JSONSchema7 = { type: 'string', enum: ['foo', 'bar'] }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = 'foo' | 'bar'"`,
    )
  })

  test('Handles number', () => {
    const schema: JSONSchema7 = { type: 'number' }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = number"`,
    )
  })

  test('Handles number enum', () => {
    const schema: JSONSchema7 = { type: 'number', enum: [1, 2] }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = 1 | 2"`,
    )
  })

  test('Handles integers', () => {
    const schema: JSONSchema7 = { type: 'integer' }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = number"`,
    )
  })

  test('Handles integer enum', () => {
    const schema: JSONSchema7 = { type: 'integer', enum: [1, 2] }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = 1 | 2"`,
    )
  })

  test('Handles boolean', () => {
    const schema: JSONSchema7 = { type: 'boolean' }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = boolean"`,
    )
  })

  test('Handles null', () => {
    const schema: JSONSchema7 = { type: 'null' }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = null"`,
    )
  })

  test('Handles boolean enum', () => {
    const schema: JSONSchema7 = { type: 'boolean', enum: [true, false] }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = true | false"`,
    )
  })

  test('Handles empty object', () => {
    const schema: JSONSchema7 = {}
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = {}"`,
    )
  })

  test('Handles object', () => {
    const schema: JSONSchema7 = {
      type: 'object',
      properties: { foo: { type: 'string' }, bar: { type: 'number' } },
    }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(`
      "type TestType = {
        foo?: string
        bar?: number
        [key: string]: any
      }"
    `)
  })

  test('Handles nested objects', () => {
    const schema: JSONSchema7 = {
      type: 'object',
      properties: {
        foo: {
          type: 'object',
          properties: { bar: { type: 'string' }, baz: { type: 'number' } },
        },
      },
    }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(`
      "type TestType = {
        foo?: {
          bar?: string
          baz?: number
          [key: string]: any
        }
        [key: string]: any
      }"
    `)
  })

  test('Handles required object properties', () => {
    const schema: JSONSchema7 = {
      type: 'object',
      properties: { foo: { type: 'string' }, bar: { type: 'number' } },
      required: ['foo', 'bar'],
    }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(`
      "type TestType = {
        foo: string
        bar: number
        [key: string]: any
      }"
    `)
  })

  test('Handles objects that do not allow additional properties', () => {
    const schema: JSONSchema7 = {
      type: 'object',
      properties: { foo: { type: 'string' }, bar: { type: 'number' } },
      additionalProperties: false,
    }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(`
      "type TestType = {
        foo?: string
        bar?: number
      }"
    `)
  })

  test('Handles object patternProperties', () => {
    const schema: JSONSchema7 = {
      type: 'object',
      patternProperties: {
        foo: {
          type: 'string',
        },
        bar: {
          $ref: '#Bar',
        },
      },
    }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(`
      "type TestType = {
        [key: string]: string | Bar
      }"
    `)
  })

  test('Handles simple arrays', () => {
    const schema: JSONSchema7 = { type: 'array' }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = []"`,
    )
  })

  test('Handles typed arrays', () => {
    const schema: JSONSchema7 = { type: 'array', items: { type: 'string' } }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = string[]"`,
    )
  })

  test('Handles string constants', () => {
    const schema: JSONSchema7 = { const: 'foobar' }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = 'foobar'"`,
    )
  })

  test('Handles number constants', () => {
    const schema: JSONSchema7 = { const: 1 }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = 1"`,
    )
  })

  test('Handles refs', () => {
    const schema: JSONSchema7 = { $ref: '#Artboard' }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = Artboard"`,
    )
  })

  test('Handles arrays of refs', () => {
    const schema: JSONSchema7 = { type: 'array', items: { $ref: '#Artboard' } }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = Artboard[]"`,
    )
  })

  test('Handles oneOf', () => {
    const schema: JSONSchema7 = {
      oneOf: [{ type: 'string' }, { type: 'number' }],
    }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = string | number"`,
    )
  })

  test('Handles refs in oneOf', () => {
    const schema: JSONSchema7 = {
      oneOf: [{ $ref: '#Artboard' }, { $ref: '#Group' }],
    }
    expect(printTypeNode(schemaToTypeNode(schema))).toMatchInlineSnapshot(
      `"type TestType = Artboard | Group"`,
    )
  })
})

describe('schemaToTopLevelDeclaration', () => {
  test('Handles top level object definitions', () => {
    const schema: JSONSchema7 = {
      $id: '#FooBar',
      description: 'A foobar',
      type: 'object',
      properties: { foo: { type: 'string' }, bar: { type: 'string' } },
    }
    expect(printStatement(schemaToTopLevelDeclaration(schema)))
      .toMatchInlineSnapshot(`
      "/**
       * A foobar
       */
      export type FooBar = {
        foo?: string
        bar?: string
        [key: string]: any
      }"
    `)
  })

  test('Handles top level enum definitions', () => {
    const schema: JSONSchema7 = {
      $id: '#MyEnum',
      description: 'My enum',
      type: 'integer',
      enum: [0, 1, 2],
      // @ts-ignore
      enumDescriptions: ['Zero', 'One', 'Two'],
    }
    expect(printStatement(schemaToTopLevelDeclaration(schema)))
      .toMatchInlineSnapshot(`
      "/**
       * My enum
       */
      export enum MyEnum {
        Zero = 0,
        One = 1,
        Two = 2,
      }"
    `)
  })
})
