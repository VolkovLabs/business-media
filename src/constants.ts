/**
 * Image Types
 */
export enum ImageTypes {
  JPEG = 'image/jpeg',
  GIF = 'image/gif',
  PNG = 'image/png',
  PDF = 'application/pdf',
  HEIC = 'image/heic',
}

/**
 * Base64 symbols for Image Types
 */
export enum ImageTypesSymbols {
  '/' = ImageTypes.JPEG,
  'R' = ImageTypes.GIF,
  'i' = ImageTypes.PNG,
  'J' = ImageTypes.PDF,
  'A' = ImageTypes.HEIC,
}

/**
 * Field names
 */
export enum ImageFields {
  IMG = 'img',
  HEIGHT = 'height',
  WIDTH = 'width',
}

/**
 * Size Modes
 */
export enum ImageSizeModes {
  AUTO = 'auto',
  ORIGINAL = 'original',
  CUSTOM = 'custom',
}

/**
 * Width and Height Mode Options
 */
export const SizeModeOptions = [
  { value: ImageSizeModes.AUTO, label: 'Panel', description: 'Based on panel size' },
  { value: ImageSizeModes.ORIGINAL, label: 'Original' },
  { value: ImageSizeModes.CUSTOM, label: 'Custom' },
];
