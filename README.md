# Sketch File Format

> JSON Schemas for the Sketch file format

## Overview

> 🚧 This project is a work in progress, and we don't recommend you base
> production code on it for the time being. Raise an issue with any questions or
> suggestions

The objective is to craft a set of schemas that strictly adhere to the
[Draft 7](https://json-schema.org/draft-07/json-schema-release-notes.html) JSON
Schema spec, and describe as closely as possible the shape of Sketch file JSON,
as it appears on disk.

Tooling is used to check the correctness of the schemas against the public spec,
and additionally confirm that the schemas are able to successfully validate real
Sketch documents.

In order to aid maintainability the schema is split up into multiple reusable
sub-schema in separate files, and combined in a build step. Yaml is used to
improve readability of the schemas, introduce the possibility of leaving
comments etc.

> The schema Yaml files in this repo are hand-editable but tooling can be used
> to improve the developer experience. Node, yarn and VS Code are required to
> make the most of the tooling in this repo, although this sort of developer
> environment is purely optional.

## Sketch document version mapping

Currently Sketch documents declare both their
[_document version_ and _app version_](https://developer.sketch.com/file-format/versioning).
These schemas are related to the _document version_ only. This value can change
less frequently than the Sketch desktop app version but will increment everytime
there's any change to the Sketch file format.

Conceptually this file format spec sits _upstream_ of Sketch. This means we will
endeavour to release a new version of this spec before or closely following the
version of Sketch that supports it. A future goal is that this file format spec
is incorporated into our internal processes, strengthening the relationship
between this spec and our products that implement it.

The table below indicates the relationship between file format versions and the
document version.

| Sketch file format | Sketch document version  |
| ------------------ | ------------------------ |
| `1.*.*`            | `119` Sketch 55.2 - 57.1 |
| `2.*.*`            | `120` Sketch 58          |
| `3.*.*`            | `121` Sketch 59          |

## Related projects

- [sketch-file-format-ts](https://github.com/sketch-hq/sketch-file-format-ts)
- [sketch-reference-files](https://github.com/sketch-hq/sketch-reference-files)

## Use cases

- Documents the file format over time
- Validate programmatically generated Sketch documents
- Use as a source for deriving types and schemas for code that works with
  representations of Sketch documents (see
  [sketch-file-format-ts](https://github.com/sketch-hq/sketch-file-format-ts))

## Usage

### JavaScript/TypeScript

Add the npm module using `npm` or `yarn`

```
npm install @sketch-hq/sketch-file-format
```

```
import schemas from '@sketch-hq/sketch-file-format'
```

The shape of the `schemas` object above is illustrated by the following type
definition (see the schema table below for explanations):

```typescript
type Schemas = {
  version: number // Supported Sketch document version
  document: JSONSchema7
  fileFormat: JSONSchema7
  meta: JSONSchema7
  page: JSONSchema7
  user: JSONSchema7
}
```

### HTTP

Built schemas are available to download directly over HTTP from unpkg.

- https://unpkg.com/browse/@sketch-hq/sketch-file-format@latest/dist/

### From source

1. Check you have modern versions of Yarn and Node installed
1. Check out the repo
1. Run `yarn` to setup the dependencies
1. Run `yarn build` to generate the schemas into the `dist` folder

### Other platforms

Other platforms and package managers can be supported in future, if you have any
requests please open an issue.

## Schemas

| Schema      | Description                                                                                                                                           | Yaml entrypoint                  | Built schema                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------ |
| File Format | Schema for a Sketch file that has been unzipped and its entries parsed into a single object, with page references replaced with concrete page objects | `schema/file-format.schema.yaml` | `dist/file-format.schema.json` |
| Document    | Schema for the document JSON entry in a Sketch ZIP file                                                                                               | `schema/document.schema.yaml`    | `dist/document.schema.json`    |
| Page        | Schema for the page JSON entries in a Sketch ZIP file                                                                                                 | `schema/layers/page.schema.yaml` | `dist/page.schema.json`        |
| Meta        | Schema for the meta JSON entry in a Sketch ZIP file                                                                                                   | `schema/meta.schema.yaml`        | `dist/meta.schema.json`        |
| User        | Schema for the user JSON entry in a Sketch ZIP file                                                                                                   | `schema/user.schema.yaml`        | `dist/user.schema.json`        |

> Check the [changelog](./CHANGELOG.md) for more information.

## Semver

The version of these file format schemas will follow
[semver](https://semver.org/), remaining independent of the Sketch version.

- **Major version bump** The schemas fail to validate a document that was
  previously considered valid by prior versions. A change in Sketch document
  version will mean a major bump too, since document version is currently
  declared as a constant in the schemas
- **Minor version bump** While any document version change results in a major
  bump we're unlikely to see many backwards compatible new features and an
  associated minor version bump. This may change in future though as we
  normalise the relationship between this spec and other Sketch products, in
  which case we'll be able to make better use of the full semver semantics
- **Patch version bump** Bug fixes, documentation improvements or trivial
  changes that don't affect the semantics of the schemas

> This repo enforces use of semantic
> [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to
> automate semver changes and changelog generation, so please think carefully
> about your commit _types_ when you make a contribution.

## Scripts

| Script                | Description                                                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| yarn build            | Builds distributable schema into the `dist` folder                                                                                                                     |
| yarn validate         | Checks the schema for correctness against the Draft 7 meta-schema                                                                                                      |
| yarn watch            | Runs `yarn validate` whenever a Yaml file changes in the `schema/` folder                                                                                              |
| yarn integration-test | Uses the built schemas to validate real Sketch files, false negatives are treated as test failures                                                                     |
| yarn test             | Unit tests (not implemented yet)                                                                                                                                       |
| yarn format-check     | Checks the repo with Prettier                                                                                                                                          |
| yarn release          | Tags the repo and updates the changelog and semver automatically based on commit history. You'll still need to push the changes and `yarn publish` manually afterwards |

## Processing during build

While the build output is valid JSON Schema, the Yaml source files are not. They
include a number of approaches to aid maintainability, listed below.

### Abstract schemas

Abstract schemas are a device to aid DRYness in the Yaml source. They are
processed out of the final build output by the `assemble` function.

### Additional properties

The `additionalProperties` keyword is used by JSON Schema to define whether an
object allows arbitrary extra properties on itself beyond those explicitly
listed. According to the spec it defaults to `true`, but in order to increase
strictness we set it to `false` on every object schema in the output, unless
already present.

### Required properties

The `required` keyword is used by JSON Schema to list object properties that
must be present in order for it to be considered valid. Again, in order to
increase strictness we automatically set every object property as required. If a
property is genuinely optional, then it can be listed in the non-standard
`optional` keyword, which is processed out of the build output.
