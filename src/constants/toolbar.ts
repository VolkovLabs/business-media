import { ButtonType, ZoomType } from '../types';

/**
 * Buttons Options
 */
export const ButtonsOptions = [
  { value: ButtonType.DOWNLOAD, label: 'Download' },
  { value: ButtonType.NAVIGATION, label: 'Navigation' },
  { value: ButtonType.ZOOM, label: 'Zoom' },
];

/**
 * Zoom Options
 */
export const ZoomOptions = [
  { value: ZoomType.DEFAULT, label: 'Default' },
  { value: ZoomType.PANPINCH, label: 'Pan and Pinch' },
];
