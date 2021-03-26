/**
 * UUID string.
 */
export type Uuid = string
/**
 * Collection of global document objects
 */
export type AssetCollection = {
  _class: 'assetCollection'
  imageCollection?: ImageCollection
  colorAssets: ColorAsset[]
  gradientAssets: GradientAsset[]
  images: (ImageFileRef | ImageDataRef)[]
  colors: Color[]
  gradients: Gradient[]
  exportPresets: []
}
/**
 * Legacy object only retained for migrating older documents.
 */
export type ImageCollection = {
  _class: 'imageCollection'
  images: any
}
/**
 * Defines a reusable color asset
 */
export type ColorAsset = {
  _class: 'MSImmutableColorAsset'
  do_objectID: Uuid
  name: string
  color: Color
}
/**
 * Defines a RGBA color value
 */
export type Color = {
  _class: 'color'
  alpha: UnitInterval
  red: UnitInterval
  green: UnitInterval
  blue: UnitInterval
}
/**
 * The set of all real numbers that are greater than or equal to 0 and less than or equal to 1. Used within Sketch documents to encode normalised scalar values, for example RGB color components.
 */
export type UnitInterval = number
/**
 * Defines a reusable gradient asset
 */
export type GradientAsset = {
  _class: 'MSImmutableGradientAsset'
  do_objectID: Uuid
  name: string
  gradient: Gradient
}
/**
 * Defines a gradient
 */
export type Gradient = {
  _class: 'gradient'
  gradientType: GradientType
  elipseLength: number
  from: PointString
  to: PointString
  stops: GradientStop[]
}
/**
 * Enumeration of the gradient types
 */
export enum GradientType {
  Linear = 0,
  Radial = 1,
  Angular = 2,
}
/**
 * A formatted string representation of a 2D point, e.g. {1, 1}.

 */
export type PointString = string
/**
 * Defines a position on a gradient that marks the end of a transition to a new color
 */
export type GradientStop = {
  _class: 'gradientStop'
  color: Color
  position: UnitInterval
}
/**
 * Defines a reference to an image file within the document bundle
 */
export type ImageFileRef = {
  _class: 'MSJSONFileReference'
  _ref_class: 'MSImageData'
  _ref: string
}
/**
 * Defines a reference to an image data within the document bundle
 */
export type ImageDataRef = {
  _class: 'MSJSONOriginalDataReference'
  _ref_class: 'MSImageData'
  _ref: string
  data: {
    _data: string
  }
  sha1: {
    _data: string
  }
}
/**
 * Enumeration of the color profiles Sketch can use to render a document
 */
export enum ColorSpace {
  Unmanaged = 0,
  SRGB = 1,
  P3 = 2,
}
/**
 * Defines a layer style that has been imported from a library
 */
export type ForeignLayerStyle = {
  _class: 'MSImmutableForeignLayerStyle'
  libraryID: Uuid
  sourceLibraryName: string
  symbolPrivate: boolean
  remoteStyleID: Uuid
  localSharedStyle: SharedStyle
}
/**
 * Defines a reusable style
 */
export type SharedStyle = {
  _class: 'sharedStyle'
  do_objectID: Uuid
  name: string
  value: Style
}
/**
 * Defines a layer style
 */
export type Style = {
  _class: 'style'
  borders?: Border[]
  borderOptions: BorderOptions
  blur?: Blur
  fills?: Fill[]
  startMarkerType: MarkerType
  endMarkerType: MarkerType
  miterLimit: number
  windingRule: WindingRule
  textStyle?: TextStyle
  shadows?: Shadow[]
  innerShadows: InnerShadow[]
  contextSettings?: GraphicsContextSettings
  colorControls: ColorControls
}
/**
 * Defines a border style
 */
export type Border = {
  _class: 'border'
  isEnabled: boolean
  color: Color
  fillType: FillType
  position: BorderPosition
  thickness: number
  contextSettings: GraphicsContextSettings
  gradient: Gradient
}
/**
 * Enumeration of the fill types
 */
export enum FillType {
  Color = 0,
  Gradient = 1,
  Pattern = 4,
}
/**
 * Enumeration of border positions
 */
export enum BorderPosition {
  Center = 0,
  Inside = 1,
  Outside = 2,
}
/**
 * Defines the opacity and blend mode of a style or shadow
 */
