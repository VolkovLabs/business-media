import { FieldType } from '@grafana/data';
import { MediaFormat } from 'types';

import { base64toBlob, getDataLink, getMediaValue, reorder } from './utils';

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

  const mediaSource = {
    field: 'field1',
    type: MediaFormat.IMAGE,
  };

  it('Should return the first link when a matching string field is found', () => {
    const link = getDataLink(frames, mediaSource, 0);
    expect(link).toEqual({ link: 'link1' });
  });

  it('Should return null when no matching string field is found', () => {
    const mediaSourceWithNonExistentField = {
      field: 'field4',
      type: MediaFormat.VIDEO,
    };
    const link = getDataLink(frames, mediaSourceWithNonExistentField, 0);
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
    const link = getDataLink(framesWithoutGetLinks, mediaSource, 0);
    expect(link).toBeNull();
  });

  test('Should return the first link when no optionName is provided', () => {
    const mediaSourceWithoutField = {
      field: undefined,
      type: MediaFormat.VIDEO,
    };
    const link = getDataLink(frames, mediaSourceWithoutField, 0);
    expect(link).toEqual({ link: 'link1' });
  });
});

describe('getMediaValue', () => {
  const series = [
    {
      fields: [
        {
          name: 'media1',
          values: [
            'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMABxQQEhhXLuxAogTgkXAgBZ/QcKZW5kc3RyZWFtCmVuZG9iago...',
          ],
        },
        {
          name: 'media2',
          values: ['https://example.com/image.jpg'],
        },
      ],
    },
  ] as any;

  it('Should return media value for a valid PDF media item', () => {
    const mediaSources = [
      {
        field: 'media1',
        type: MediaFormat.PDF,
      },
      {
        field: 'media2',
        type: MediaFormat.IMAGE,
      },
    ] as any;

    const result = getMediaValue(series, mediaSources, 0, false);
    expect(result).toEqual({
      field: 'media1',
      type: MediaFormat.PDF,
      url: expect.stringContaining(
        'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMABxQQEhhXLuxAogTgkXAgBZ/QcKZW5kc3RyZWFtCmVuZG9iago...#toolbar=0'
      ),
    });
  });

  it('Should return media value for a valid image media item', () => {
    const mediaSources = [
      {
        field: 'media2',
        type: MediaFormat.IMAGE,
      },
      {
        field: 'media1',
        type: MediaFormat.PDF,
      },
    ] as any;
    const result = getMediaValue(series, mediaSources, 0, false);
    expect(result).toEqual({
      field: 'media2',
      type: MediaFormat.IMAGE,
      url: 'https://example.com/image.jpg',
    });
  });

  it('Should return null for rows without values', () => {
    const result = getMediaValue([], [], 0, false);
    expect(result).toEqual({
      type: null,
    });
  });

  it('Should remove PDF toolbar when isEnablePdfToolbar is false', () => {
    const mediaSources = [
      {
        field: 'media1',
        type: MediaFormat.PDF,
      },
      {
        field: 'media2',
        type: MediaFormat.IMAGE,
      },
    ] as any;
    const result = getMediaValue(series, mediaSources, 0, false);
    expect(result.url).toContain('#toolbar=0');
  });

  it('Should not remove PDF toolbar when isEnablePdfToolbar is true', () => {
    const mediaSources = [
      {
        field: 'media1',
        type: MediaFormat.PDF,
      },
      {
        field: 'media2',
        type: MediaFormat.IMAGE,
      },
    ] as any;
    const result = getMediaValue(series, mediaSources, 0, true);
    expect(result.url).not.toContain('#toolbar=0');
  });

  it('Should return media value for a valid image media item without refId', () => {
    const mediaSources = [
      {
        field: 'media2',
        type: MediaFormat.IMAGE,
        refId: '',
      },
      {
        field: 'media1',
        type: MediaFormat.PDF,
        refId: '',
      },
    ] as any;
    const result = getMediaValue(series, mediaSources, 0, false);
    expect(result).toEqual({
      field: 'media2',
      type: MediaFormat.IMAGE,
      url: 'https://example.com/image.jpg',
    });
  });

  it('Should return media value for a correct frame with refId', () => {
    const series = [
      {
        fields: [
          {
            name: 'media1',
            values: [
              'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMABxQQEhhXLuxAogTgkXAgBZ/QcKZW5kc3RyZWFtCmVuZG9iago...',
            ],
          },
          {
            name: 'media2',
            values: ['https://example.com/imageA.jpg'],
          },
        ],
        refId: 'A',
      },
      {
        fields: [
          {
            name: 'media1',
            values: [
              'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMABxQQEhhXLuxAogTgkXAgBZ/QcKZW5kc3RyZWFtCmVuZG9iago...',
            ],
          },
          {
            name: 'media2',
            values: ['https://example.com/imageB.jpg'],
          },
        ],
        refId: 'B',
      },
    ] as any;

    const mediaSources = [
      {
        field: 'media2',
        type: MediaFormat.IMAGE,
        refId: 'B',
      },
      {
        field: 'media1',
        type: MediaFormat.PDF,
        refId: 'A',
      },
    ] as any;
    const result = getMediaValue(series, mediaSources, 0, false);
    expect(result).toEqual({
      field: 'media2',
      type: MediaFormat.IMAGE,
      url: 'https://example.com/imageB.jpg',
    });
  });

  it('Should nont return media value with incorrect refId`s and media refId`s', () => {
    const series = [
      {
        fields: [
          {
            name: 'media1',
            values: [
              'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMABxQQEhhXLuxAogTgkXAgBZ/QcKZW5kc3RyZWFtCmVuZG9iago...',
            ],
          },
          {
            name: 'media2',
            values: ['https://example.com/imageA.jpg'],
          },
        ],
        refId: 'A',
      },
      {
        fields: [
          {
            name: 'media1',
            values: [
              'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMABxQQEhhXLuxAogTgkXAgBZ/QcKZW5kc3RyZWFtCmVuZG9iago...',
            ],
          },
          {
            name: 'media2',
            values: ['https://example.com/imageB.jpg'],
          },
        ],
        refId: 'B',
      },
    ] as any;

    const mediaSources = [
      {
        field: 'media2',
        type: MediaFormat.IMAGE,
        refId: 'c',
      },
      {
        field: 'media1',
        type: MediaFormat.PDF,
        refId: 'D',
      },
    ] as any;
    const result = getMediaValue(series, mediaSources, 0, false);
    expect(result).toEqual({
      type: null,
    });
  });
});

describe('Reorder', () => {
  it('Should move element up', () => {
    expect(reorder([1, 2, 3], 0, 1)).toEqual([2, 1, 3]);
  });

  it('Should move element down', () => {
    expect(reorder([1, 2, 3], 2, 1)).toEqual([1, 3, 2]);
  });

  it('Should not mutate original array', () => {
    const array = [1, 2, 3];
    const result = reorder(array, 2, 1);

    expect(array !== result).toBeTruthy();
  });
});
