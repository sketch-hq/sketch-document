---
'@sketch-hq/sketch-file-format-ts': major
---

Drop types for older schema versions. This is a breaking change. Instead of
`FileFormat1`, `FileFormat2` and `FileFormat3`, types are now always exported as
`FileFormat`. Any import statements must be updated accordingly.
