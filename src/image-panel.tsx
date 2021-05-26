import { css, cx } from 'emotion';
import { Base64 } from 'js-base64';
import React from 'react';
import { PanelProps } from '@grafana/data';
import { getStyles } from './styles';

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
    .map((series) => series.fields.find((field) => field.type === 'string' && field.name === options.name))
    .map((field) => field?.values.get(field.values.length - 1))
    .toString();

  /**
   * Encode to base64 if not
   */
  if (!Base64.isValid(img)) {
    img = Base64.encode(img);
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
      <img className={styles.img} width={width} height={height} src={`data:${options.type};base64,${img}`} />
    </div>
  );
};
