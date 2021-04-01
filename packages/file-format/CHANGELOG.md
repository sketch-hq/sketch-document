# @sketch-hq/sketch-file-format

## 5.2.3

### Patch Changes

- 34bb488: Add schemas for coedit patch info.
- 0ec06d1: Migration to monorepo

## 3.7.3

### Patch Changes

- c76a8a9: Remove unnecessary escape characters in UUID pattern

## 3.7.2

### Patch Changes

- 0464c6b: Bump version and add coeditCompatibilityVersion

## 3.7.1

### Patch Changes

- d3ac7d2: Make symbol source inherit directly from artboard
- 4176aa2: Fix layers property to only allow correct types in pages, artboards
  and other layer types

## 3.7.0

### Minor Changes

- 91b0885: Add `missingLibraryFontAcknowledged` property and increase document
  version to `135`.

### Patch Changes

- f2a5494: Fix overrideName regex to support layerStyle and nested symbols
- b42a651: Remove changeIdentifier from symbol master

## 3.6.9

### Patch Changes

- 65693ef: Add missing bundle identifiers for feature preview variant

## 3.6.8

### Patch Changes

- 3f9aa0c: Add support for Sketch Feature Preview variant

## 3.6.7

### Patch Changes

- 36fa40f: Support document version 134, which adds `do_objectID` properties to
  object container schemas.

## 3.6.6

### Patch Changes

- fe001be: Fix the boolean operation enum mapping incorrect values.

## 3.6.5

### Patch Changes

- 19b357e: Do not define Assistants workspace item here in the file format.
  Assistants workspace is now only defined in the
  [Assistant Types](https://github.com/sketch-hq/sketch-assistants/tree/main/packages/types).

## 3.6.4

### Patch Changes

- 40af149: Document version bump to `133` (no other schema changes).

## 3.6.3

### Patch Changes

- b2e06cd: Add support for document version `132` and the `documentState`
  property.

## 3.6.2

### Patch Changes

- b46c865: Remove unused property `dependencyMetadata` from Assistants
  workspace, and make the workspace itself optional.
- a285772: Support document version `131` and remove unused props related to
  embedded fonts.

## 3.6.1

### Patch Changes

- 922d77f: Fix embedded font related properties to match changes made during
  feature's development.
- fda5f6c: Make file reference and data reference schemas generalized.

## 3.6.0

### Minor Changes

- 3543475: Add support for document version `130` (color swatches).

## 3.5.6

### Patch Changes

- 7b43342: Add workspace schema.

## 3.5.5

### Patch Changes

- d0e73e9: Add support for `agreedToFontEmbedding` property

## 3.5.4

### Patch Changes

- 384590c: Support document version 128

## 3.5.3

### Patch Changes

- 47d6e83: Fix incorrect enum values in layout axis schema

## 3.5.2

### Patch Changes

- fa41d87: Bump to document version 127, no other file format changes are
  associated with this change

## 3.5.1

### Patch Changes

- 2f53dc8: Add embedded prop to Embedded Font Reference schema

## 3.5.0

### Minor Changes

- 03e3835: Add support for document model version 126 and embedded fonts

## 3.4.4

### Patch Changes

- eebcfe5: add support for document version 125 and Sketch 64

## 3.4.3

### Patch Changes

- fec69b2: add missing text behaviour enum
- 328a478: add changesets
- fec69b2: add missing optional props to user schema
