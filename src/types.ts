import { ImageSizeModes } from './constants';

/**
 * Options
 */
export interface PanelOptions {
  /**
   * Field name for image
   *
   * @type string
   */
  name: string;

  /**
   * Image width mode
   *
   * @type string
   */
  widthMode: ImageSizeModes;

  /**
   * Image height mode
   *
   * @type string
   */
  heightMode: ImageSizeModes;

  /**
   * Field name for image width
   *
   * @type string
   */
  widthName: string;

  /**
   * Field name for image height
   *
   * @type string
   */
  heightName: string;

  /**
   * Image width
   *
   * @type number
   */
  width: number;

  /**
   * Image height
   *
   * @type number
   */
  height: number;

  /**
   * URL
   *
   * @type string
   */
  url: string;

  /**
   * Title for URL
   *
   * @type string
   */
  title: string;
}
