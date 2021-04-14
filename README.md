# `.sketch` document

[Sketch](https://sketch.com) stores documents in `.sketch` format, a zipped
archive of JSON formatted data and binary data such as images.

## Sketch file format schemas and APIs.

This projects contains the file format specification and TypeScript types to
strongly type objects representing Sketch documents, or fragments of Sketch
documents in TypeScript projects.

- [JSON Schema](./packages/file-format)
- [TypeScript types](./packages/file-format-ts)

## Development

### Pre-release

> ℹ️ This section is work in progress until we release our first pre-release.
> Pre-releases will be used as a staging area to publish changes to the
> specification required by an as-yet unreleased version of the Sketch Mac app.

1. Create a new branch to track the pre-release, e.g. `v5`
1. Read the changesets pre-release
   [docs](https://github.com/atlassian/changesets/blob/main/docs/prereleases.md)
1. Enter pre-release mode on the branch `yarn changeset pre enter {tag}`
1. Commit the changes and push the branch. This branch will act as a stand-in
   for `main` for all work related to the pre-release
1. PR into the new branch with feature branches, calling `yarn changeset` as per
   normal to signal intents to publish. Since this is a pre-release it's likely
   that we'll be marshalling a major version bump
1. Publishing pre-releases is not automated, so when you're ready to publish the
   pre-release call `yarn changeset version` and then `yarn release`

### Release

1. Following changes, run `yarn changeset` on the feature branch to document
   changes.
1. If changes have been made to the `@sketch-hq/sketch-file-format` make sure to
   include `@sketch-hq/sketch-file-format-ts` in the changeset.
1. On merge, changesets will produce a release pull-request named _Version
   Packages_ with all changes since the last release.
1. Merge the release pull-request maintained by the changesets
   [GitHub Action](https://github.com/changesets/action) to publish new releases
   to NPM.
