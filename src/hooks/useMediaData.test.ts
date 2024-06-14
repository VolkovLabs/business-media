import { FieldType } from '@grafana/data';
import { renderHook } from '@testing-library/react';
import { Base64 } from 'js-base64';

import { SupportFormats } from '../types';
import { useMediaData } from './useMediaData';

/**
 * Mock Base64
 */
jest.mock('js-base64', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Base64: {
    isValid: jest.fn((value) => value !== 'not_a_valid_base64_string'),
    encode: jest.fn().mockImplementation((value) => `encoded_${value}`),
  },
}));

/**
 * useMediaData hook
 */
describe('useMediaData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should encode media if it is not a valid Base64 string', () => {
    const invalidBase64Value = 'not_a_valid_base64_string';

    const options = {
      formats: [SupportFormats.IMAGE],
      imageUrl: 'imageUrl',
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
        },
      ],
    } as any;
    const currentIndex = 0;

    const { result } = renderHook(() => useMediaData({ options, data, currentIndex }));
    expect(Base64.isValid).toHaveBeenCalledWith(invalidBase64Value);
    expect(Base64.encode).toHaveBeenCalledWith(invalidBase64Value);
    expect(Base64.isValid).toHaveReturnedWith(false);

    expect(result.current.media).toEqual('data:;base64,encoded_not_a_valid_base64_string');
  });

  it('Should not encode media if it is a valid Base64 string', () => {
    const validBase64Value = 'data:application/pdf;base64,JVBERiiUlRU9GCg==';

    const options = {
      formats: [SupportFormats.IMAGE],
      imageUrl: 'imageUrl',
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
        },
      ],
    } as any;
    const currentIndex = 0;

    const { result } = renderHook(() => useMediaData({ options, data, currentIndex }));
    expect(Base64.encode).not.toHaveBeenCalled();

    expect(result.current.media).toEqual(validBase64Value);
  });
});