export type GraphicsContextSettings = {
  _class: 'graphicsContextSettings'
  blendMode: BlendMode
  opacity: number
}
/**
 * Enumeration of the blend modes that can be applied to fills
 */
export enum BlendMode {
  Normal = 0,
  Darken = 1,
  Multiply = 2,
  ColorBurn = 3,
  Lighten = 4,
  Screen = 5,
  ColorDodge = 6,
  Overlay = 7,
  SoftLight = 8,
  HardLight = 9,
  Difference = 10,
  Exclusion = 11,
  Hue = 12,
  Saturation = 13,
  Color = 14,
  Luminosity = 15,
  PlusDarker = 16,
  PlusLighter = 17,
}
/**
 * Defines border options
 */
export type BorderOptions = {
  _class: 'borderOptions'
  isEnabled: boolean
  dashPattern: number[]
  lineCapStyle: LineCapStyle
  lineJoinStyle: LineJoinStyle
}
/**
 * Enumeration of the line cap styles
 */
export enum LineCapStyle {
  Butt = 0,
  Round = 1,
  Projecting = 2,
}
/**
 * Enumeration of the line join styles
 */
export enum LineJoinStyle {
  Miter = 0,
  Round = 1,
  Bevel = 2,
}
/**
 * Defines a blur style
 */
export type Blur = {
  _class: 'blur'
  isEnabled: boolean
  center: PointString
  motionAngle?: number
  radius?: number
  saturation: number
  type: BlurType
}
/**
 * Enumeration of the various blur types
 */
export enum BlurType {
  Gaussian = 0,
  Motion = 1,
  Zoom = 2,
  Background = 3,
}
/**
 * Defines a fill style
 */
export type Fill = {
  _class: 'fill'
  isEnabled: boolean
  color: Color
  fillType: FillType
  noiseIndex: number
  noiseIntensity: number
  patternFillType: PatternFillType
  patternTileScale: number
  contextSettings: GraphicsContextSettings
  gradient: Gradient
  image?: ImageFileRef | ImageDataRef
}
/**
 * Enumeration of pattern fill types
 */
export enum PatternFillType {
  Tile = 0,
  Fill = 1,
  Stretch = 2,
  Fit = 3,
}
/**
 * Enumeration of the possible types of vector line endings
 */
export enum MarkerType {
  OpenArrow = 0,
  FilledArrow = 1,
  Line = 2,
  OpenCircle = 3,
  FilledCircle = 4,
  OpenSquare = 5,
  FilledSquare = 6,
}
/**
 * Enumeration of the winding rule that controls how fills behave in shapes with complex paths
 */
export enum WindingRule {
  NonZero = 0,
  EvenOdd = 1,
}
/**
 * Defines text style
 */
export type TextStyle = {
  _class: 'textStyle'
  verticalAlignment: TextVerticalAlignment
  encodedAttributes: {
    paragraphStyle?: ParagraphStyle
    MSAttributedStringTextTransformAttribute?: TextTransform
    underlineStyle?: UnderlineStyle
    strikethroughStyle?: {}
    kerning?: number
    MSAttributedStringFontAttribute: FontDescriptor
    textStyleVerticalAlignmentKey?: TextVerticalAlignment
    MSAttributedStringColorAttribute?: Color
  }
}
/**
 * Enumeration of the text style vertical alighment options
 */
export enum TextVerticalAlignment {
  Top = 0,
  Middle = 1,
  Bottom = 2,
}
/**
 * Defines the paragraph style within a text style
 */
export type ParagraphStyle = {
  _class: 'paragraphStyle'
  alignment?: TextHorizontalAlignment
  maximumLineHeight?: number
  minimumLineHeight?: number
  paragraphSpacing: number
}
/**
 * Enumeration of the horizontal alignment options for paragraphs
 */
export enum TextHorizontalAlignment {
  Left = 0,
  Right = 1,
  Centered = 2,
  Justified = 3,
  Natural = 4,
}
/**
 * Enumeration of the text style transformations options
 */
export enum TextTransform {
  None = 0,
  Uppercase = 1,
  Lowercase = 2,
}
/**
 * Enumeration of the text style underline options
 */
export enum UnderlineStyle {
  None = 0,
  Underlined = 1,
}
/**
 * Defines a font selection
 */
export type FontDescriptor = {
  _class: 'fontDescriptor'
  attributes: {
    name: string
    size: number
  }
}
/**
 * Defines a shadow style
 */
