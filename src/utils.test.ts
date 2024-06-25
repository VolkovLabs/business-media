import { FieldType } from '@grafana/data';

import { base64toBlob, getDataLink } from './utils';

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

describe('getDataLink', () => {
  const frames = [
    {
      fields: [
        {
          type: FieldType.string,
          name: 'field1',
          getLinks: () => [{ link: 'link1' }],
        },
        {
          type: FieldType.number,
          name: 'field2',
          getLinks: () => [{ link: 'link2' }],
        },
      ],
    },
    {
      fields: [
        {
          type: FieldType.string,
          name: 'field3',
          getLinks: () => [{ link: 'link3' }],
        },
      ],
    },
  ] as any;

  it('Should return the first link when a matching string field is found', () => {
    const link = getDataLink(frames, 'field1', 0);
    expect(link).toEqual({ link: 'link1' });
  });

  it('Should return null when no matching string field is found', () => {
    const link = getDataLink(frames, 'field4', 0);
    expect(link).toBeNull();
  });

  it('Should return null when the field does not have a getLinks function', () => {
    const framesWithoutGetLinks = [
      {
        fields: [
          {
            type: FieldType.string,
            name: 'field1',
          },
        ],
      },
    ] as any;
    const link = getDataLink(framesWithoutGetLinks, 'field1', 0);
    expect(link).toBeNull();
  });

  test('Should return the first link when no optionName is provided', () => {
    const link = getDataLink(frames, '', 0);
    expect(link).toEqual({ link: 'link1' });
  });
});
