import { CSSProperties, useMemo } from 'react';

import { ImageSizeMode, PanelOptions } from '../types';

/**
 * Use Image Element Properties
 */
export const useImageElementProperties = ({
  options,
  imageWidth,
  imageHeight,
  toolbarHeight,
  descriptionHeight,
  width,
  height,
}: {
  options: PanelOptions;
  imageWidth: number;
  imageHeight: number;
  toolbarHeight: number;
  descriptionHeight: number;
  width: number;
  height: number;
}) => {
  /**
   * Image container overflow-x property
   */
  const containerOverflowX = useMemo((): CSSProperties['overflowX'] => {
    return options.widthMode === ImageSizeMode.SCROLL ? 'auto' : 'hidden';
  }, [options.widthMode]);

  /**
   * Image container overflow-y property
   */
  const containerOverflowY = useMemo((): CSSProperties['overflowY'] => {
    return options.heightMode === ImageSizeMode.SCROLL ? 'auto' : 'hidden';
  }, [options.heightMode]);

  /**
   * Image container Width property
   */
  const containerWidth = useMemo(() => {
    return width;
  }, [width]);

  /**
   * Image container Height property
   */
  const containerHeight = useMemo(() => {
    return height - toolbarHeight - descriptionHeight;
  }, [descriptionHeight, height, toolbarHeight]);

  /**
   * Image max-width property
   */
  const imageMaxWidth = useMemo(() => {
    return options.widthMode === ImageSizeMode.SCROLL ? 'none' : 'unset';
  }, [options.widthMode]);

  /**
   * Image max-height property
   */
  const imageMaxHeight = useMemo(() => {
    return options.heightMode === ImageSizeMode.SCROLL ? 'none' : 'unset';
  }, [options.heightMode]);

  /**
   * Image width property
   */
  const imageWidthCurrent = useMemo(() => {
    const width = imageWidth ? `${imageWidth}px` : 'auto';

    return options.heightMode === ImageSizeMode.SCROLL && options.widthMode === ImageSizeMode.SCROLL
      ? 'unset'
      : options.heightMode === ImageSizeMode.SCROLL
        ? '100%'
        : width;
  }, [imageWidth, options.heightMode, options.widthMode]);

  /**
   * Image height property
   */
  const imageHeightCurrent = useMemo(() => {
    const height = imageHeight ? `${imageHeight}px` : 'auto';
    return options.heightMode === ImageSizeMode.SCROLL && options.widthMode === ImageSizeMode.SCROLL
      ? 'unset'
      : options.widthMode === ImageSizeMode.SCROLL
        ? '100%'
        : height;
  }, [imageHeight, options.heightMode, options.widthMode]);

  /**
   * Return
   */
  return {
    imageContainer: {
      overflowX: containerOverflowX,
      overflowY: containerOverflowY,
      height: containerHeight,
      width: containerWidth,
    },
    imageElement: {
      maxWidth: imageMaxWidth,
      maxHeight: imageMaxHeight,
      width: imageWidthCurrent,
      height: imageHeightCurrent,
    },
  };
};
