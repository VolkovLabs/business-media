import { test, expect } from '@grafana/plugin-e2e';

test.describe('panel-datalinks panel', () => {
  test('should display message in case panel data is empty', async ({
    gotoPanelEditPage,
    readProvisionedDashboard,
  }) => {
    /**
     * Use e2e.json dashboard
     */
    const dashboard = await readProvisionedDashboard({ fileName: 'e2e.json' });

    /**
     * Go to panel Edit page
     */
    const panelEditPage = await gotoPanelEditPage({ dashboard, id: '2' });

    /**
     * Alert text should be
     */
    await expect(panelEditPage.panel.locator.getByTestId('data-testid Alert warning')).toContainText(
      'Nothing to display...'
    );
  });

  test('should display image', async ({ page }) => {
    /**
     * Load page and open menu
     */
    await page.getByTestId('data-testid Toggle menu').click();

    /**
     * Go to Dashboards
     */
    await page.getByRole('link', { name: 'Dashboards' }).click();

    /**
     * Go to E2E dashboard
     */
    await page.getByRole('link', { name: 'E2E' }).click();

    /**
     * Check screenshot
     */
    await expect(page).toHaveScreenshot('actual-screenshot.png');

    /**
     * Compare screenshot actual
     */
    await expect(await page.screenshot()).toMatchSnapshot('actual-screenshot.png', { threshold: 0.3 });
  });
});
