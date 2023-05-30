/**
 * Image Types
 */
export enum SupportedTypes {
  JPEG = 'image/jpeg',
  GIF = 'image/gif',
  PNG = 'image/png',
  PDF = 'application/pdf',
  HEIC = 'image/heic',
  MP4 = 'video/mp4',
  WEBM = 'video/webm',
  OGG = 'audio/ogg',
  MP3 = 'audio/mp3',
}

/**
 * Base64 symbols for Image Types
 */
export enum ImageTypesSymbols {
  '/' = SupportedTypes.JPEG,
  'R' = SupportedTypes.GIF,
  'i' = SupportedTypes.PNG,
  'J' = SupportedTypes.PDF,
  'A' = SupportedTypes.HEIC,
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
