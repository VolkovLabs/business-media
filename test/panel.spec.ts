import { test, expect } from '@grafana/plugin-e2e';
import { PanelHelper } from './utils';

test.describe('Media panel', () => {
  test('Check grafana version', async ({ grafanaVersion }) => {
    console.log('Grafana version: ', grafanaVersion);
    expect(grafanaVersion).toEqual(grafanaVersion);
  });

  test('Should add empty default image panel', async ({ readProvisionedDashboard, gotoDashboardPage }) => {
    /**
     * Go To Panels dashboard e2e.json
     * return dashboardPage
     */
    const dashboard = await readProvisionedDashboard({ fileName: 'e2e.json' });
    const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

    /**
     * Add new visualization
     */
    const editPage = await dashboardPage.addPanel();
    await editPage.setVisualization('Business Media');
    await editPage.setPanelTitle('Business Images');
    await editPage.backToDashboard();

    /**
     * Should add empty visualization without errors
     */
    const panel = new PanelHelper(dashboardPage, 'Business Images');
    await panel.checkIfNoErrors();
    await panel.checkPresence();
    await panel.checkAlert();

    /**
     * Should display info message
     */
    await panel.checkAlertMessage('Nothing to display...');
  });

  test.describe('Media types', () => {
    test('Should display default image panel with base64 image', async ({
      readProvisionedDashboard,
      gotoDashboardPage,
    }) => {
      /**
       * Go To Panels dashboard e2e.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'e2e.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Get panel
       */
      const panel = new PanelHelper(dashboardPage, 'PNG');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const imageView = panel.getImageView();
      await imageView.checkPresence();
      await imageView.compareScreenshot('base64-screenshot.png');
    });

    test('Should display default image panel with URL image', async ({
      readProvisionedDashboard,
      gotoDashboardPage,
    }) => {
      /**
       * Go To Panels dashboard urls.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'urls.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Get panel
       */
      const panel = new PanelHelper(dashboardPage, 'Image from URL');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const imageView = panel.getImageView();
      await imageView.checkPresence();
      await imageView.compareScreenshot('url-screenshot.png');
    });

    test('Should display audio panel', async ({ readProvisionedDashboard, gotoDashboardPage, page }) => {
      /**
       * Go To Panels dashboard postgres.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'postgres.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Panel loading...
       */
      await page.waitForTimeout(2500);

      /**
       * Get panel
       */
      const panel = new PanelHelper(dashboardPage, 'Audio');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const audioView = panel.getAudioView();
      await audioView.checkPresence();
    });

    test('Should display video panel with poster base64 image', async ({
      readProvisionedDashboard,
      gotoDashboardPage,
      page,
    }) => {
      /**
       * Go To Panels dashboard urls.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'urls.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Panel loading...
       */
      await page.waitForTimeout(1500);

      /**
       * Get panel
       */
      const panel = new PanelHelper(dashboardPage, 'Video from URL with Base64 poster');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const videoView = panel.getVideoView();
      await videoView.checkPresence();
      await videoView.compareScreenshot('video-with-poster-screenshot.png');
    });

    test('Should display pdf panel', async ({ readProvisionedDashboard, gotoDashboardPage, page }) => {
      /**
       * Go To Panels dashboard panels.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'panels.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      /**
       * Get panel
       */
      const panel = new PanelHelper(dashboardPage, 'PDF');

      await panel.checkIfNoErrors();
      await panel.checkPresence();

      const pdfView = panel.getPdfView();
      await pdfView.checkPresence();
    });
  });
});
