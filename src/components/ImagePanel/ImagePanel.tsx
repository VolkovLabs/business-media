import { Base64 } from 'js-base64';
import React from 'react';
import { css, cx } from '@emotion/css';
import { FieldType, PanelProps } from '@grafana/data';
import { Alert } from '@grafana/ui';
import { ImageSizeModes, ImageTypesSymbols, SupportedTypes } from '../../constants';
import { getStyles } from '../../styles';
import { base64toBlob } from '../../utils';

/**
 * Properties
 */
interface Props extends PanelProps {}

/**
 * Image Panel
 */
export const ImagePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = getStyles();

  /**
   * Name field (string)
   */
  let img = data.series
    .map((series) =>
      series.fields.find((field) => field.type === FieldType.string && (!options.name || field.name === options.name))
    )
    .map((field) => field?.values.get(field.values.length - 1))
    .toString();

  /**
   * Keep auto-scale if Auto
   */
  let imageHeight = options.heightMode === ImageSizeModes.AUTO ? height : 0;
  let imageWidth = options.widthMode === ImageSizeModes.AUTO ? width : 0;

  /**
   * Height
   */
  if (options.heightMode === ImageSizeModes.CUSTOM) {
    /**
     * Field
     */
    if (options.heightName) {
      const heightField = data.series
        .map((series) =>
          series.fields.find((field) => field.type === FieldType.number && field.name === options.heightName)
        )
        .map((field) => field?.values.get(field.values.length - 1))
        .toString();
      imageHeight = Number(heightField) ? Number(heightField) : imageHeight;
    }

    imageHeight = options.height ? options.height : imageHeight;
  }

  /**
   * Width
   */
  if (options.widthMode === ImageSizeModes.CUSTOM) {
    /**
     * Field
     */
    if (options.widthName) {
      const widthField = data.series
        .map((series) =>
          series.fields.find((field) => field.type === FieldType.number && field.name === options.widthName)
        )
        .map((field) => field?.values.get(field.values.length - 1))
        .toString();
      imageWidth = Number(widthField) ? Number(widthField) : imageWidth;
    }

    imageWidth = options.width ? options.width : imageWidth;
  }

  /**
   * No results
   */
  if (!img) {
    return (
      <div
        className={cx(
          styles.wrapper,
          css`
            width: ${width}px;
            height: ${height}px;
          `
        )}
      >
        <Alert severity="warning" title="">
          Nothing to display...
        </Alert>
      </div>
    );
  }

  let type;

  /**
   * Check if returned value already has header
   */
  const m = img.match(/^data:(video\/\w+|audio\/\w+|image|application\/\w+)/);
  if (!m?.length) {
    /**
     * Encode to base64 if not
     */
    if (!Base64.isValid(img)) {
      img = Base64.encode(img);
    }

    /**
     * Set header
     */
    type = ImageTypesSymbols[img.charAt(0) as any];
    img = type ? `data:${type};base64,${img}` : `data:;base64,${img}`;
  } else if (Object.values(SupportedTypes).includes(m[1] as any)) {
    type = m[1];
  }

  /**
   * Convert PDF base64 to Blob and display
   */
  if (type === SupportedTypes.PDF) {
    const blob = base64toBlob(img, SupportedTypes.PDF);
    img = URL.createObjectURL(blob);

    /**
     * Disable toolbar
     */
    if (!options.toolbar) {
      img += '#toolbar=0';
    }

    return (
      <div
        className={cx(
          styles.wrapper,
          css`
            width: ${width}px;
            height: ${height}px;
          `
        )}
      >
        <iframe width={imageWidth || ''} height={imageHeight || ''} src={img} />
      </div>
    );
  }

  /**
   * Display Video MP4 or WebM
   */
  if (type === SupportedTypes.MP4 || type === SupportedTypes.WEBM) {
    return (
      <div
        className={cx(
          styles.wrapper,
          css`
            width: ${width}px;
            height: ${height}px;
          `
        )}
      >
        <video
          width={imageWidth || ''}
          height={imageHeight || ''}
          controls={options.controls}
          autoPlay={options.autoPlay}
        >
          <source src={img}></source>
        </video>
      </div>
    );
  }

  /**
   * Display Audio OGG or MP3
   */
  if (type === SupportedTypes.MP3 || type === SupportedTypes.OGG) {
    return (
      <div
        className={cx(
          styles.wrapper,
          css`
            width: ${width}px;
            height: ${height}px;
          `
        )}
      >
        <audio controls={options.controls} autoPlay={options.autoPlay}>
          <source src={img}></source>
        </audio>
      </div>
    );
  }

  /**
   * Add URL to Image
   */
  let image = <img width={imageWidth || ''} height={imageHeight || ''} src={img} />;
  if (options.url) {
    image = (
      <a className={cx(styles.url)} href={options.url} title={options.title}>
        {image}
      </a>
    );
  }

  /**
   * Display Image
   */
  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {image}
    </div>
  );
};