export type Shadow = {
  _class: 'shadow'
  isEnabled: boolean
  blurRadius: number
  color: Color
  contextSettings: GraphicsContextSettings
  offsetX: number
  offsetY: number
  spread: number
}
/**
 * Defines an inner shadow style
 */
export type InnerShadow = {
  _class: 'innerShadow'
  isEnabled: boolean
  blurRadius: number
  color: Color
  contextSettings: GraphicsContextSettings
  offsetX: number
  offsetY: number
  spread: number
}
/**
 * Defines color adjust styles on images
 */
export type ColorControls = {
  _class: 'colorControls'
  isEnabled: boolean
  brightness: number
  contrast: number
  hue: number
  saturation: number
}
/**
 * Defines a symbol that has been imported from a library
 */
export type ForeignSymbol = {
  _class: 'MSImmutableForeignSymbol'
  libraryID: Uuid
  sourceLibraryName: string
  symbolPrivate: boolean
  originalMaster: SymbolMaster
  symbolMaster: SymbolMaster
}
/**
 * A symbol master layer represents a reusable group of layers
 */
export type SymbolMaster = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  hasClickThrough: boolean
  groupLayout?: FreeformGroupLayout | InferredGroupLayout
  layers: (
    | Artboard
    | Group
    | Oval
    | Polygon
    | Rectangle
    | ShapePath
    | Star
    | Triangle
    | ShapeGroup
    | Text
    | SymbolMaster
    | SymbolInstance
    | Slice
    | Hotspot
    | Bitmap
  )[]
  _class: 'symbolMaster'
  backgroundColor: Color
  hasBackgroundColor: boolean
  horizontalRulerData: RulerData
  includeBackgroundColorInExport: boolean
  includeInCloudUpload: boolean
  isFlowHome: boolean
  resizesContent: boolean
  verticalRulerData: RulerData
  includeBackgroundColorInInstance: boolean
  symbolID: Uuid
  changeIdentifier: number
  allowsOverrides: boolean
  overrideProperties: OverrideProperty[]
  presetDictionary?: any
}
/**
 * Enumeration of the boolean operations that can be applied to combine shapes
 */
export enum BooleanOperation {
  NA = -1,
  None = 0,
  Union = 1,
  Subtract = 2,
  Difference = 3,
}
/**
 * Defines a layer's export options
 */
export type ExportOptions = {
  _class: 'exportOptions'
  exportFormats: ExportFormat[]
  includedLayerIds: Uuid[]
  layerOptions: number
  shouldTrim: boolean
}
/**
 * Defines an export format, as listed in a layer's export options
 */
export type ExportFormat = {
  _class: 'exportFormat'
  absoluteSize: number
  fileFormat: ExportFileFormat
  name: string
  namingScheme?: ExportFormatNamingScheme
  scale: number
  visibleScaleType: VisibleScaleType
}
/**
 * Enumeration of the file formats that can be selected in the layer export options
 */
export enum ExportFileFormat {
  PNG = 'png',
  JPG = 'jpg',
  TIFF = 'tiff',
  EPS = 'eps',
  PDF = 'pdf',
  WEBP = 'webp',
  SVG = 'svg',
}
/**
 * Enumeration of the possible types of export format naming schemes
 */
export enum ExportFormatNamingScheme {
  Suffix = 0,
  Prefix = 1,
}
/**
 * Enumeration of the possible values to control how an exported layer will be scaled
 */
export enum VisibleScaleType {
  Scale = 0,
  Width = 1,
  Height = 2,
}
/**
 * Defines an abstract rectangle
 */
export type Rect = {
  _class: 'rect'
  constrainProportions: boolean
  height: number
  width: number
  x: number
  y: number
}
/**
 * Defines a connection between elements in a prototype
 */
export type FlowConnection = {
  _class: 'MSImmutableFlowConnection'
  destinationArtboardID: Uuid | 'back'
  animationType: AnimationType
}
/**
 * Enumeration of the animation transition types between prototype screens
 */
export enum AnimationType {
  None = 0,
  SlideFromLeft = 1,
  SlideFromRight = 2,
  SlideFromBottom = 3,
  SlideFromTop = 4,
}
/**
 * Enumeration of the expansion states in the layer list UI
 */
