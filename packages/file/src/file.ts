import path from 'path'
import StreamZip from 'node-stream-zip'
import FileFormat from '@sketch-hq/sketch-file-format-ts'
import Zip from 'adm-zip'

/**
 * Reads and parses Sketch documents.
 *
 * @param filepath - The file path to the Sketch document
 * @returns A {@link Promise} that resolves with a fully parsed {@link SketchFile} object once the file at the given path has been unzipped and read successfully
 */
const fromFile = async (filepath: string): Promise<SketchFile> => {
  const archive = new StreamZip({
    file: filepath,
    storeEntries: true,
  })

  const contents: FileFormat.Contents = await new Promise((resolve): void => {
    archive.on('ready', (): void => {
      const document = JSON.parse(
        archive.entryDataSync('document.json').toString(),
      )
      const pages = document.pages.map((page: { _ref: string }): void =>
        JSON.parse(archive.entryDataSync(`${page._ref}.json`).toString()),
      )
      const workspace = Object.keys(archive.entries())
        .filter((key) => key.startsWith('workspace/'))
        .filter((key) => key.endsWith('.json'))
        .reduce((acc, key) => {
          return {
            ...acc,
            [path.basename(key, '.json')]: JSON.parse(
              archive.entryDataSync(key).toString(),
            ),
          }
        }, {})

      resolve({
        document: {
          ...document,
          pages,
        },
        meta: JSON.parse(archive.entryDataSync('meta.json').toString()),
        user: JSON.parse(archive.entryDataSync('user.json').toString()),
        workspace,
      })
    })
  })

  archive.close()

  return { filepath, contents }
}

/**
 * Saves a valid Sketch document.
 *
 * @param obj - The {@link SketchFile} object to be saved.
 * @returns A void Promise
 */
const toFile = async (obj: SketchFile): Promise<void> => {
  await new Promise((resolve, reject): void => {
    const sketch = new Zip()

    // Write pages first and use the resulting paths for the file
    // references that are stored within the main document.json.
    const refs = obj.contents.document.pages.map((page): FileFormat.FileRef => {
      const p = JSON.stringify(page)
      sketch.addFile(
        path.join('pages', `${page.do_objectID}.json`),
        Buffer.alloc(Buffer.byteLength(p), p),
        `page data for: ${page.name}`,
      )

      return {
        _class: 'MSJSONFileReference',
        _ref_class: 'MSImmutablePage',
        _ref: `pages/${page.do_objectID}`,
      }
    })

    // Store workspace data
    Object.keys(obj.contents.workspace).map((key) => {
      const p = JSON.stringify(obj.contents.workspace[key])
      sketch.addFile(
        path.join('workspace', `${key}.json`),
        Buffer.alloc(Buffer.byteLength(p), p),
        `workspace data for: ${key}`,
      )
    })

    const data = {
      document: JSON.stringify(<FileFormat.Document>{
        ...obj.contents.document,
        pages: refs,
      }),
      user: JSON.stringify(obj.contents.user),
      meta: JSON.stringify(obj.contents.meta),
    }

    Object.entries(data).map(([key, val]) => {
      sketch.addFile(
        `${key}.json`,
        Buffer.alloc(Buffer.byteLength(val), val),
        `${key} data`,
      )
    })

    sketch.writeZip(obj.filepath, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve(null)
    })
  })
}

/**
 * Represents a Sketch file that is (or will be) on disk. Collates the
 * filepath with an object typed as Contents from the file format.
 */
type SketchFile = {
  filepath: string
  contents: FileFormat.Contents
}

export { fromFile, toFile, SketchFile }
