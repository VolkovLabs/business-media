import { ImageScale, ImageSizeMode, SupportedFileType } from '../types';

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
