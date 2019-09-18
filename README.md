# Sketch File Format

> JSON Schemas for the Sketch file format

## Overview

This is a manually written JSON Schema based on
[Draft 7](https://json-schema.org/draft-07/json-schema-release-notes.html) of
the JSON Schema specification. The objective is to craft a schema that describes
as closely as possible the shape of Sketch file JSON, as it appears on disk.

In order to aid maintainability the schema is split up into multiple reusable
sub-schema in separate files. Yaml is used to improve readability of the
schemas, introduce the possibility of leaving comments etc. Final JSON schema
files are then produced in a build step.

> The schema YAML files in this repo are hand-editable but tooling can be used
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
| yarn watch            | Runs `yarn validate` whenever a YAML file changes in the `schema/` folder                          |
| yarn integration-test | Uses the built schemas to validate real Sketch files, false negatives are treated as test failures |
| yarn test             | Unit tests (not implemented yet)                                                                   |
| yarn format-check     | Checks the repo with Prettier                                                                      |
