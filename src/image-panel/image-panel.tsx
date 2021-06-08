import { css, cx } from 'emotion';
import { Base64 } from 'js-base64';
import React from 'react';
import { PanelProps } from '@grafana/data';
import { ImageTypes, ImageTypesSymbols } from '../constants';
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
   * Find required field
   */
  let img = data.series
    .map((series) =>
      series.fields.find((field) => field.type === 'string' && (!options.name || field.name === options.name))
    )
    .map((field) => field?.values.get(field.values.length - 1))
    .toString();

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

  /**
   * Encode to base64 if not
   */
  if (!Base64.isValid(img)) {
    img = Base64.encode(img);
  }

  /**
   * Source
   */
  const type = ImageTypesSymbols[img.charAt(0) as any];
  const src = type ? `data:${type};base64,${img}` : `data:;base64,${img}`;

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
        <iframe className={styles.img} width={width} height={height} src={src} />
      ) : (
        <img className={styles.img} width={width} height={height} src={src} />
      )}
    </div>
  );
};
