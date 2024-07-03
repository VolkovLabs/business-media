import { ImageScale, ImageSizeMode, PanelOptions, ZoomType } from '../types';

/**
 * Default Options
 */
export const DEFAULT_OPTIONS: PanelOptions = {
  autoPlay: true,
  buttons: [],
  controls: true,
  description: '',
  height: 0,
  heightMode: ImageSizeMode.AUTO,
  heightName: '',
  infinityPlay: false,
  noResultsMessage: 'Nothing to display...',
  scale: ImageScale.AUTO,
  autoPlayInfinity: false,
  toolbar: true,
  width: 0,
  widthMode: ImageSizeMode.AUTO,
  widthName: '',
  zoomType: ZoomType.DEFAULT,
  mediaSources: [],
  pdfToolbar: true,
};
