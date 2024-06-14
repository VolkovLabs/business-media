import { DataFrame, FieldType } from '@grafana/data';

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
 * Get media data by field
 * @param series
 * @param fieldName
 */
export const getMediaData = (series: DataFrame[], fieldName: string) =>
  series
    .map((series) => series.fields.find((field) => field.type === FieldType.string && field.name === fieldName))
    .map((field) => field?.values)
    .filter((item) => !!item)[0] || [];

/**
 * Get size field data by field
 * @param series
 * @param fieldName
 */
export const getSizeField = (series: DataFrame[], fieldName: string) =>
  series
    .map((series) => series.fields.find((field) => field.type === FieldType.number && field.name === fieldName))
    .map((field) => field?.values[field.values.length - 1])
    .toString();
