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
    description: css`
      text-align: center;
      padding: ${theme.spacing(0.5)};
    `,
  };
};
