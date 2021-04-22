import path from 'path'
import StreamZip from 'node-stream-zip'
import FileFormat from '@sketch-hq/sketch-file-format-ts'
import Zip from 'adm-zip'

/**
 * Given a path to a Sketch file on the file system, this function unzips the
 * JSON entries and parses them out into a SketchFile object.
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
 * Given a SketchFile object, this function saves a valid Sketch document.
 */
const toFile = async (obj: SketchFile): Promise<void> => {
  await new Promise((resolve, reject): void => {
    const sketch = new Zip()

    // Write pages first and use the resulting paths for the file
    // references that are stored within the main document.json.
    const refs = obj.contents.document.pages.map(
      (page): FileFormat.FileRef => {
        const p = JSON.stringify(page)
        sketch.addFile(
          path.join('pages', `${page.do_objectID}.json`),
          Buffer.alloc(p.length, p),
          `page data for: ${page.name}`,
        )

        return {
          _class: 'MSJSONFileReference',
          _ref_class: 'MSImmutablePage',
          _ref: `pages/${page.do_objectID}`,
        }
      },
    )

    const data = {
      document: JSON.stringify(<FileFormat.Document>{
        ...obj.contents.document,
        pages: refs,
      }),
      user: JSON.stringify(obj.contents.user),
      meta: JSON.stringify(obj.contents.meta),
      workspace: JSON.stringify(obj.contents.workspace),
    }

    Object.entries(data).map(([key, val]) => {
      sketch.addFile(
        `${key}.json`,
        Buffer.alloc(val.length, val),
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
 * Represents a Sketch file that is on disk. Collates the filepath with an object typed as Contents
 * from the file format.
 */
type SketchFile = {
  filepath: string
  contents: FileFormat.Contents
}

export { fromFile, toFile, SketchFile }