export enum LayerListExpanded {
  Undecided = 0,
  Collapsed = 1,
  Expanded = 2,
}
/**
 * Enumeration of the possible resize types
 */
export enum ResizeType {
  Stretch = 0,
  PinToEdge = 1,
  Resize = 2,
  Float = 3,
}
/**
 * Normal group layout
 */
export type FreeformGroupLayout = {
  _class: 'MSImmutableFreeformGroupLayout'
}
/**
 * Inferred group layout defines smart layout options
 */
export type InferredGroupLayout = {
  _class: 'MSImmutableInferredGroupLayout'
  axis: InferredLayoutAxis
  layoutAnchor: InferredLayoutAnchor
}
/**
 * Enumeration of the axis types for inferred (aka smart) layout
 */
export enum InferredLayoutAxis {
  None = 0,
  Horizontal = 1,
  Vertical = 2,
}
/**
 * Enumeration of the anchor types for inferred (aka smart) layout
 */
export enum InferredLayoutAnchor {
  Min = 0,
  Middle = 1,
  Max = 2,
}
/**
 * Artboard layers are a document organisation aid. They have a fixed frame that usually map to variations of device dimensions or viewport sizes
 */
export type Artboard = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  hasClickThrough: boolean
  groupLayout?: FreeformGroupLayout | InferredGroupLayout
  layers: (
    | Artboard
    | Group
    | Oval
    | Polygon
    | Rectangle
    | ShapePath
    | Star
    | Triangle
    | ShapeGroup
    | Text
    | SymbolMaster
    | SymbolInstance
    | Slice
    | Hotspot
    | Bitmap
  )[]
  _class: 'artboard'
  includeInCloudUpload: boolean
  includeBackgroundColorInExport: boolean
  horizontalRulerData: RulerData
  verticalRulerData: RulerData
  layout?: LayoutGrid
  grid?: SimpleGrid
  backgroundColor: Color
  hasBackgroundColor: boolean
  isFlowHome: boolean
  resizesContent: boolean
  presetDictionary?: any
}
/**
 * Group layers are a document organisation aid
 */
export type Group = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  hasClickThrough: boolean
  groupLayout?: FreeformGroupLayout | InferredGroupLayout
  layers: (
    | Artboard
    | Group
    | Oval
    | Polygon
    | Rectangle
    | ShapePath
    | Star
    | Triangle
    | ShapeGroup
    | Text
    | SymbolMaster
    | SymbolInstance
    | Slice
    | Hotspot
    | Bitmap
  )[]
  _class: 'group'
}
/**
 * Oval layers are the result of adding an oval shape to the canvas
 */
export type Oval = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  edited: boolean
  isClosed: boolean
  pointRadiusBehaviour: PointsRadiusBehaviour
  points: CurvePoint[]
  _class: 'oval'
}
/**
 * Enumeration of the possible values for corner rounding on shape points.
 */
export enum PointsRadiusBehaviour {
  Disabled = -1,
  Legacy = 0,
  Rounded = 1,
  Smooth = 2,
}
/**
 * Defines a shape layer curve point
 */
export type CurvePoint = {
  _class: 'curvePoint'
  cornerRadius: number
  curveFrom: PointString
  curveTo: PointString
  hasCurveFrom: boolean
  hasCurveTo: boolean
  curveMode: CurveMode
  point: PointString
}
/**
 * Enumeration of the curve modes that can be applied to vector points
 */
export enum CurveMode {
  None = 0,
  Straight = 1,
  Mirrored = 2,
  Asymmetric = 3,
  Disconnected = 4,
}
/**
 * Polygon layers are the result of adding a polygon shape to the canvas
 */
export type Polygon = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  edited: boolean
  isClosed: boolean
  pointRadiusBehaviour: PointsRadiusBehaviour
  points: CurvePoint[]
  _class: 'polygon'
  numberOfPoints: number
}
/**
 * Rectangle layers are the result of adding a rectangle shape to the canvas
 */
export type Rectangle = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  edited: boolean
  isClosed: boolean
  pointRadiusBehaviour: PointsRadiusBehaviour
  points: CurvePoint[]
  _class: 'rectangle'
  fixedRadius: number
  hasConvertedToNewRoundCorners: boolean
  needsConvertionToNewRoundCorners: boolean
}
/**
 * Shape path layers are the result of adding a vector layer
 */
