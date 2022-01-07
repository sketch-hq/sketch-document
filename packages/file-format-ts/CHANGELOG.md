# @sketch-hq/sketch-file-format-ts

## 6.2.0

### Minor Changes

- e22c7f3: Add a new export prefix naming scheme
- 4ca5853: Add `strikethroughStyle` property to text style.
- 91a0f47: Add `cornerStyle` to curve point

### Patch Changes

- bc328f6: Bump Sketch document version.
- 28270c7: Update dependencies

## 6.2.0-next.0

### Minor Changes

- e22c7f3: Add a new export prefix naming scheme
- 4ca5853: Add `strikethroughStyle` property to text style.
- 91a0f47: Add `cornerStyle` to curve point

### Patch Changes

- bc328f6: Bump Sketch document version.
- 28270c7: Update dependencies

## 6.1.1

### Patch Changes

- 9853403: Revert adding didManuallyDisableResizingContent

## 6.1.0

### Minor Changes

- dd2e77d: Added `didManuallyDisableResizingContent` property to stop
  `resizesContent` from being enabled automatically when setting a constraint on
  a child layer.

### Patch Changes

- d5af64e: Updated dependencies

## 6.0.3

### Patch Changes

- fd65032: Removed fonts property from meta.json

## 6.0.2

### Patch Changes

- 1ceb662: Remove includeInCloudUpload

## 6.0.1

### Patch Changes

- 7ba2909: Updated dependencies

## 6.0.0

### Major Changes

- 4704c97: Drop types for older schema versions. This is a breaking change.
  Instead of `FileFormat1`, `FileFormat2` and `FileFormat3` in addition to the
  latest file format version as `default`, types are now only exported as
  `default` for the latest schemas.

  To import specific versions of the file format, use specific versions of
  `@sketch-hq/sketch-file-format-ts` instead.

### Patch Changes

- fa8a43b: Reorganise source code

## 5.2.4

### Patch Changes

- 6ba4724: Re-include type declarations

## 5.2.3

### Patch Changes

- Updated dependencies [34bb488]
- Updated dependencies [0ec06d1]
  - @sketch-hq/sketch-file-format@5.2.3

## 5.2.2

### Patch Changes

- 84c9fc2: Update sketch-file-format to 3.7.1

## 5.2.1

### Patch Changes

- 3a2a6ea: Update sketch-file-format to 3.7.1

## 5.2.0

### Minor Changes

- 8b269e9: Update sketch-file-format to 3.7.0

### Patch Changes

- 14b05c3: Update to sketch-file-format@3.6.6.

## 5.1.1

### Patch Changes

- 5b298d9: Update to file format 3.6.2

## 5.1.0

### Minor Changes

- 1aff125: Include ESM entrypoint.

## 5.0.0

### Major Changes

- 8c997ce: Update to Sketch File Format `3.6.1`

### Minor Changes

- 8c997ce: Add `ClassMap` a type that maps `_class` strings to their object
  type.

## 4.0.5

### Patch Changes

- c0292ca: Fix problem where package was being built as ESM.

## 4.0.4

### Patch Changes

- 208e91f: Update dependencies.
- 208e91f: Add a `ClassValue` enum containing values for all possible `_class`
  values.

## 4.0.3

### Patch Changes

- 4d07d47: Update to file format `3.5.3`
