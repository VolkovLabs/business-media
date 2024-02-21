import { ImageScale, PanelOptions, ZoomType } from '../types';
import { ImageSizeModes } from './image';

/**
 * Default Options
 */
export const DefaultOptions: PanelOptions = {
  autoPlay: true,
  infinityPlay: false,
  buttons: [],
  controls: true,
  description: '',
  height: 0,
  heightMode: ImageSizeModes.AUTO,
  heightName: '',
  name: '',
  title: '',
  toolbar: true,
  url: '',
  width: 0,
  widthMode: ImageSizeModes.AUTO,
  widthName: '',
  zoomType: ZoomType.DEFAULT,
  scale: ImageScale.AUTO,
};
