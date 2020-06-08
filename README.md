# Sketch File Format

JSON Schemas for Sketch files

> 🙋‍♀️ If you're writing code that reads or writes Sketch file JSON, you should be
> implementing this file format specification – either by using the schemas to
> validate your input and output, installing our
> [TypeScript types](https://github.com/sketch-hq/sketch-file-format-ts) or
> using the schemas to generate your own model, factory or type code.

## Overview

These schemas describe as closely as possible the shape of Sketch file JSON, as
it appears on disk. The schemas adhere to the
[Draft 7](https://json-schema.org/draft-07/json-schema-release-notes.html) JSON
Schema spec and are published to npm.

In order to aid maintainability the schema are split up into multiple reusable
sub-schema in separate files, and combined in a build step. YAML is used to
improve readability of the schemas, and introduced the possibility of leaving
comments etc.

Potential use cases include,

- Document the Sketch file format
- Validate programmatically generated Sketch documents
- Use as a data source for generating:
  - Type code, (see
    [sketch-file-format-ts](https://github.com/sketch-hq/sketch-file-format-ts))
  - Other model and factory code
  - Schemas in other formats, e.g. GraphQL or similar

## Relationship to the Sketch Mac application

Conceptually this file format spec sits _upstream_ of Sketch, and all other
projects that implement it. This means we will endeavour to release a new
version of this spec before the version of Sketch that supports it.

Currently Sketch documents declare both their
[_document version_ and _app version_](https://developer.sketch.com/file-format/versioning).
These schemas however are related to the _document version_ only. This value can
change less frequently than the Sketch Mac app but is guaranteed to increment
everytime there's any change to the format of Sketch file JSON.

The table below indicates the relationship between file format spec semver, the
document version and the Sketch Mac app.

| File format spec semver | Sketch document version | Sketch Mac app     |
| ----------------------- | ----------------------- | ------------------ |
| `1.*.*`                 | `119`                   | Sketch 55.2 - 57.1 |
| `2.*.*`                 | `120`                   | Sketch 58          |
| `3.*.*`                 | `121 - 131`             | Sketch 59 - 67     |

## Related projects

- [sketch-file-format-ts](https://github.com/sketch-hq/sketch-file-format-ts)
- [sketch-reference-files](https://github.com/sketch-hq/sketch-reference-files)

## Usage

### JavaScript/TypeScript

Add the npm module using `npm` or `yarn`,

```
npm install @sketch-hq/sketch-file-format
```

And then,

```
import schemas from '@sketch-hq/sketch-file-format'
```

The shape of the `schemas` object above is illustrated by the following type
definition (see the schema table below for explanations):

```typescript
type Schemas = {
  version: number // Latest supported Sketch document version
  versions: number[] // All supported Sketch document versions
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

| Schema      | Description                                                                                                                                           | YAML entrypoint                  | Built schema                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------ |
| File Format | Schema for a Sketch file that has been unzipped and its entries parsed into a single object, with page references replaced with concrete page objects | `schema/file-format.schema.yaml` | `dist/file-format.schema.json` |
| Document    | Schema for the document JSON entry in a Sketch ZIP file                                                                                               | `schema/document.schema.yaml`    | `dist/document.schema.json`    |
| Page        | Schema for the page JSON entries in a Sketch ZIP file                                                                                                 | `schema/layers/page.schema.yaml` | `dist/page.schema.json`        |
| Meta        | Schema for the meta JSON entry in a Sketch ZIP file                                                                                                   | `schema/meta.schema.yaml`        | `dist/meta.schema.json`        |
| User        | Schema for the user JSON entry in a Sketch ZIP file                                                                                                   | `schema/user.schema.yaml`        | `dist/user.schema.json`        |
| Workspace   | Schema for the workspace JSON entry in a Sketch ZIP file                                                                                              | `schema/workspace.schema.yaml`   | `dist/workspace.schema.json`   |

> Check the [changelog](./CHANGELOG.md) for more information.

## Development

This section of the readme is related to developing the file format spec. If you
just want to consume the schemas you can safely ignore this.

The schema YAML files in this repo are hand-editable but tooling can be used to
improve the developer experience. Node, yarn and VS Code are required to make
the most of the tooling in this repo, although this sort of developer
environment is purely optional.

- The required Node version is listed in the [.nvmrc](./.nvmrc) file
- Yarn `1.13` or later is required, and delegates to the Yarn binary checked in
  at `.yarn/releases`

### Repository branches

| Branch          | Description                          |
| --------------- | ------------------------------------ |
| `master`        | Main development branch              |
| `v1`, `v2` etc. | Branches for previous major versions |

### Scripts

| Script                        | Description                                                                                                                                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| yarn build                    | Builds the schema and the module entrypoint to `dist/`                                                                                                                                                                                                                                           |
| yarn validate-schemas         | Checks the schema for correctness against the Draft 7 meta-schema                                                                                                                                                                                                                                |
| yarn validate-reference-files | Builds the schemas and uses them to validate the suite of Sketch files from the [sketch-reference-files](https://github.com/sketch-hq/sketch-reference-files) repo. You need to pass the document versions you want to validate as an argument, e.g. `yarn validate-reference-files 121,122,123` |
| yarn validate-file            | Validate an arbitrary Sketch file with the current schemas, e.g. `yarn validate-file /absolute/path/to/file.sketch`                                                                                                                                                                              |
| yarn format-check             | Checks the repo with Prettier                                                                                                                                                                                                                                                                    |

### Semver

The version of these file format schemas will follow
[semver](https://semver.org/), remaining independent of the Sketch version.

Our ambition is to remain pragmatic while selecting semver bump types.
Technically even a patch change can introduce breaking changes to some clients
downstream. Use the table below as a guide only.

| Bump type | Discussion                                                                                                                                                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Major     | Implies the addition of major changes that may be backwards incompatible, e.g. the transition of a property from optional to required. The schemas will fail to validate Sketch documents considered valid by the previous version before the major bump |
| Minor     | Implies the addition of a new backwards compatible feature, e.g. the addition of a new optional property                                                                                                                                                 |
| Patch     | Implies a bug fix or trivial change, but could introduce a breaking change if a dependant package was previously implementing buggy schemas                                                                                                              |
| Pre       | Bumps between prereleases convey no specific semantics                                                                                                                                                                                                   |

### Workflows

#### Conventional commits

Try and use the [conventional commits](https://www.conventionalcommits.org/)
convention when writing commit messages. This isn't enforced, but you can use
the `yarn commit` command (in place of `git commit -m "foo"`) to open an
interactive CLI to walk you through generating a properly formatted commit
message.

#### Updating the schemas

1. Update the schema YAML source files to reflect your changes to the
   specification
1. Use the `yarn validate-schemas` script to check that your changes are valid
   according to JSON Schema Draft 7
1. Use the `yarn validate-file` and `yarn validate-reference-files` scripts to
   validate real Sketch files with your updated schemas.
1. Determine the semver bump type and call `yarn changeset` to create an intent
   to release your changes (read more about changesets
   [here](https://github.com/atlassian/changesets)).
1. Open a PR to `master`

#### Pre-release

> ℹ️ This section is work in progress until we release our first pre-release.
> Pre-releases will be used as a staging area to publish changes to the
> specification required by an as-yet unreleased version of the Sketch Mac app.

1. Create a new branch to track the pre-release, e.g. `v5`
1. Read the changesets pre-release
   [docs](https://github.com/atlassian/changesets/blob/master/docs/prereleases.md)
1. Enter pre-release mode on the branch `yarn changeset pre enter {tag}`
1. Commit the changes and push the branch. This branch will act as a stand-in
   for `master` for all work related to the pre-release
1. PR into the new branch with feature branches, calling `yarn changeset` as per
   normal to signal intents to publish. Since this is a pre-release it's likely
   that we'll be marshalling a major version bump
1. Publishing pre-releases is not automated, so when you're ready to publish the
   pre-release call `yarn changeset version` and then `yarn release`

#### Release

1. Merge the release PR maintained by the changesets
   [GitHub Action](https://github.com/changesets/action).

### Processing during build

While the build output is valid JSON Schema, the YAML source files are not. They
include a number of approaches to aid maintainability, listed below.

#### Abstract schemas

Abstract schemas are a device to aid DRYness in the YAML source. They are
processed out of the final build output by the `assemble` function.

#### Additional properties

The `additionalProperties` keyword is used by JSON Schema to define whether an
object allows arbitrary extra properties on itself beyond those explicitly
listed. According to the spec it defaults to `true`, but in order to increase
strictness we set it to `false` on every object schema in the output, unless
already present.

#### Required properties

The `required` keyword is used by JSON Schema to list object properties that
must be present in order for it to be considered valid. Again, in order to
increase strictness we automatically set every object property as required. If a
property is genuinely optional, then it can be listed in the non-standard
`optional` keyword, which is processed out of the build output.
