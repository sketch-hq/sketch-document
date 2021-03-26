import * as ts from 'typescript'
import { factory } from 'typescript'
import { JSONSchema7 } from 'json-schema'
import { pascalize } from 'humps'

/**
 * Recursively transforms JSON Schema to TypeScript AST as a generic type node,
 * e.g. `string`, `number` or a type literal like `{ foo: string }`. This is not
 * a generalised algorithm, and is only tested to work with the Sketch file
 * format schemas.
 */
export const schemaToTypeNode = (schema: JSONSchema7): ts.TypeNode => {
  switch (schema.type) {
    case 'string':
      if (schema.enum) {
        return factory.createUnionTypeNode(
          schema.enum.map((value) =>
            factory.createLiteralTypeNode(
              factory.createStringLiteral(value as string),
            ),
          ),
        )
      } else {
        return factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
      }
    case 'number':
    case 'integer':
      if (schema.enum) {
        return factory.createUnionTypeNode(
          schema.enum.map((value) =>
            factory.createLiteralTypeNode(
              factory.createNumericLiteral(value as number),
            ),
          ),
        )
      } else {
        return factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
      }
    case 'boolean':
      if (schema.enum) {
        return factory.createUnionTypeNode(
          schema.enum.map((value) =>
            factory.createLiteralTypeNode(
              (value as boolean) === true
                ? factory.createTrue()
                : factory.createFalse(),
            ),
          ),
        )
      } else {
        return factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
      }
    case 'null':
      return factory.createLiteralTypeNode(factory.createNull())
    // return factory.createKeywordTypeNode(ts.SyntaxKind.NullKeyword)
    case 'object':
      if (typeof schema.properties === 'object') {
        const required = schema.required || []
        const additionalProps =
          typeof schema.additionalProperties === 'undefined' ||
          !!schema.additionalProperties
        const elements: ts.TypeElement[] = Object.keys(
          schema.properties,
        ).map((key) =>
          factory.createPropertySignature(
            undefined,
            key.includes('-')
              ? factory.createStringLiteral(key)
              : factory.createIdentifier(key),
            required.includes(key)
              ? undefined
              : factory.createToken(ts.SyntaxKind.QuestionToken),
            schemaToTypeNode(schema.properties![key] as JSONSchema7),
          ),
        )
        if (additionalProps) {
          elements.push(
            factory.createIndexSignature(
              undefined,
              undefined,
              [
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('key'),
                  undefined,
                  factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                ),
              ],
              factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            ),
          )
        }
        return factory.createTypeLiteralNode(elements)
      } else if (typeof schema.patternProperties === 'object') {
        return factory.createTypeLiteralNode([
          factory.createIndexSignature(
            undefined,
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier('key'),
                undefined,
                factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
              ),
            ],
            factory.createUnionTypeNode(
              Object.keys(schema.patternProperties).map((key) =>
                schemaToTypeNode(schema.patternProperties![key] as JSONSchema7),
              ),
            ),
          ),
        ])
      } else {
        return factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
      }
    case 'array':
      if (typeof schema.items === 'object' && !Array.isArray(schema.items)) {
        return factory.createArrayTypeNode(schemaToTypeNode(schema.items))
      } else {
        return factory.createTupleTypeNode([])
      }
    default:
      if (schema.const) {
        return factory.createLiteralTypeNode(
          factory.createStringLiteral(schema.const as string),
        )
      } else if (schema.$ref) {
        return factory.createTypeReferenceNode(
          factory.createIdentifier(
            schema.$ref.replace(/#/, '').replace(/\/definitions\//, ''),
          ),
          undefined,
        )
      } else if (schema.oneOf) {
        return factory.createUnionTypeNode(
          schema.oneOf.map((schema) => schemaToTypeNode(schema as JSONSchema7)),
        )
      } else {
        return factory.createTypeLiteralNode(undefined)
      }
  }
}

/**
 * Transforms a JSON Schema to TypeScript AST, but this time as a top
 * level exported type declaration, i.e. `export type Foo = { }`.
 */
export const schemaToTopLevelDeclaration = (
  schema: JSONSchema7,
): ts.DeclarationStatement => {
  const identifier = (schema.$id || 'Unknown').replace(/#/, '')
  let statement: ts.DeclarationStatement
  // @ts-ignore
  const enumDescriptions: string[] = schema.enumDescriptions
  if (schema.enum && enumDescriptions) {
    statement = factory.createEnumDeclaration(
      undefined,
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier(identifier),
      schema.enum.map((item, index) =>
        factory.createEnumMember(
          factory.createIdentifier(
            pascalize(enumDescriptions[index]).replace(/\W/, ''),
          ),
          factory.createStringLiteral(item as string),
        ),
      ),
    )
  } else {
    statement = factory.createTypeAliasDeclaration(
      undefined,
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier(identifier),
      undefined,
      schemaToTypeNode(schema),
    )
  }

  if (schema.description) {
    ts.addSyntheticLeadingComment(
      statement,
      ts.SyntaxKind.MultiLineCommentTrivia,
      `*\n * ${schema.description}\n `,
      true,
    )
  }
  return statement
}

/**
 * Use the presence of `do_objectID` and `frame` properties as a heuristic to
 * identify a schema that represents a layer.
 */
export const isLayerSchema = (schema: JSONSchema7) => {
  const hasFrame =
    schema.properties && typeof schema.properties.frame === 'object'
  const hasId =
    schema.properties && typeof schema.properties.do_objectID === 'object'
  return hasFrame && hasId
}

/**
 * Use layeriness and the presence of a `layers` array as a heruistic to
 * identify a schema that represents a group.
 */
export const isGroupSchema = (schema: JSONSchema7) => {
  const isLayer = isLayerSchema(schema)
  const hasLayers =
    schema.properties && typeof schema.properties.layers === 'object'
  return isLayer && hasLayers
}

/**
 * Does the schema represent an object/class in the model?
 */
export const isObjectSchema = (schema: JSONSchema7) => {
  return schema.properties && '_class' in schema.properties
}
