import { PanelData } from '@grafana/data';
import { Base64 } from 'js-base64';
import { useMemo } from 'react';

import { ButtonType, PanelOptions } from '../types';
import { getDataLink, getMediaValue, getValuesForMultiSeries, handleMediaData } from '../utils';

/**
 * Use media data hook
 */
export const useMediaData = ({
  options,
  data,
  currentIndex,
}: {
  options: PanelOptions;
  data: PanelData;
  currentIndex: number;
}) => {
  /**
   * Is Navigation Shown
   */
  const isNavigationShown = useMemo(
    () => options.toolbar && options.buttons?.includes(ButtonType.NAVIGATION),
    [options.buttons, options.toolbar]
  );

  /**
   * Rows Length
   */
  const rowsLength = useMemo(() => (data.series.length && data.series[0].length) || 0, [data.series]);

  /**
   * Image descriptions
   */
  const descriptions = useMemo(() => {
    if (!options.description) {
      return [];
    }

    return getValuesForMultiSeries(data.series, options.description);
  }, [data.series, options.description]);

  /**
   * Video posters
   */
  const videoPosters = useMemo(() => {
    if (!options.videoPoster) {
      return [];
    }

    return getValuesForMultiSeries(data.series, options.videoPoster);
  }, [data.series, options.videoPoster]);

  /**
   * Use first element if Navigation enabled, otherwise last
   */
  const resultIndex = useMemo(
    () => (isNavigationShown ? currentIndex : rowsLength - 1),
    [currentIndex, isNavigationShown, rowsLength]
  );

  const mediaSource = useMemo(
    () => getMediaValue(data.series, options.mediaSources, currentIndex, options.pdfToolbar),
    [currentIndex, data.series, options.mediaSources, options.pdfToolbar]
  );

  /**
   * Description for media
   */
  const description = useMemo((): string | undefined => descriptions[resultIndex], [resultIndex, descriptions]);

  /**
   * Link for image
   */
  const link = useMemo(
    () => getDataLink(data.series, mediaSource, currentIndex),
    [currentIndex, data.series, mediaSource]
  );

  /**
   * Video Poster
   */
  const videoPoster = useMemo((): string => videoPosters[resultIndex] || '', [videoPosters, resultIndex]);

  /**
   * Video poster
   */
  const currentVideoPoster = videoPoster
    ? Base64.isValid(videoPoster)
      ? handleMediaData(videoPoster).currentMedia
      : videoPoster
    : '';

  return {
    description,
    isNavigationShown,
    rowsLength,
    videoPoster: currentVideoPoster,
    link,
    mediaSource,
  };
};
