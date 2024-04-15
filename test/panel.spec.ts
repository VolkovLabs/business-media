import { test, expect } from '@grafana/plugin-e2e';

test.describe('panel-datalinks panel', () => {
  test('should display message in case panel data is empty', async ({
    gotoPanelEditPage,
    readProvisionedDashboard,
  }) => {
    const dashboard = await readProvisionedDashboard({ fileName: 'e2e.json' });
    const panelEditPage = await gotoPanelEditPage({ dashboard, id: '2' });
    await expect(panelEditPage.panel.locator.getByTestId('data-testid Alert warning')).toContainText(
      'Nothing to display...'
    );
  });

  test('should display image', async ({ gotoPanelEditPage, readProvisionedDashboard }) => {
    const dashboard = await readProvisionedDashboard({ fileName: 'e2e.json' });
    const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });

    const element = await panelEditPage.panel.locator.getByTestId('data-testid panel');

    // TO DO
  });
});
