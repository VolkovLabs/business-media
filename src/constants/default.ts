import { ImageScale, ImageSizeMode, PanelOptions, SupportFormats, ZoomType } from '../types';

/**
 * Default Options
 */
export const DEFAULT_OPTIONS: PanelOptions = {
  autoPlay: true,
  buttons: [],
  controls: true,
  description: '',
  formats: [SupportFormats.AUDIO, SupportFormats.IMAGE, SupportFormats.PDF, SupportFormats.VIDEO],
  height: 0,
  heightMode: ImageSizeMode.AUTO,
  heightName: '',
  imageUrl: '',
  infinityPlay: false,
  name: '',
  noResultsMessage: 'Nothing to display...',
  scale: ImageScale.AUTO,
  title: '',
  toolbar: true,
  url: '',
  videoUrl: '',
  width: 0,
  widthMode: ImageSizeMode.AUTO,
  widthName: '',
  zoomType: ZoomType.DEFAULT,
};
