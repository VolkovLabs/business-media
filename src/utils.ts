import { DataFrame, Field, FieldType } from '@grafana/data';

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
 * Find field
 */
export const findField = <TValue = unknown>(
  series: DataFrame[],
  predicateFn: (field: Field) => boolean
): Field<TValue> | void => {
  for (let i = 0; i < series.length; i += 1) {
    const frame = series[i];

    const field = frame.fields.find((field) => predicateFn(field));

    /**
     * Field found
     */
    if (field) {
      return field;
    }
  }
};

/**
 * Get field values
 * @param series
 * @param fieldName
 * @param fieldType
 */
export const getFieldValues = <TValue>(series: DataFrame[], fieldName: string, fieldType?: FieldType): TValue[] => {
  const field = findField<TValue>(series, (field) => {
    const isTypeEqual = fieldType ? field.type === fieldType : true;

    return isTypeEqual && field.name === fieldName;
  });

  if (!field) {
    return [];
  }

  return field.values;
};

/**
 * Get last field value
 * @param series
 * @param fieldName
 * @param fieldType
 */
export const getLastFieldValue = <TValue>(series: DataFrame[], fieldName: string, fieldType?: FieldType): TValue => {
  const values = getFieldValues<TValue>(series, fieldName, fieldType);

  return values[values.length - 1];
};
