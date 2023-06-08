import { css } from '@emotion/css';

/**
 * Styles
 */
export const Styles = () => {
  return {
    wrapper: css`
      position: relative;
    `,
    url: css`
      display: block;
    `,
    zoomControls: css`
      padding: 4px;
      position: absolute;
      z-index: 1;
    `,
  };
};
