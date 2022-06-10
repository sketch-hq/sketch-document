---
'@sketch-hq/sketch-file-format': minor
'@sketch-hq/sketch-file-format-ts': minor
---

- Add `isTemplate` attribute to Layer to mark it as template for insertion of copies elsewhere.
- Artboards now contain a `prototypeViewport` attribute with a `PrototypeViewport` object to describe the associated viewport for prototypes, replacing the untyped presetDictionary attribute.
- FlowConnection now contains an automatic destination option.
