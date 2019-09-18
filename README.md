# Sketch File Format

> JSON Schemas for the Sketch file format

## Overview

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

## Schemas

| Schema      | Description                                                                                 | Entrypoint                       | Build output                   |
| ----------- | ------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------ |
| Document    | Schema for the document JSON entry in a Sketch ZIP file                                     | `schema/document.schema.yaml`    | `dist/document.schema.json`    |
| Page        | Schema for the pages JSON entries in a Sketch ZIP file                                      | `schema/layers/page.schema.yaml` | `dist/page.schema.json`        |
| Meta        | Schema for the meta JSON entry in a Sketch ZIP file                                         | `schema/meta.schema.yaml`        | `dist/meta.schema.json`        |
| User        | Schema for the user JSON entry in a Sketch ZIP file                                         | `schema/user.schema.yaml`        | `dist/user.schema.json`        |
| File Format | Schema for a Sketch file that has been unzipped and its entries parsed into a single object | `schema/file-format.schema.yaml` | `dist/file-format.schema.json` |

## Sketch version mapping

| Schema version  | Validates documents produced by |
| --------------- | ------------------------------- |
| `0.1.0-alpha.1` | Sketch 57                       |

## Scripts

| Script                | Description                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| yarn build            | Builds distributable schema into the `dist` folder                                                 |
| yarn validate         | Checks the schema for correctness against the Draft 7 meta-schema                                  |
| yarn watch            | Runs `yarn validate` whenever a Yaml file changes in the `schema/` folder                          |
| yarn integration-test | Uses the built schemas to validate real Sketch files, false negatives are treated as test failures |
| yarn test             | Unit tests (not implemented yet)                                                                   |
| yarn format-check     | Checks the repo with Prettier                                                                      |

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
