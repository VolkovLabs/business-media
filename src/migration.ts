import { PanelModel } from '@grafana/data';
import semver from 'semver';

import { MediaFormat, PanelOptions } from './types';

/**
 * Outdated Panel Options
 */
interface OutdatedPanelOptions extends PanelOptions {
  /**
   * URL
   *
   * Removed in 5.2.0
   */
  url?: string;

  /**
   * Title
   *
   * Removed in 5.2.0
   */
  title?: string;

  /**
   * Title
   *
   * Removed in 5.2.0
   */
  name?: string;

  /**
   * Title
   *
   * Removed in 5.2.0
   */
  formats?: MediaFormat[];

  /**
   * Title
   *
   * Removed in 5.2.0
   */
  videoUrl?: string;

  /**
   * Title
   *
   * Removed in 5.2.0
   */
  imageUrl?: string;
}

/**
 * Get Migrated Options
 * @param panel
 */
export const getMigratedOptions = (panel: PanelModel<OutdatedPanelOptions>): PanelOptions => {
  const { ...options } = panel.options;

  /**
   * Remove Legacy option url
   */
  if (options.hasOwnProperty('url')) {
    delete options.url;
  }

  /**
   * Remove Legacy option formats
   */
  if (options.hasOwnProperty('formats')) {
    delete options.formats;
  }

  /**
   * Remove Legacy option title
   */
  if (options.hasOwnProperty('title')) {
    delete options.title;
  }

  /**
   * Add mediaSources
   */
  if (panel.pluginVersion && semver.lt(panel.pluginVersion, '5.2.0')) {
    const mediaSources = [];

    /**
     * Migrate videoUrl
     */
    if (options.hasOwnProperty('videoUrl')) {
      const videoSource = { type: MediaFormat.VIDEO, id: 'video-1-5-2-0-ver', field: options.videoUrl };
      mediaSources.push(videoSource);
      delete options.videoUrl;
    }

    /**
     * Migrate imageUrl
     */
    if (options.hasOwnProperty('imageUrl')) {
      const imageSource = { type: MediaFormat.IMAGE, id: 'image-1-5-2-0-ver', field: options.imageUrl };
      mediaSources.push(imageSource);
      delete options.imageUrl;
    }

    /**
     * Migrate name
     */
    if (options.hasOwnProperty('name')) {
      const imageSource = { type: MediaFormat.IMAGE, id: 'image-2-5-2-0-ver', field: options.name };
      mediaSources.push(imageSource);
      delete options.name;
    }

    options.mediaSources = mediaSources;
  }

  return options as PanelOptions;
};
