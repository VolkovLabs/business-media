import { Base64 } from 'js-base64';
import React from 'react';
import { css, cx } from '@emotion/css';
import { FieldType, PanelProps } from '@grafana/data';
import { ImageFields, ImageTypes, ImageTypesSymbols } from '../constants';
import { getStyles } from '../styles';

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
   * Find required field (string)
   */
  let img = data.series
    .map((series) =>
      series.fields.find((field) => field.type === FieldType.string && (!options.name || field.name === options.name))
    )
    .map((field) => field?.values.get(field.values.length - 1))
    .toString();

  /**
   * Height field (number)
   */
  let heightField = data.series
    .map((series) =>
      series.fields.find((field) => field.type === FieldType.number && field.name === ImageFields.HEIGHT)
    )
    .map((field) => field?.values.get(field.values.length - 1))
    .toString();
  height = Number(heightField) ? Number(heightField) : height;

  /**
   * Width field
   */
  let widthField = data.series
    .map((series) => series.fields.find((field) => field.type === FieldType.number && field.name === ImageFields.WIDTH))
    .map((field) => field?.values.get(field.values.length - 1))
    .toString();
  width = Number(widthField) ? Number(widthField) : width;

  /**
   * Custom Image width and height from Options
   */
  height = options.height ? options.height : height;
  width = options.width ? options.width : width;

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
        Nothing to display...
      </div>
    );
  }

  let type;

  /**
   * Check if returned value already has header
   */
  const m = img.match(/^data:(image|application\/\w+)/);
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
  } else if (m[1] === ImageTypes.PDF) {
    type = ImageTypes.PDF;
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
      {type === ImageTypes.PDF ? (
        <iframe className={styles.img} width={width} height={height} src={img} />
      ) : (
        <img className={styles.img} width={width} height={height} src={img} />
      )}
    </div>
  );
};
