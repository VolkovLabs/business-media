import { css } from '@emotion/css';

/**
 * Styles
 */
export const getStyles = () => {
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
};
