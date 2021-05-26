import { css } from 'emotion';
import { stylesFactory } from '@grafana/ui';

/**
 * Styles
 */
export const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    img: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
  };
});
