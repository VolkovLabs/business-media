import { FieldType, PanelData } from '@grafana/data';
import { findField, getFieldValues } from '@volkovlabs/grafana-utils';
import { Base64 } from 'js-base64';
import { useCallback, useMemo } from 'react';

import { BASE64_MEDIA_HEADER_REGEX, IMAGE_TYPES_SYMBOLS } from '../constants';
import { ButtonType, MediaFormat, PanelOptions, SupportedFileType } from '../types';
import { getDataLink } from '../utils';

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
  let media = useMemo((): string | undefined => values[resultIndex], [resultIndex, values]);

  /**
   * Description for media
   */
  const description = useMemo((): string | undefined => descriptions[resultIndex], [resultIndex, descriptions]);

  /**
   * Image values
   */

  const link = useMemo(
    () => getDataLink(data.series, options.name, currentIndex),
    [currentIndex, data.series, options.name]
  );

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
    link,
  };
};
