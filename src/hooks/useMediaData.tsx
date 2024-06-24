import { FieldType, PanelData } from '@grafana/data';
import { findField, getFieldValues } from '@volkovlabs/grafana-utils';
import { Base64 } from 'js-base64';
import { useCallback, useMemo } from 'react';

import { ButtonType, MediaFormat, PanelOptions } from '../types';
import { handleMediaData } from '../utils';

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
   * Has format support
   */
  const hasFormatSupport = useCallback(
    (format: MediaFormat): boolean => {
      return options.formats.includes(format);
    },
    [options.formats]
  );

  /**
   * Is Navigation Shown
   */
  const isNavigationShown = useMemo(
    () => options.toolbar && options.buttons?.includes(ButtonType.NAVIGATION),
    [options.buttons, options.toolbar]
  );

  /**
   * Image values
   */
  const values = useMemo((): string[] => {
    return (
      findField<string>(
        data.series,
        (field) => field.type === FieldType.string && (!options.name || field.name === options.name)
      )?.values || []
    );
  }, [data.series, options.name]);

  /**
   * Video urls
   */
  const videoUrls = useMemo(
    () => getFieldValues<string>(data.series, options.videoUrl, FieldType.string),
    [data.series, options.videoUrl]
  );

  /**
   * Image urls
   */
  const imageUrls = useMemo(
    () => getFieldValues<string>(data.series, options.imageUrl, FieldType.string),
    [data.series, options.imageUrl]
  );

  /**
   * Image descriptions
   */
  const descriptions = useMemo(() => {
    if (!options.description) {
      return [];
    }

    return getFieldValues<string>(data.series, options.description, FieldType.string);
  }, [data.series, options.description]);

  /**
   * Video posters
   */
  const videoPosters = useMemo(() => {
    if (!options.videoPoster) {
      return [];
    }

    return getFieldValues<string>(data.series, options.videoPoster, FieldType.string);
  }, [data.series, options.videoPoster]);

  /**
   * Use first element if Navigation enabled, otherwise last
   */
  const resultIndex = useMemo(
    () => (isNavigationShown ? currentIndex : values.length - 1),
    [currentIndex, isNavigationShown, values.length]
  );

  /**
   * First priority
   * Url for video
   */
  const videoUrl = useMemo((): string | undefined => videoUrls[resultIndex], [resultIndex, videoUrls]);

  /**
   * Second priority
   * Url for image
   */
  const imageUrl = useMemo((): string | undefined => imageUrls[resultIndex], [resultIndex, imageUrls]);

  /**
   * Third priority
   * Media (base64)
   */
  const media = useMemo((): string | undefined => values[resultIndex], [resultIndex, values]);

  /**
   * Description for media
   */
  const description = useMemo((): string | undefined => descriptions[resultIndex], [resultIndex, descriptions]);

  /**
   * Video Poster
   */
  const videoPoster = useMemo((): string => videoPosters[resultIndex] || '', [videoPosters, resultIndex]);

  /**
   * Type and media
   */
  const { currentMedia, type } = handleMediaData(media);

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
    imageUrl,
    hasFormatSupport,
    media: currentMedia,
    isNavigationShown,
    type,
    values,
    videoUrl,
    videoPoster: currentVideoPoster,
  };
};
