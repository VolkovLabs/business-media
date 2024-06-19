import { FieldType } from '@grafana/data';

import { base64toBlob, getFieldValues } from './utils';

/**
 * base64toBlob
 */
describe('base64toBlob', () => {
  it('Should convert base64 to blob', () => {
    const base64Data =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const contentType = 'image/png';

    const blob = base64toBlob(base64Data, contentType);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toEqual(contentType);
  });
});

/**
 * getMediaData
 */
describe('getFieldValues', () => {
  it('Should return field values', () => {
    const dataFrames = [
      {
        fields: [
          { name: 'name', type: FieldType.string, values: ['file1.png', 'file1.png', ''] },
          {
            name: 'media',
            type: FieldType.string,
            values: [
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
              '',
            ],
          },
        ],
      },
    ] as any;

    const mediaData = getFieldValues(dataFrames, 'media');
    expect(mediaData).toHaveLength(3);
    expect(mediaData[0]).toEqual(dataFrames[0].fields[1].values[0]);
    expect(mediaData[1]).toEqual(dataFrames[0].fields[1].values[1]);
  });

  it('Should take field with right type', () => {
    const dataFrames = [
      {
        fields: [
          { name: 'name', type: FieldType.string, values: ['file1.png', 'file1.png', ''] },
          {
            name: 'media',
            type: FieldType.number,
            values: [1, 2, 0],
          },
        ],
      },
    ] as any;

    const mediaData = getFieldValues(dataFrames, 'media', FieldType.string);

    expect(mediaData).toHaveLength(0);
    expect(mediaData).toEqual([]);
  });
});
