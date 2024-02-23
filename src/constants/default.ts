import { ImageScale, ImageSizeMode, PanelOptions, ZoomType } from '../types';

/**
 * Default Options
 */
export const DEFAULT_OPTIONS: PanelOptions = {
  autoPlay: true,
  infinityPlay: false,
  buttons: [],
  controls: true,
  description: '',
  height: 0,
  heightMode: ImageSizeMode.AUTO,
  heightName: '',
  name: '',
  title: '',
  toolbar: true,
  url: '',
  width: 0,
  widthMode: ImageSizeMode.AUTO,
  widthName: '',
  zoomType: ZoomType.DEFAULT,
  scale: ImageScale.AUTO,
};
