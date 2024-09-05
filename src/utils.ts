import { DataFrame, Field, FieldMatcherID, fieldMatchers, FieldType, LinkModel, SelectableValue } from '@grafana/data';
import { findField } from '@volkovlabs/grafana-utils';
import { Base64 } from 'js-base64';

import { BASE64_MEDIA_HEADER_REGEX, IMAGE_TYPES_SYMBOLS } from './constants';
import { MediaFormat, MediaSourceConfig, MediaSourceElement, SupportedFileType } from './types';

/**
 * Convert Base64 to Blob
 * @param data
 * @param contentType
 * @param sliceSize
 */
export const base64toBlob = (data: string, contentType: string, sliceSize = 512) => {
  data = data.replace(/^[^,]+,/, '').replace(/\s/g, '');

  const byteCharacters = Buffer.from(data, 'base64').toString('binary');
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * Get Data link for current value
 * @param frames
 * @param mediaSource
 * @param currentIndex
 */
export const getDataLink = (
  frames: DataFrame[],
  mediaSource: MediaSourceElement,
  currentIndex: number
): LinkModel | null => {
  const field = findField(
    frames,
    (field) => field.type === FieldType.string && (!mediaSource.field || field.name === mediaSource.field)
  );

  if (field && field?.getLinks) {
    return field?.getLinks({ valueRowIndex: currentIndex })[0];
  }

  return null;
};

/**
 * Handle media data
 * @param mediaField
 */
export const handleMediaData = (mediaField: string) => {
  let currentMedia = mediaField;
  let type;

  if (mediaField) {
    const mediaMatch = mediaField.match(BASE64_MEDIA_HEADER_REGEX);

    if (!mediaMatch?.length) {
      /**
       * Set header
       */
      type = IMAGE_TYPES_SYMBOLS[mediaField.charAt(0)];

      currentMedia = type ? `data:${type};base64,${currentMedia}` : `data:;base64,${currentMedia}`;
    } else if (Object.values(SupportedFileType).includes(mediaMatch[1] as SupportedFileType)) {
      type = mediaMatch[1];
    }
  }

  return {
    currentMedia,
    type,
  };
};

/**
 * Reorder
 * @param list
 * @param startIndex
 * @param endIndex
 */
export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);

  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Get media value
 * @param series
 * @param mediaSources
 * @param currentIndex
 * @param isEnablePdfToolbar
 */
export const getMediaValue = (
  series: DataFrame[],
  mediaSources: MediaSourceConfig[],
  currentIndex: number,
  isEnablePdfToolbar: boolean
) => {
  if (series && series.length) {
    for (const item of mediaSources) {
      const mediaItem = findField<string>(series, (field, frame) => {
        if (item.refId) {
          if (frame?.refId === item.refId) {
            return field.name === item.field;
          }
          return false;
        } else {
          return field.name === item.field;
        }
      });

      if (mediaItem && mediaItem?.values[currentIndex]) {
        let currentUrl: string;

        if (Base64.isValid(mediaItem.values[currentIndex])) {
          /**
           * Base64 format handle
           */
          currentUrl = handleMediaData(mediaItem?.values[currentIndex] as string).currentMedia;

          /**
           * Handle case for PDF
           */
          if (item.type === MediaFormat.PDF) {
            const blob = base64toBlob(currentUrl, SupportedFileType.PDF);
            currentUrl = URL.createObjectURL(blob);
          }
        } else {
          /**
           * Use value from url
           */
          currentUrl = mediaItem.values[currentIndex] as string;
        }

        /**
         * Remove toolbar for PDF default reader
         */
        if (item.type === MediaFormat.PDF && !isEnablePdfToolbar) {
          currentUrl += '#toolbar=0';
        }

        return {
          type: item.type,
          url: currentUrl,
          field: item.field,
        };
      }
    }
  }

  /**
   * Return null for rows without values
   */
  return {
    type: null,
  };
};

/**
 * Get Fields for multiple Queries
 * @param data
 * @param filterTypes
 */
export const multipleQueriesFields = (data: DataFrame[], filterTypes?: FieldType[]) => {
  return data.reduce((acc: SelectableValue[], dataFrame) => {
    return acc.concat(
      dataFrame.fields
        .filter((field) => (filterTypes ? filterTypes.includes(field.type) : true))
        .map((field) => ({
          value: `${dataFrame.refId ? `${dataFrame.refId}:` : ''}${field.name}`,
          label: `${dataFrame.refId ? `${dataFrame.refId}:` : ''}${field.name}`,
          refId: dataFrame.refId || '',
          field: field.name,
        }))
    );
  }, []);
};

/**
 * Get Field values for multiple Queries
 * @param series
 * @param fieldName
 */
export const getValuesForMultiSeries = (series: DataFrame[], fieldName: string) => {
  const fieldMatcher = fieldMatchers.get(FieldMatcherID.byName);
  const matcher = fieldMatcher.get(fieldName);

  const field = findField<string>(series, (field, frame) => {
    return matcher(field as Field, frame as DataFrame, series);
  });

  return field && field.values ? field.values : [];
};
