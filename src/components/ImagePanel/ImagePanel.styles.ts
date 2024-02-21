import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
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
    description: css`
      text-align: center;
      padding: ${theme.spacing(0.5)};
    `,
  };
};
