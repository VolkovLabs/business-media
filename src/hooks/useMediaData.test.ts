import { FieldType, LoadingState } from '@grafana/data';
import { renderHook } from '@testing-library/react';

import { ButtonType, MediaFormat } from '../types';
import { useMediaData } from './useMediaData';

/**
 * Mock Base64
 */
jest.mock('js-base64', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Base64: {
    isValid: jest.fn((value) => value !== 'not_a_valid_base64_string'),
  },
}));

/**
 * useMediaData hook
 */
describe('useMediaData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Default time range
   */
  const timeRange = {
    from: '',
    to: '',
    raw: {
      from: '',
      to: '',
    },
  } as any;

  it('Should not encode media if it is not a valid Base64 string', () => {
    const invalidBase64Value = 'not_a_valid_base64_string';
    const options = {
      mediaSources: [{ type: MediaFormat.IMAGE, id: 'i1', field: 'image' }],
    } as any;
    const data = {
      series: [
        {
          fields: [
            {
              type: FieldType.string,
              name: 'image',
              values: [invalidBase64Value],
            },
          ],
          length: 1,
        },
      ],
    } as any;
    const currentIndex = 0;

    const { result } = renderHook(() => useMediaData({ options, data, currentIndex, timeRange }));

    expect(result.current.mediaSource).toEqual({
      type: MediaFormat.IMAGE,
      field: 'image',
      url: invalidBase64Value,
    });
  });

  it('Should not encode media if it is a valid Base64 string', () => {
    const validBase64Value = 'data:application/pdf;base64,JVBERiiUlRU9GCg==';

    const options = {
      mediaSources: [{ type: MediaFormat.IMAGE, id: 'i1', field: 'image' }],
    } as any;
    const data = {
      series: [
        {
          fields: [
            {
              type: FieldType.string,
              name: 'image',
              values: [validBase64Value],
            },
          ],
          length: 1,
        },
      ],
    } as any;
    const currentIndex = 0;

    const { result } = renderHook(() => useMediaData({ options, data, currentIndex, timeRange }));

    expect(result.current.mediaSource).toEqual({ field: 'image', type: MediaFormat.IMAGE, url: validBase64Value });
    expect(result.current.description).toEqual(undefined);
  });

  it('Should return description', () => {
    const validBase64Value = 'data:application/pdf;base64,JVBERiiUlRU9GCg==';

    const options = {
      mediaSources: [{ type: MediaFormat.IMAGE, id: 'i1', field: 'image' }],
      description: 'description',
    } as any;
    const data = {
      series: [
        {
          fields: [
            {
              type: FieldType.string,
              name: 'image',
              values: [validBase64Value],
            },
            {
              type: FieldType.string,
              name: 'description',
              values: ['Description'],
            },
          ],
          length: 1,
        },
      ],
    } as any;
    const currentIndex = 0;

    const { result } = renderHook(() => useMediaData({ options, data, currentIndex, timeRange }));

    expect(result.current.mediaSource).toEqual({ field: 'image', type: MediaFormat.IMAGE, url: validBase64Value });
    expect(result.current.description).toEqual('Description');
  });

  it('Should return video poster', () => {
    const validBase64Value = 'data:application/pdf;base64,JVBERiiUlRU9GCg==';

    const options = {
      mediaSources: [{ type: MediaFormat.IMAGE, id: 'i1', field: 'image' }],
      videoPoster: 'poster',
    } as any;
    const data = {
      series: [
        {
          fields: [
            {
              type: FieldType.string,
              name: 'image',
              values: [validBase64Value],
            },
            {
              type: FieldType.string,
              name: 'poster',
              values: [validBase64Value],
            },
          ],
          length: 1,
        },
      ],
    } as any;
    const currentIndex = 0;

    const { result } = renderHook(() => useMediaData({ options, data, currentIndex, timeRange }));

    expect(result.current.mediaSource).toEqual({ field: 'image', type: MediaFormat.IMAGE, url: validBase64Value });
    expect(result.current.videoPoster).toEqual(validBase64Value);
  });

  it('Should return not Base64 video poster', () => {
    const validBase64Value = 'data:application/pdf;base64,JVBERiiUlRU9GCg==';
    const invalidBase64Value = 'not_a_valid_base64_string';

    const options = {
      mediaSources: [{ type: MediaFormat.IMAGE, id: 'i1', field: 'image' }],
      videoPoster: 'poster',
    } as any;
    const data = {
      series: [
        {
          fields: [
            {
              type: FieldType.string,
              name: 'image',
              values: [validBase64Value],
            },
            {
              type: FieldType.string,
              name: 'poster',
              values: [invalidBase64Value],
            },
          ],
          length: 1,
        },
      ],
    } as any;
    const currentIndex = 0;

    const { result } = renderHook(() => useMediaData({ options, data, currentIndex, timeRange }));

    expect(result.current.mediaSource).toEqual({ field: 'image', type: MediaFormat.IMAGE, url: validBase64Value });
    expect(result.current.videoPoster).toEqual(invalidBase64Value);
  });

  it('Should be properly defined navigation', () => {
    const validBase64Value = 'data:application/pdf;base64,JVBERiiUlRU9GCg==';

    const options = {
      mediaSources: [{ type: MediaFormat.IMAGE, id: 'i1', field: 'image' }],
      buttons: [ButtonType.NAVIGATION],
      toolbar: true,
    } as any;
    const data = {
      series: [
        {
          fields: [
            {
              type: FieldType.string,
              name: 'image',
              values: [validBase64Value],
            },
          ],
          length: 1,
        },
      ],
    } as any;
    const currentIndex = 0;

    const { result } = renderHook(() => useMediaData({ options, data, currentIndex, timeRange }));

    expect(result.current.mediaSource).toEqual({ field: 'image', type: MediaFormat.IMAGE, url: validBase64Value });
    expect(result.current.isNavigationShown).toEqual(true);
  });

  it('Should not set up data if state is loading', () => {
    const validBase64Value = 'data:application/pdf;base64,JVBERiiUlRU9GCg==';

    const options = {
      mediaSources: [{ type: MediaFormat.IMAGE, id: 'i1', field: 'image' }],
      description: 'description',
    } as any;
    const data = {
      state: LoadingState.Loading,
      timeRange: {},
      series: [
        {
          fields: [
            {
              type: FieldType.string,
              name: 'image',
              values: [validBase64Value],
            },
            {
              type: FieldType.string,
              name: 'description',
              values: ['Description'],
            },
          ],
          length: 1,
        },
      ],
    } as any;
    const currentIndex = 0;

    const { result } = renderHook(() => useMediaData({ options, data, currentIndex, timeRange }));

    expect(result.current.description).toBeUndefined();
  });

  it('Should set up data if state is done', () => {
    const validBase64Value = 'data:application/pdf;base64,JVBERiiUlRU9GCg==';

    const options = {
      mediaSources: [{ type: MediaFormat.IMAGE, id: 'i1', field: 'image' }],
      description: 'description',
    } as any;
    const data = {
      state: LoadingState.Done,
      timeRange: {},
      series: [
        {
          fields: [
            {
              type: FieldType.string,
              name: 'image',
              values: [validBase64Value],
            },
            {
              type: FieldType.string,
              name: 'description',
              values: ['Description'],
            },
          ],
          length: 1,
        },
      ],
    } as any;
    const currentIndex = 0;

    const { result } = renderHook(() => useMediaData({ options, data, currentIndex, timeRange }));

    expect(result.current.description).toBeDefined();
    expect(result.current.mediaSource).toEqual({ field: 'image', type: MediaFormat.IMAGE, url: validBase64Value });
    expect(result.current.description).toEqual('Description');
  });
});
