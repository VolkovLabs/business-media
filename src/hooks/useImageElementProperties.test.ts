import { renderHook } from '@testing-library/react';

import { ImageSizeMode } from '../types';
import { useImageElementProperties } from './useImageElementProperties';

/**
 * useImageElementProperties
 */
describe('useImageElementProperties', () => {
  /**
   * Default Options
   */
  const defaultOptions = {
    widthMode: ImageSizeMode.ORIGINAL,
    heightMode: ImageSizeMode.ORIGINAL,
  };

  it('Should return correct properties for original options', () => {
    const { result } = renderHook(() =>
      useImageElementProperties({
        options: defaultOptions,
        imageWidth: 100,
        imageHeight: 100,
        toolbarHeight: 40,
        descriptionHeight: 20,
        width: 200,
        height: 300,
      } as any)
    );

    expect(result.current.imageContainer).toEqual({
      overflowX: 'hidden',
      overflowY: 'hidden',
      /**
       * height - toolbarHeight - descriptionHeight
       * 300 - 40 - 20
       */
      height: 240,
      width: 200,
    });

    expect(result.current.imageElement).toEqual({
      maxWidth: 'unset',
      maxHeight: 'unset',
      width: '100px',
      height: '100px',
    });
  });

  it('Should set overflowX to auto when widthMode is SCROLL', () => {
    const { result } = renderHook(() =>
      useImageElementProperties({
        options: {
          ...defaultOptions,
          widthMode: ImageSizeMode.SCROLL,
        },
        imageWidth: 100,
        imageHeight: 100,
        toolbarHeight: 40,
        descriptionHeight: 20,
        width: 200,
        height: 300,
      } as any)
    );

    expect(result.current.imageContainer.overflowX).toBe('auto');
  });

  it('Should set image width to 100% when heightMode is SCROLL', () => {
    const { result } = renderHook(() =>
      useImageElementProperties({
        options: {
          ...defaultOptions,
          heightMode: ImageSizeMode.SCROLL,
        },
        imageWidth: 100,
        imageHeight: 100,
        toolbarHeight: 40,
        descriptionHeight: 20,
        width: 200,
        height: 300,
      } as any)
    );

    expect(result.current.imageElement.width).toBe('100%');
  });

  it('Should set image height to 100% when widthMode is SCROLL', () => {
    const { result } = renderHook(() =>
      useImageElementProperties({
        options: {
          ...defaultOptions,
          widthMode: ImageSizeMode.SCROLL,
        },
        imageWidth: 100,
        imageHeight: 100,
        toolbarHeight: 40,
        descriptionHeight: 20,
        width: 200,
        height: 300,
      } as any)
    );

    expect(result.current.imageElement.height).toBe('100%');
  });

  it('Should return unset for width and height when both modes are SCROLL', () => {
    const { result } = renderHook(() =>
      useImageElementProperties({
        options: {
          widthMode: ImageSizeMode.SCROLL,
          heightMode: ImageSizeMode.SCROLL,
        },
        imageWidth: 100,
        imageHeight: 100,
        toolbarHeight: 40,
        descriptionHeight: 20,
        width: 200,
        height: 300,
      } as any)
    );

    expect(result.current.imageElement.width).toBe('unset');
    expect(result.current.imageElement.height).toBe('unset');
  });
});