export type ShapePath = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  edited: boolean
  isClosed: boolean
  pointRadiusBehaviour: PointsRadiusBehaviour
  points: CurvePoint[]
  _class: 'shapePath'
}
/**
 * Star layers are the result of adding a star shape to the canvas
 */
export type Star = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  edited: boolean
  isClosed: boolean
  pointRadiusBehaviour: PointsRadiusBehaviour
  points: CurvePoint[]
  _class: 'star'
  numberOfPoints: number
  radius: number
}
/**
 * Triangle layers are the result of adding a triangle shape to the canvas
 */
export type Triangle = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  edited: boolean
  isClosed: boolean
  pointRadiusBehaviour: PointsRadiusBehaviour
  points: CurvePoint[]
  _class: 'triangle'
  isEquilateral: boolean
}
/**
 * Shape groups layers group together multiple shape layers
 */
export type ShapeGroup = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  hasClickThrough: boolean
  groupLayout?: FreeformGroupLayout | InferredGroupLayout
  layers: (
    | Artboard
    | Group
    | Oval
    | Polygon
    | Rectangle
    | ShapePath
    | Star
    | Triangle
    | ShapeGroup
    | Text
    | SymbolMaster
    | SymbolInstance
    | Slice
    | Hotspot
    | Bitmap
  )[]
  _class: 'shapeGroup'
  windingRule: WindingRule
}
/**
 * A text layer represents a discrete block or line of text
 */
export type Text = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  _class: 'text'
  attributedString: AttributedString
  automaticallyDrawOnUnderlyingPath: boolean
  dontSynchroniseWithSymbol: boolean
  lineSpacingBehaviour: LineSpacingBehaviour
  textBehaviour: TextBehaviour
  glyphBounds: PointListString
}
/**
 * Defines character strings and associated styling applied to character ranges
 */
export type AttributedString = {
  _class: 'attributedString'
  string: string
  attributes: StringAttribute[]
}
/**
 * Defines an attribute assigned to a range of characters in an attributed string
 */
export type StringAttribute = {
  _class: 'stringAttribute'
  location: number
  length: number
  attributes: {
    kerning?: number
    textStyleVerticalAlignmentKey?: TextVerticalAlignment
    MSAttributedStringFontAttribute: FontDescriptor
    MSAttributedStringColorAttribute?: Color
    paragraphStyle?: ParagraphStyle
  }
}
/**
 * Enumeration of line spacing behaviour for fixed line height text
 */
export enum LineSpacingBehaviour {
  None = 0,
  Legacy = 1,
  ConsistentBaseline = 2,
}
/**
 * Enumeration of the behaviours for text layers
 */
export enum TextBehaviour {
  Flexible = 0,
  Fixed = 1,
}
/**
 * A string representation of a series of 2D points, in the format {{x, y}, {x,y}}.
 */
export type PointListString = string
/**
 * Symbol instance layers represent an instance of a symbol master
 */
export type SymbolInstance = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  _class: 'symbolInstance'
  overrideValues: OverrideValue[]
  scale: number
  symbolID: Uuid
  verticalSpacing: number
  horizontalSpacing: number
}
/**
 * Defines an individual symbol override
 */
export type OverrideValue = {
  _class: 'overrideValue'
  do_objectID: Uuid
  overrideName: OverrideName
  value: string | Uuid | ImageFileRef | ImageDataRef
}
/**
 * Defines the valid string patterns for an override name
 */
export type OverrideName = string | string | string
/**
 * Slice layers allow the content beneath their frame to be exported
 */
export type Slice = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  _class: 'slice'
  hasBackgroundColor: boolean
  backgroundColor: Color
}
/**
 * Hotspot layers define clickable hotspots for use with prototypes
 */
export type Hotspot = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  _class: 'MSImmutableHotspotLayer'
}
/**
 * Bitmap layers house a single image
 */
export type Bitmap = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  _class: 'bitmap'
  fillReplacesImage: boolean
  image: ImageFileRef | ImageDataRef
  intendedDPI: number
  clippingMask: PointListString
}
/**
 * Defines persisted ruler positions on artboards, pages and symbols
 */
export type RulerData = {
  _class: 'rulerData'
  base: number
  guides: number[]
}
/**
 * Defines the layout settings for an artboard or page
 */
