import { SelectableValue } from '@grafana/data';

import { ButtonType, ZoomType } from '../types';

/**
 * Buttons Options
 */
export const BUTTONS_OPTIONS: Array<SelectableValue<ButtonType[]>> = [
  { value: [ButtonType.DOWNLOAD], label: 'Download' },
  { value: [ButtonType.NAVIGATION], label: 'Navigation' },
  { value: [ButtonType.ZOOM], label: 'Zoom' },
];

/**
 * Zoom Options
 */
export const ZOOM_OPTIONS = [
  { value: ZoomType.DEFAULT, label: 'Full Screen' },
  { value: ZoomType.PANPINCH, label: 'Pan and Pinch' },
];
