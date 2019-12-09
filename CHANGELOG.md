# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.5](https://github.com/sketch-hq/sketch-file-format/compare/v1.1.4...v1.1.5) (2019-12-06)


### Bug Fixes

* hotfix v1 with correctness fixes to v3 ([dfd8786](https://github.com/sketch-hq/sketch-file-format/commit/dfd8786ea56d93e3fd117c7a7b33b83fe44d72ab))

### [1.1.4](https://github.com/sketch-hq/sketch-file-format/compare/v1.1.3...v1.1.4) (2019-10-31)


### Bug Fixes

* add contextSettings and gradient as optional props to border objects ([5696383](https://github.com/sketch-hq/sketch-file-format/commit/569638390f5002447670ecb9342e624ec6d03223))
* add contextSettings and gradient as optional props to the fill object ([acf8bfc](https://github.com/sketch-hq/sketch-file-format/commit/acf8bfc6a2ae210179049a038842a0d879e21d10))
* add optional innerShadows style prop ([de81722](https://github.com/sketch-hq/sketch-file-format/commit/de8172260d331fc5e16df5ec186d44a53997ee69))
* the prop presetDictionary was the wrong type, also add to symbol master ([da62a1a](https://github.com/sketch-hq/sketch-file-format/commit/da62a1aee46b344f73272ead1d675d6564c95a7d))

### [1.1.3](https://github.com/sketch-hq/sketch-file-format/compare/v1.1.2...v1.1.3) (2019-10-31)

### [1.1.2](https://github.com/sketch-hq/sketch-file-format/compare/v1.1.1...v1.1.2) (2019-10-30)


### Bug Fixes

* add optional colorControls prop to style object ([ebe2819](https://github.com/sketch-hq/sketch-file-format/commit/ebe28199df54445ac8e7ecb87319fa3d5cf71f6a))

### [1.1.1](https://github.com/sketch-hq/sketch-file-format/compare/v1.1.0...v1.1.1) (2019-10-30)


### Bug Fixes

* add optional borderOptions style property ([1f30fef](https://github.com/sketch-hq/sketch-file-format/commit/1f30fef7d550bd9feb96ffb49bd8de21b8111a46))
* add optional exportPresets property ([00a6202](https://github.com/sketch-hq/sketch-file-format/commit/00a62022806ed6da0ba5aec3cf5454ade0a7dbac))

## [1.1.0](https://github.com/sketch-hq/sketch-file-format/compare/v1.0.3...v1.1.0) (2019-10-30)


### Features

* integrate the new sketch-reference-files dependency ([#17](https://github.com/sketch-hq/sketch-file-format/issues/17)) ([3b9bc98](https://github.com/sketch-hq/sketch-file-format/commit/3b9bc9891092ca63ae94d17ada9811908ac53d49)), closes [#13](https://github.com/sketch-hq/sketch-file-format/issues/13)

### [1.0.3](https://github.com/sketch-hq/sketch-file-format/compare/v1.0.2...v1.0.3) (2019-10-25)

### [1.0.2](https://github.com/sketch-hq/sketch-file-format/compare/v1.0.1...v1.0.2) (2019-10-18)


### Bug Fixes

* ensure package is freshly built before publish ([a770ef1](https://github.com/sketch-hq/sketch-file-format/commit/a770ef1117c6c61b082b865c780e3b9002a3b043))
* skip husky hooks on release auto-commits ([d644c45](https://github.com/sketch-hq/sketch-file-format/commit/d644c45f8a100291c87a1b1a0fdd2ca99935d429))

### [1.0.1](https://github.com/sketch-hq/sketch-file-format/compare/v1.0.0...v1.0.1) (2019-10-18)


### Bug Fixes

* add changelog to prettierignore, since its auto-generated ([8f3529e](https://github.com/sketch-hq/sketch-file-format/commit/8f3529e857fe76a5ba294291cdba08a34cab83ff))
* fix schema ids to point at unpkg raw file ([eebc490](https://github.com/sketch-hq/sketch-file-format/commit/eebc490adc7b8c8df468d33141a99393d083d8bd))

## 1.0.0 (2019-10-18)

* first release, supporting Sketch files with document version `119`