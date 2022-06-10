import { fromFile, toFile, SketchFile } from '../file'
import { resolve } from 'path'
import FileFormat from '@sketch-hq/sketch-file-format-ts'
import * as fs from 'fs'

const FILE_WITH_ASSISTANTS = resolve(__dirname, './with-assistants.sketch')
const FILE_WITH_WORKSPACE_DATA = resolve(
  __dirname,
  './with-workspace-data.sketch',
)
const FILE_WITH_COLOR_VARIABLES = resolve(
  __dirname,
  './with-color-variables.sketch',
)

describe('toFile', () => {
  const OUTPUT = resolve(__dirname, './generated-file.sketch')
  const blankPage: FileFormat.Page = {
    _class: 'page',
    do_objectID: '628bbfa8-404c-48d5-95b0-3316c1e39fb0',
    name: 'Blank Page',
    booleanOperation: -1,
    isFixedToViewport: false,
    isFlippedHorizontal: false,
    isFlippedVertical: false,
    isLocked: false,
    isTemplate: false,
    isVisible: true,
    layerListExpandedType: 0,
    nameIsFixed: false,
    resizingConstraint: 63,
    resizingType: FileFormat.ResizeType.Stretch,
    rotation: 0,
    shouldBreakMaskChain: false,
    exportOptions: {
      _class: 'exportOptions',
      includedLayerIds: [],
      layerOptions: 0,
      shouldTrim: false,
      exportFormats: [],
    },
    frame: {
      _class: 'rect',
      constrainProportions: true,
      height: 0,
      width: 0,
      x: 0,
      y: 0,
    },
    clippingMaskMode: 0,
    hasClippingMask: false,
    hasClickThrough: true,
    groupLayout: { _class: 'MSImmutableFreeformGroupLayout' },
    layers: [],
    horizontalRulerData: { _class: 'rulerData', base: 0, guides: [] },
    verticalRulerData: { _class: 'rulerData', base: 0, guides: [] },
  }

  const contents: FileFormat.Contents = {
    document: {
      _class: 'document',
      assets: {
        _class: 'assetCollection',
        colorAssets: [],
        colors: [],
        do_objectID: '0377C8BC-E3EC-40BF-A3D9-65812526D041',
        exportPresets: [],
        gradientAssets: [],
        gradients: [],
        images: [],
      },
      colorSpace: FileFormat.ColorSpace.SRGB,
      currentPageIndex: 0,
      do_objectID: 'd1ffdd39-4d43-41f7-9cab-b68c82c91c4e',
      foreignLayerStyles: [],
      foreignSymbols: [],
      foreignTextStyles: [],
      layerStyles: {
        _class: 'sharedStyleContainer',
        objects: [],
        do_objectID: '88d3ce1e-b7af-4133-af56-088a193db726',
      },
      layerTextStyles: {
        _class: 'sharedTextStyleContainer',
        objects: [],
        do_objectID: 'b08e8447-b31d-4901-abb7-8284e1f71113',
      },
      pages: [blankPage],
    },
    meta: {
      app: FileFormat.BundleId.Testing,
      appVersion: '72',
      commit: '6896e2bfdb0a2a03f745e4054a8c5fc58565f9f1',
      pagesAndArtboards: {},
      version: 136,
      autosaved: 0,
      build: 0,
      compatibilityVersion: 99,
      variant: 'TESTING',
      created: {
        commit: '6896e2bfdb0a2a03f745e4054a8c5fc58565f9f1',
        appVersion: '72',
        build: 0,
        app: FileFormat.BundleId.Testing,
        compatibilityVersion: 99,
        variant: 'TESTING',
        version: 136,
      },
      saveHistory: [''],
    },
    user: {
      document: {
        pageListCollapsed: 0,
        pageListHeight: 100,
        expandedSymbolPathsInSidebar: [],
        expandedTextStylePathsInPopover: [],
      },
    },
    workspace: {
      one: 'string',
      two: [1, 2, 3],
      three: {
        a: true,
        b: ['foo', 'bar', 'baz'],
      },
    },
  }

  let file: SketchFile = {
    filepath: OUTPUT,
    contents: contents,
  }

  test('saves a file successfully', () => {
    toFile(file).then(() => {
      expect(fs.existsSync(OUTPUT)).toBeTruthy()
    })
  })

  test('reads workspace from previously generated file', async () => {
    var file = await fromFile(OUTPUT)
    expect(Object.keys(file.contents.workspace).length).toBe(3)
    expect(file.contents.workspace.one).toBe('string')
    expect(file.contents.workspace.two[1]).toBe(2)
    expect(file.contents.workspace.three.a).toBeTruthy()
  })
  afterAll(() => {
    fs.rmSync(OUTPUT)
  })
})

describe('fromFile', () => {
  var file: SketchFile
  beforeEach(async () => {
    file = await fromFile(FILE_WITH_COLOR_VARIABLES)
  })

  test('parses document entry', async (): Promise<void> => {
    expect(file.contents.document._class).toMatchInlineSnapshot(`"document"`)
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

  test('parses Color Variables correctly', async (): Promise<void> => {
    expect(file.contents.document.sharedSwatches?.objects.length).toBe(3)
  })

  test('parses Assistants data', async () => {
    var file = await fromFile(FILE_WITH_ASSISTANTS)
    expect(
      Object.keys(file.contents.workspace.assistants.dependencies).length,
    ).toBe(2)
  })

  test('parses random data in the workspace folder', async () => {
    var file = await fromFile(FILE_WITH_WORKSPACE_DATA)
    expect(Object.keys(file.contents.workspace).length).toBe(3)
    expect(file.contents.workspace.fruit.fruit).toBe('Apple')
    expect(file.contents.workspace.quiz.quiz.maths.q2.options[0]).toBe('1')
  })
})
