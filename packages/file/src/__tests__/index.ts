import { fromFile, toFile, SketchFile } from '../index'
import { resolve } from 'path'

describe('fromFile', () => {
  var file: SketchFile
  beforeEach(async () => {
    file = await fromFile(resolve(__dirname, './sketch-sample-file.sketch'))
  })
  test('parses document entry', async (): Promise<void> => {
    expect(file.contents.document._class).toMatchInlineSnapshot(`"document"`)
  })
  test('parses Color Variables correctly', async (): Promise<void> => {
    expect(file.contents.document.sharedSwatches?.objects.length).toBe(3)
  })
  test('parses document pages as array of page objects', async (): Promise<void> => {
    expect(file.contents.document.pages[0]._class).toMatchInlineSnapshot(
      `"page"`,
    )
    expect(file.contents.document.pages.length).toBe(2)
  })
  test('parses meta entry', async (): Promise<void> => {
    expect(file.contents.meta.version).toMatchInlineSnapshot(`136`)
  })
  test('parses user entry', async (): Promise<void> => {
    expect(file.contents.user.document.pageListHeight).toMatchInlineSnapshot(
      `87.5`,
    )
  })
})
/**
TODO: toFile tests
 */
