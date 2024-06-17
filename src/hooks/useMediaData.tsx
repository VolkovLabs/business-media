import { FieldType, PanelData } from '@grafana/data';
import { Base64 } from 'js-base64';
import { useCallback, useMemo } from 'react';
import { getMediaData } from 'utils';

import { BASE64_MEDIA_HEADER_REGEX, IMAGE_TYPES_SYMBOLS } from '../constants';
import { ButtonType, MediaFormat,PanelOptions, SupportedFileType } from '../types';

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
  const values = useMemo(() => {
    return (
      data.series
        .map((series) =>
          series.fields.find(
            (field) => field.type === FieldType.string && (!options.name || field.name === options.name)
          )
        )
        .map((field) => field?.values)
        .filter((item) => !!item)[0] || []
    );
  }, [data.series, options.name]);

  /**
   * Video urls
   */
  const videoUrls = useMemo(() => getMediaData(data.series, options.videoUrl), [data.series, options.videoUrl]);

  /**
   * Image urls
   */
  const imageUrls = useMemo(() => getMediaData(data.series, options.imageUrl), [data.series, options.imageUrl]);

  /**
   * Image descriptions
   */
  const descriptions = useMemo(() => {
    if (!options.description) {
      return [];
    }

    return getMediaData(data.series, options.description);
  }, [data.series, options.description]);

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
  const videoUrl = useMemo(() => videoUrls[resultIndex], [resultIndex, videoUrls]);

  /**
   * Second priority
   * Url for image
   */
  const imageUrl = useMemo(() => imageUrls[resultIndex], [resultIndex, imageUrls]);

  /**
   * Third priority
   * Media (base64)
   */
  let media = useMemo(() => values[resultIndex], [resultIndex, values]);

  /**
   * Description for media
   */
  const description = useMemo(() => descriptions[resultIndex], [resultIndex, descriptions]);

  /**
   * Type
   */
  let type;

  /**
   * Check if returned value already has header
   */
  if (media) {
    const mediaMatch = media.match(BASE64_MEDIA_HEADER_REGEX);
    if (!mediaMatch?.length) {
      /**
       * Encode to base64 if not
       */

      if (!Base64.isValid(media)) {
        media = Base64.encode(media);
      }

      /**
       * Set header
       */
      type = IMAGE_TYPES_SYMBOLS[media.charAt(0)];
      media = type ? `data:${type};base64,${media}` : `data:;base64,${media}`;
    } else if (Object.values(SupportedFileType).includes(mediaMatch[1] as SupportedFileType)) {
      type = mediaMatch[1];
    }
  }

  return {
    description,
    imageUrl,
    hasFormatSupport,
    media,
    isNavigationShown,
    type,
    values,
    videoUrl,
  };
};
