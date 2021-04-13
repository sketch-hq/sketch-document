---
'@sketch-hq/sketch-file-format-ts': major
---

Drop types for older schema versions. This is a breaking change. Instead of
`FileFormat1`, `FileFormat2` and `FileFormat3` in addition to the latest
file format version as `default`, types are now only exported as `default`
for the latest schemas.

To import specific versions of the file format, use specific versions of
`@sketch-hq/sketch-file-format-ts` instead.
