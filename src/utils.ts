import { DataFrame, FieldType, LinkModel } from '@grafana/data';
import { findField } from '@volkovlabs/grafana-utils';

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