export type LayoutGrid = {
  _class: 'layoutGrid'
  isEnabled: boolean
  columnWidth: number
  gutterHeight: number
  gutterWidth: number
  horizontalOffset: number
  numberOfColumns: number
  rowHeightMultiplication: number
  totalWidth: number
  guttersOutside: boolean
  drawHorizontal: boolean
  drawHorizontalLines: boolean
  drawVertical: boolean
}
/**
 * Defines the grid settings for an artboard or page
 */
export type SimpleGrid = {
  _class: 'simpleGrid'
  isEnabled: boolean
  gridSize: number
  thickGridTimes: number
}
/**
 * Defines override properties on symbol masters
 */
export type OverrideProperty = {
  _class: 'MSImmutableOverrideProperty'
  overrideName: OverrideName
  canOverride: boolean
}
/**
 * Defines a text style that has been imported from a library
 */
export type ForeignTextStyle = {
  _class: 'MSImmutableForeignTextStyle'
  libraryID: Uuid
  sourceLibraryName: string
  symbolPrivate: boolean
  remoteStyleID: Uuid
  localSharedStyle: SharedStyle
}
/**
 * Defines a document's list of reusable styles
 */
export type SharedStyleContainer = {
  _class: 'sharedStyleContainer'
  objects: SharedStyle[]
}
/**
 * Defines a document's list of reusable text styles
 */
export type SharedTextStyleContainer = {
  _class: 'sharedTextStyleContainer'
  objects: SharedStyle[]
}
/**
 * Legacy object only retained for migrating older documents.
 */
export type SymbolContainer = {
  _class: 'symbolContainer'
  objects: []
}
/**
 * Defines a reference to a JSON page file within the document bundle
 */
export type PageFileRef = {
  _class: 'MSJSONFileReference'
  _ref_class: 'MSImmutablePage'
  _ref: string
}
/**
 * Page layers are the top level organisational abstraction within a document
 */
export type Page = {
  do_objectID: Uuid
  booleanOperation: BooleanOperation
  exportOptions: ExportOptions
  frame: Rect
  flow?: FlowConnection
  isFixedToViewport: boolean
  isFlippedHorizontal: boolean
  isFlippedVertical: boolean
  isLocked: boolean
  isVisible: boolean
  layerListExpandedType: LayerListExpanded
  name: string
  nameIsFixed: boolean
  resizingConstraint: number
  resizingType: ResizeType
  rotation: number
  sharedStyleID?: Uuid
  shouldBreakMaskChain: boolean
  hasClippingMask?: boolean
  clippingMaskMode?: number
  userInfo?: any
  style?: Style
  maintainScrollPosition: boolean
  hasClickThrough: boolean
  groupLayout?: FreeformGroupLayout | InferredGroupLayout
  layers: (
    | Artboard
    | Group
    | Oval
    | Polygon
    | Rectangle
    | ShapePath
    | Star
    | Triangle
    | ShapeGroup
    | Text
    | SymbolMaster
    | SymbolInstance
    | Slice
    | Hotspot
    | Bitmap
  )[]
  _class: 'page'
  includeInCloudUpload: boolean
  horizontalRulerData: RulerData
  verticalRulerData: RulerData
  layout?: LayoutGrid
  grid?: SimpleGrid
}
/**
 * Contains metadata about the Sketch file - information about pages and artboards appearing in the file, fonts used, the version of Sketch used to save the file etc.
 */
export type Meta = {
  commit: string
  pagesAndArtboards: {
    [key: string]: {
      name: string
      artboards: {
        [key: string]: {
          name: string
        }
      }
    }
  }
  version: 120
  fonts: string[]
  compatibilityVersion: 99
  app: BundleId
  autosaved: NumericalBool
  variant: SketchVariant
  created: {
    commit: string
    appVersion: string
    build: number
    app: BundleId
    compatibilityVersion: number
    version: number
    variant: SketchVariant
  }
  saveHistory: string[]
  appVersion: '58'
  build: number
}
/**
 * Enumeration of the Apple bundle ids for the various variants of Sketch
 */
export enum BundleId {
  PublicRelease = 'com.bohemiancoding.sketch3',
  Beta = 'com.bohemiancoding.sketch3.beta',
  Private = 'com.bohemiancoding.sketch3.private',
  Internal = 'com.bohemiancoding.sketch3.internal',
  Experimental = 'com.bohemiancoding.sketch3.experimental',
}
/**
 * A numerical boolean where 0 is false, and 1 is true.
 */
