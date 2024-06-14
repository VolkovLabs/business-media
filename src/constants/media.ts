import { ImageScale, ImageSizeMode, SupportedFileType, SupportFormats } from '../types';

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
 * SUPPORT FORMATS OPTIONS
 */
export const SUPPORT_FORMATS_OPTIONS = [
  { value: SupportFormats.AUDIO, label: 'Audio', description: 'ogg, mp3' },
  { value: SupportFormats.IMAGE, label: 'Image', description: 'jpeg, png, gif, heic' },
  { value: SupportFormats.PDF, label: 'PDF', description: 'pdf' },
  { value: SupportFormats.VIDEO, label: 'Video', description: 'mp4, webm' },
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
