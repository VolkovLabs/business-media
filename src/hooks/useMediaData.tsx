import { LoadingState, PanelData, TimeRange } from '@grafana/data';
import { Base64 } from 'js-base64';
import { useEffect, useMemo, useState } from 'react';

import { ButtonType, PanelOptions } from '../types';
import { getDataLink, getMediaValue, getValuesForMultiSeries, handleMediaData } from '../utils';

/**
 * Use media data hook
 */
export const useMediaData = ({
  options,
  data,
  currentIndex,
  timeRange,
}: {
  options: PanelOptions;
  data: PanelData;
  currentIndex: number;
  timeRange: TimeRange;
}) => {
  /**
   * Initial data
   */
  const [currentData, setCurrentData] = useState<PanelData>({
    state: LoadingState.Loading,
    series: [],
    timeRange: timeRange,
  });

  /**
   * Handle data
   */
  useEffect(() => {
    /**
     * Wait until Data Source return results
     */
    if (data.state && ![LoadingState.Done, LoadingState.Streaming].includes(data.state)) {
      return;
    }

    setCurrentData(data);
  }, [data]);

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
  const rowsLength = useMemo(
    () => (currentData.series.length && currentData.series[0].length) || 0,
    [currentData.series]
  );

  /**
   * Image descriptions
   */
  const descriptions = useMemo(() => {
    if (!options.description) {
      return [];
    }

    return getValuesForMultiSeries(currentData.series, options.description);
  }, [currentData.series, options.description]);

  /**
   * Video posters
   */
  const videoPosters = useMemo(() => {
    if (!options.videoPoster) {
      return [];
    }

    return getValuesForMultiSeries(currentData.series, options.videoPoster);
  }, [currentData.series, options.videoPoster]);

  /**
   * Use first element if Navigation enabled, otherwise last
   */
  const resultIndex = useMemo(
    () => (isNavigationShown ? currentIndex : rowsLength - 1),
    [currentIndex, isNavigationShown, rowsLength]
  );

  const mediaSource = useMemo(
    () => getMediaValue(currentData.series, options.mediaSources, resultIndex, options.pdfToolbar),
    [currentData.series, options.mediaSources, options.pdfToolbar, resultIndex]
  );

  /**
   * Description for media
   */
  const description = useMemo((): string | undefined => descriptions[resultIndex], [resultIndex, descriptions]);

  /**
   * Link for image
   */
  const link = useMemo(
    () => getDataLink(currentData.series, mediaSource, currentIndex),
    [currentData.series, currentIndex, mediaSource]
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
