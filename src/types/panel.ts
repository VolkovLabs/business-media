import { ImageSizeModes } from '../constants';
import { ButtonType, ZoomType } from './toolbar';

/**
 * Options
 */
export interface PanelOptions {
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
  widthMode: ImageSizeModes;

  /**
   * Image height mode
   *
   * @type {string}
   */
  heightMode: ImageSizeModes;

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
   * URL
   *
   * @type {string}
   */
  url: string;

  /**
   * Title for URL
   *
   * @type {string}
   */
  title: string;

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
}
