/**
 * Supported File Type
 */
export enum SupportedFileType {
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
 * Field names
 */
export enum ImageField {
  IMG = 'img',
  HEIGHT = 'height',
  WIDTH = 'width',
}

/**
 * Size Modes
 */
export enum ImageSizeMode {
  AUTO = 'auto',
  ORIGINAL = 'original',
  CUSTOM = 'custom',
}

/**
 * Media Format
 */
export enum MediaFormat {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  PDF = 'pdf',
}

/**
 * Media Source element
 */
export interface MediaSourceElement {
  type?: string | null;
  url?: string;
  field?: string;
}