export enum NumericalBool {
  True = 0,
  False = 1,
}
/**
 * Enumeration of the Sketch variants
 */
export type SketchVariant =
  | 'NONAPPSTORE'
  | 'APPSTORE'
  | 'BETA'
  | 'PRIVATE'
  | 'INTERNAL'
  | 'EXPERIMENTAL'
/**
 * TODO
 */
export type User = {
  document: {
    pageListHeight: number
    pageListCollapsed: number
  }
  [key: string]: any
}
/**
 * This schema describes a representation of an expanded Sketch file, that is, a Sketch file that has been unzipped, all of its entries parsed to JSON and merged into a single object. A concrete example of an expanded sketch file is the return value of the `fromFile` function
 */
export type Contents = {
  document: {
    _class: 'document'
    do_objectID: Uuid
    assets: AssetCollection
    colorSpace: ColorSpace
    currentPageIndex: number
    foreignLayerStyles: ForeignLayerStyle[]
    foreignSymbols: ForeignSymbol[]
    foreignTextStyles: ForeignTextStyle[]
    layerStyles: SharedStyleContainer
    layerTextStyles: SharedTextStyleContainer
    layerSymbols?: SymbolContainer
    pages: Page[]
  }
  meta: Meta
  user: User
}
/**
 * The document entry in a Sketch file.
 */
export type Document = {
  _class: 'document'
  do_objectID: Uuid
  assets: AssetCollection
  colorSpace: ColorSpace
  currentPageIndex: number
  foreignLayerStyles: ForeignLayerStyle[]
  foreignSymbols: ForeignSymbol[]
  foreignTextStyles: ForeignTextStyle[]
  layerStyles: SharedStyleContainer
  layerTextStyles: SharedTextStyleContainer
  layerSymbols?: SymbolContainer
  pages: PageFileRef[]
}
/**
 * Union of all layers
 */
export type AnyLayer =
  | SymbolMaster
  | Artboard
  | Group
  | Oval
  | Polygon
  | Rectangle
  | ShapePath
  | Star
  | Triangle
  | ShapeGroup
  | Text
  | SymbolInstance
  | Slice
  | Hotspot
  | Bitmap
  | Page
/**
 * Union of all group layers
 */
export type AnyGroup = SymbolMaster | Artboard | Group | ShapeGroup | Page
/**
 * Union of all objects, i.e. objects with a _class property
 */
export type AnyObject =
  | AssetCollection
  | ImageCollection
  | ColorAsset
  | Color
  | GradientAsset
  | Gradient
  | GradientStop
  | ImageFileRef
  | ImageDataRef
  | ForeignLayerStyle
  | SharedStyle
  | Style
  | Border
  | GraphicsContextSettings
  | BorderOptions
  | Blur
  | Fill
  | TextStyle
  | ParagraphStyle
  | FontDescriptor
  | Shadow
  | InnerShadow
  | ColorControls
  | ForeignSymbol
  | SymbolMaster
  | ExportOptions
  | ExportFormat
  | Rect
  | FlowConnection
  | FreeformGroupLayout
  | InferredGroupLayout
  | Artboard
  | Group
  | Oval
  | CurvePoint
  | Polygon
  | Rectangle
  | ShapePath
  | Star
  | Triangle
  | ShapeGroup
  | Text
  | AttributedString
  | StringAttribute
  | SymbolInstance
  | OverrideValue
  | Slice
  | Hotspot
  | Bitmap
  | RulerData
  | LayoutGrid
  | SimpleGrid
  | OverrideProperty
  | ForeignTextStyle
  | SharedStyleContainer
  | SharedTextStyleContainer
  | SymbolContainer
  | PageFileRef
  | Page
/**
 * Enum of all possible _class property values
 */
