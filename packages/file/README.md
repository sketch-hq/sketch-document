# Sketch File

Read and write Sketch documents from TypeScript.

## Usage

### `fromFile` function

Read a Sketch Library file containing Color Variables, and dump them to JSON:

```ts
import { fromFile } from '@sketch-hq/sketch-file'
import { resolve } from 'path'

const sketchDocumentPath = './sketch-color-library.sketch'

// Custom type color swatches should be converted to
type ColorToken = {
  name: string
  value: {
    r: number
    g: number
    b: number
    a: number
  }
}

// Transform swatches into list of `ColorToken` after parsing the file successfully
fromFile(resolve(__dirname, sketchDocumentPath)).then((parsedFile) => {
  const doc = parsedFile.contents.document
  if (!doc.sharedSwatches) return

  var colors: Array<ColorToken> = []
  doc.sharedSwatches.objects.forEach((color) => {
    colors.push({
      name: color.name,
      value: {
        r: color.value.red,
        g: color.value.green,
        b: color.value.blue,
        a: color.value.alpha,
      },
    })
  })

  console.log(JSON.stringify(colors, null, 2))
})
```

### `toFile` function

Set the'Background color › Include in Export' option to `true` for all Artboards
in a Sketch document:

```ts
import { fromFile, SketchFile, toFile } from '@sketch-hq/sketch-file'
import { Artboard } from '@sketch-hq/sketch-file-format-ts/dist/cjs/types'
import { resolve } from 'path'

const sketchDocumentPath = './artboards-with-background.sketch'

fromFile(resolve(__dirname, sketchDocumentPath)).then((parsedFile) => {
  parsedFile.contents.document.pages.forEach((page) => {
    page.layers
      .filter((layer): layer is Artboard => true)
      .forEach((artboard) => {
        artboard.includeBackgroundColorInExport = true
      })
  })
  var exportableFile: SketchFile = {
    contents: parsedFile.contents,
    filepath: sketchDocumentPath,
  }
  toFile(exportableFile)
})
```
