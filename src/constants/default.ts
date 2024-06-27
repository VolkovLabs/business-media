import { ImageScale, ImageSizeMode, MediaFormat, PanelOptions, ZoomType } from '../types';

/**
 * Default Options
 */
export const DEFAULT_OPTIONS: PanelOptions = {
  autoPlay: true,
  buttons: [],
  controls: true,
  description: '',
  formats: [MediaFormat.AUDIO, MediaFormat.IMAGE, MediaFormat.PDF, MediaFormat.VIDEO],
  height: 0,
  heightMode: ImageSizeMode.AUTO,
  heightName: '',
  imageUrl: '',
  infinityPlay: false,
  name: '',
  noResultsMessage: 'Nothing to display...',
  scale: ImageScale.AUTO,
  sliderAutoPlayInfinity: false,
  toolbar: true,
  videoUrl: '',
  width: 0,
  widthMode: ImageSizeMode.AUTO,
  widthName: '',
  zoomType: ZoomType.DEFAULT,
};
