import { DataFrame, FieldType, LinkModel } from '@grafana/data';
import { findField } from '@volkovlabs/grafana-utils';
import { Base64 } from 'js-base64';

import { BASE64_MEDIA_HEADER_REGEX, IMAGE_TYPES_SYMBOLS } from './constants';
import { SupportedFileType } from './types';

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
 * @param optionName
 * @param currentIndex
 */
export const getDataLink = (frames: DataFrame[], optionName: string, currentIndex: number): LinkModel | null => {
  const field = findField(
    frames,
    (field) => field.type === FieldType.string && (!optionName || field.name === optionName)
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
export const handleMediaData = (mediaField: string | undefined) => {
  let currentMedia = mediaField;
  let type;

  if (mediaField) {
    const mediaMatch = mediaField.match(BASE64_MEDIA_HEADER_REGEX);

    if (!mediaMatch?.length) {
      /**
       * Encode to base64 if not
       */

      if (!Base64.isValid(mediaField)) {
        currentMedia = Base64.encode(mediaField);
      }

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
