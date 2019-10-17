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

## Use cases

- Documents the file format over time
- Validate programmatically generated Sketch documents
- Use as a source for deriving types and schemas for code that works with
  representations of Sketch documents

## Usage

### JavaScript

```
npm install @sketch-hq/sketch-file-format
```

```
const schemas = require('@sketch-hq/sketch-file-format')
```

The `schemas` object above has the following properties. See the
[Schemas](./#schemas) section for definitions.

- `fileFormat`
- `document`
- `page`
- `meta`
- `user`

### HTTP

Built schemas are available to download directly over HTTP from unpkg.

- https://unpkg.com/browse/@sketch-hq/sketch-file-format@latest/dist/

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

## Sketch document version mapping

Currently Sketch documents declare both their
[_document version_ and _app version_](https://developer.sketch.com/file-format/versioning).
These schemas are directly related to the _document version_ only, which can
change less frequently than the Sketch major version.

Conceptually this file format spec sits _upstream_ of Sketch. This means we will
endeavour to release a new version of this spec before or closely following the
version of Sketch that supports it. A future goal is that this file format spec
is incorporated into Sketch's build and test process, formalising the
relationship between the two.

The table below indicates the relationship between file format versions and the
document version.

| File Format Schemas | Document version             |
| ------------------- | ---------------------------- |
| `1.0.0`             | `119` (Sketch `55.2 - 57.0`) |

### Semver

The version of these file format schemas will follow
[semver](https://semver.org/), remaining entirely independent of the Sketch app
version.

- **Major version bump** The schemas fail to validate a document that was
  previously considered valid by prior versions
- **Minor version bump** Introduction of changes in a backwards compatible
  manner, for example adding a new field while adding a deprecated flag on an
  old one
- **Patch version bump** Bug fixes, documentation improvements and other trivial
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
