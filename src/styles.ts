import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  return {
    wrapper: css`
      position: relative;
    `,
    url: css`
      display: block;
    `,
    zoom: css`
      [data-rmiz-modal-overlay='visible'] {
        background-color: ${theme.colors.background.primary};
    `,
    zoomPanPinchControls: css`
      padding: 4px;
      position: absolute;
      z-index: 1;
    `,
  };
};