export enum ClassValue {
  MSImmutableColorAsset = 'MSImmutableColorAsset',
  MSImmutableFlowConnection = 'MSImmutableFlowConnection',
  MSImmutableForeignLayerStyle = 'MSImmutableForeignLayerStyle',
  MSImmutableForeignSymbol = 'MSImmutableForeignSymbol',
  MSImmutableForeignTextStyle = 'MSImmutableForeignTextStyle',
  MSImmutableFreeformGroupLayout = 'MSImmutableFreeformGroupLayout',
  MSImmutableGradientAsset = 'MSImmutableGradientAsset',
  MSImmutableHotspotLayer = 'MSImmutableHotspotLayer',
  MSImmutableInferredGroupLayout = 'MSImmutableInferredGroupLayout',
  MSImmutableOverrideProperty = 'MSImmutableOverrideProperty',
  MSJSONFileReference = 'MSJSONFileReference',
  MSJSONOriginalDataReference = 'MSJSONOriginalDataReference',
  Artboard = 'artboard',
  AssetCollection = 'assetCollection',
  AttributedString = 'attributedString',
  Bitmap = 'bitmap',
  Blur = 'blur',
  Border = 'border',
  BorderOptions = 'borderOptions',
  Color = 'color',
  ColorControls = 'colorControls',
  CurvePoint = 'curvePoint',
  ExportFormat = 'exportFormat',
  ExportOptions = 'exportOptions',
  Fill = 'fill',
  FontDescriptor = 'fontDescriptor',
  Gradient = 'gradient',
  GradientStop = 'gradientStop',
  GraphicsContextSettings = 'graphicsContextSettings',
  Group = 'group',
  ImageCollection = 'imageCollection',
  InnerShadow = 'innerShadow',
  LayoutGrid = 'layoutGrid',
  Oval = 'oval',
  OverrideValue = 'overrideValue',
  Page = 'page',
  ParagraphStyle = 'paragraphStyle',
  Polygon = 'polygon',
  Rect = 'rect',
  Rectangle = 'rectangle',
  RulerData = 'rulerData',
  Shadow = 'shadow',
  ShapeGroup = 'shapeGroup',
  ShapePath = 'shapePath',
  SharedStyle = 'sharedStyle',
  SharedStyleContainer = 'sharedStyleContainer',
  SharedTextStyleContainer = 'sharedTextStyleContainer',
  SimpleGrid = 'simpleGrid',
  Slice = 'slice',
  Star = 'star',
  StringAttribute = 'stringAttribute',
  Style = 'style',
  SymbolContainer = 'symbolContainer',
  SymbolInstance = 'symbolInstance',
  SymbolMaster = 'symbolMaster',
  Text = 'text',
  TextStyle = 'textStyle',
  Triangle = 'triangle',
}
/**
 * A mapping of class values to object types
 */
export type ClassMap = {
  triangle: Triangle
  textStyle: TextStyle
  text: Text
  symbolMaster: SymbolMaster
  symbolInstance: SymbolInstance
  symbolContainer: SymbolContainer
  style: Style
  stringAttribute: StringAttribute
  star: Star
  slice: Slice
  simpleGrid: SimpleGrid
  sharedTextStyleContainer: SharedTextStyleContainer
  sharedStyleContainer: SharedStyleContainer
  sharedStyle: SharedStyle
  shapePath: ShapePath
  shapeGroup: ShapeGroup
  shadow: Shadow
  rulerData: RulerData
  rectangle: Rectangle
  rect: Rect
  polygon: Polygon
  paragraphStyle: ParagraphStyle
  page: Page
  overrideValue: OverrideValue
  oval: Oval
  layoutGrid: LayoutGrid
  innerShadow: InnerShadow
  imageCollection: ImageCollection
  group: Group
  graphicsContextSettings: GraphicsContextSettings
  gradientStop: GradientStop
  gradient: Gradient
  fontDescriptor: FontDescriptor
  fill: Fill
  exportOptions: ExportOptions
  exportFormat: ExportFormat
  curvePoint: CurvePoint
  colorControls: ColorControls
  color: Color
  borderOptions: BorderOptions
  border: Border
  blur: Blur
  bitmap: Bitmap
  attributedString: AttributedString
  assetCollection: AssetCollection
  artboard: Artboard
  MSJSONOriginalDataReference: ImageDataRef
  MSJSONFileReference: ImageFileRef
  MSImmutableOverrideProperty: OverrideProperty
  MSImmutableInferredGroupLayout: InferredGroupLayout
  MSImmutableHotspotLayer: Hotspot
  MSImmutableGradientAsset: GradientAsset
  MSImmutableFreeformGroupLayout: FreeformGroupLayout
  MSImmutableForeignTextStyle: ForeignTextStyle
  MSImmutableForeignSymbol: ForeignSymbol
  MSImmutableForeignLayerStyle: ForeignLayerStyle
  MSImmutableFlowConnection: FlowConnection
  MSImmutableColorAsset: ColorAsset
}
