import { ImageScale, ImageSizeMode, MediaFormat, SupportedFileType } from '../types';

/**
 * Base64 symbols for Image Types
 */
export const IMAGE_TYPES_SYMBOLS: { [id: string]: string } = {
  '/': SupportedFileType.JPEG,
  R: SupportedFileType.GIF,
  i: SupportedFileType.PNG,
  J: SupportedFileType.PDF,
  A: SupportedFileType.HEIC,
};

/**
 * Width and Height Mode Options
 */
export const SIZE_MODE_OPTIONS = [
  { value: ImageSizeMode.AUTO, label: 'Panel', description: 'Based on panel size' },
  { value: ImageSizeMode.ORIGINAL, label: 'Original' },
  { value: ImageSizeMode.CUSTOM, label: 'Custom' },
];

/**
 * Image Scale Options
 */
export const IMAGE_SCALE_OPTIONS = [
  { value: ImageScale.AUTO, label: 'Auto' },
  {
    value: ImageScale.CRISP_EDGES,
    label: 'Crisp Edges',
    description:
      'The image is scaled with an algorithm that preserves contrast and edges in the image. Generally intended for images such as pixel art or line drawings, no blurring or color smoothing occurs.',
  },
  {
    value: ImageScale.PIXELATED,
    label: 'Pixelated',
    description:
      'The image is scaled with the "nearest neighbor" or similar algorithm, preserving a "pixelated" look as the image changes in size.',
  },
];

/**
 * Support Formats Options
 */
export const SUPPORT_FORMATS_OPTIONS = [
  { value: MediaFormat.AUDIO, label: 'Audio', description: 'ogg, mp3' },
  { value: MediaFormat.IMAGE, label: 'Image', description: 'jpeg, png, gif, heic' },
  { value: MediaFormat.PDF, label: 'PDF', description: 'pdf' },
  { value: MediaFormat.VIDEO, label: 'Video', description: 'mp4, webm' },
];

/**
 * Boolean Options
 */
export const BOOLEAN_OPTIONS = [
  {
    value: true,
    label: 'Enabled',
  },
  {
    value: false,
    label: 'Disabled',
  },
];

/**
 * Base64 media header regex
 */
export const BASE64_MEDIA_HEADER_REGEX = /^data:(video\/\w+|audio\/\w+|image|application\/\w+)/;
