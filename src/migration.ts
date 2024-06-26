import { PanelModel } from '@grafana/data';

import { PanelOptions } from './types';

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
   * Remove Legacy option title
   */
  if (options.hasOwnProperty('title')) {
    delete options.title;
  }

  return options as PanelOptions;
};
