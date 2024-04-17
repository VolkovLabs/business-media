import { test, expect } from '@grafana/plugin-e2e';
import { TEST_IDS } from '../src/constants';

test.describe('Base64 Image/PDF panel', () => {
  test('should display message in case panel data is empty', async ({ gotoDashboardPage, dashboardPage }) => {
    /**
     * Go To E2E dashboard
     * return dashboardPage
     */
    await gotoDashboardPage({ uid: 'c8ee435b-d16b-4b27-9304-7062724c1feb' });

    /**
     * Find panel by title with no data
     * Should be visible
     */
    await expect(dashboardPage.getPanelByTitle('Empty').locator).toBeVisible();

    /**
     * No Results Message should be visible
     */
    await expect(dashboardPage.getPanelByTitle('Empty').locator).toContainText('Nothing to display...');
  });

  test('should display image', async ({ gotoDashboardPage, dashboardPage }) => {
    /**
     * Go To E2E dashboard
     * return dashboardPage
     */
    await gotoDashboardPage({ uid: 'c8ee435b-d16b-4b27-9304-7062724c1feb' });

    /**
     * Find panel with image
     * Should be visible
     */
    await expect(dashboardPage.getPanelByTitle('PNG').locator).toBeVisible();

    /**
     * Check and compare image
     */
    await expect(dashboardPage.getPanelByTitle('PNG').locator.getByTestId(TEST_IDS.panel.image)).toHaveScreenshot(
      'actual-screenshot.png'
    );
  });
});
