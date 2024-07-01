import { ImageSizeMode, MediaFormat } from './image';
import { ButtonType, ZoomType } from './toolbar';

/**
 * Image Scale
 */
export enum ImageScale {
  AUTO = 'auto',
  CRISP_EDGES = 'crisp-edges',
  PIXELATED = 'pixelated',
}

/**
 * Options
 */
export interface PanelOptions {
  /**
   * Formats
   *
   * @type {MediaFormat}
   */
  formats: MediaFormat[];

  /**
   * Video url
   *
   * @type {string}
   */
  videoUrl: string;

  /**
   * Image url
   *
   * @type {string}
   */
  imageUrl: string;

  /**
   * Field name
   *
   * @type {string}
   */
  name: string;

  /**
   * Field description
   *
   * @type {string}
   */
  description: string;

  /**
   * Image width mode
   *
   * @type {string}
   */
  widthMode: ImageSizeMode;

  /**
   * Image height mode
   *
   * @type {string}
   */
  heightMode: ImageSizeMode;

  /**
   * Field name for image width
   *
   * @type {string}
   */
  widthName: string;

  /**
   * Field name for image height
   *
   * @type {string}
   */
  heightName: string;

  /**
   * Image width
   *
   * @type {number}
   */
  width: number;

  /**
   * Image height
   *
   * @type {number}
   */
  height: number;

  /**
   * Controls
   *
   * @type {boolean}
   */
  controls: boolean;

  /**
   * Auto Play
   *
   * @type {boolean}
   */
  autoPlay: boolean;

  /**
   * Infinity Play
   *
   * @type {boolean}
   */
  infinityPlay: boolean;

  /**
   * Toolbar
   *
   * @type {boolean}
   */
  toolbar: boolean;

  /**
   * Buttons to Display on Toolbar
   *
   * @type {ButtonType[]}
   */
  buttons: ButtonType[];

  /**
   * Zoom type
   *
   * @type {ZoomType}
   */
  zoomType: ZoomType;

  /**
   * Scale
   *
   * @type {ImageScale}
   */
  scale: ImageScale;

  /**
   * No Results Message
   *
   * @type {string}
   */
  noResultsMessage: string;

  /**
   * Poster for video preview
   *
   * @type {string}
   */
  videoPoster?: string;

  /**
   * Auto play interval
   *
   * @type {string}
   */
  autoPlayInterval?: number;

  /**
   * Infinity Auto Play
   *
   * @type {boolean}
   */
  autoPlayInfinity: boolean;
}
