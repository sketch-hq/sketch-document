# Sketch File

Read and write Sketch documents from TypeScript.

## Usage

### `fromFile` function

Read a Sketch Library file containing Color Variables, and dump them to JSON:

```js
import { fromFile } from '../index'
import { resolve } from 'path'

const sketchDocumentPath = './sketch-color-library.sketch'

fromFile(resolve(__dirname, sketchDocumentPath)).then((parsedFile) => {
  const doc = parsedFile.contents.document
  if (doc.sharedSwatches) {
    type ColorToken = {
        name: string
        value: {
          r: number
          g: number
          b: number
          a: number
        }
      }
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
  }
})
```
