import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    zoom: css`
      [data-rmiz-modal-overlay='visible'] {
        background-color: ${theme.colors.background.primary};
    `,
  };
};
