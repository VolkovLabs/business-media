import { Locator } from '@playwright/test';
import { DashboardPage, expect, Panel } from '@grafana/plugin-e2e';
import { TEST_IDS } from '../../src/constants/tests';
import { getLocatorSelectors, LocatorSelectors } from './selectors';

/**
 * Base View Helper
 */
class BaseView {
  protected readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
  }

  public get() {
    return this.locator;
  }

  private getMsg(msg: string): string {
    return `View: ${msg}`;
  }

  public async checkPresence() {
    return expect(this.get(), this.getMsg('Check View Presence')).toBeVisible();
  }

  public async compareScreenshot(name: string) {
    return expect(this.get(), this.getMsg(`Check name Screenshot`)).toHaveScreenshot(name);
  }

  async checkSize(minWidth: number, minHeight: number): Promise<void> {
    const box = await this.get().boundingBox();

    expect(box!.width, this.getMsg(`Width should be more ${minWidth}`)).toBeGreaterThan(minWidth);
    expect(box!.height, this.getMsg(`height should be more ${minWidth}`)).toBeGreaterThan(minHeight);
  }
}

/**
 * Image View Helper
 */
class ImageViewHelper extends BaseView {
  constructor(parentLocator: Locator) {
    super(parentLocator.getByTestId(TEST_IDS.panel.image));
  }
}

/**
 * Video View Helper
 */
class VideoViewHelper extends BaseView {
  constructor(parentLocator: Locator) {
    super(parentLocator.getByTestId(TEST_IDS.panel.video));
  }

  public async checkPosterPresence() {
    const poster = await this.get().getAttribute('poster');
    return expect(poster).not.toBeNull();
  }

  public async checkPosterValue(value) {
    const poster = await this.get().getAttribute('poster');
    return expect(poster).toContain(value);
  }
}

/**
 * PDF View Helper
 */
class PdfViewHelper extends BaseView {
  constructor(parentLocator: Locator) {
    super(parentLocator.getByTestId(TEST_IDS.panel.iframe));
  }
}

/**
 * Audio View Helper
 */
class AudioViewHelper extends BaseView {
  constructor(parentLocator: Locator) {
    super(parentLocator.getByTestId(TEST_IDS.panel.audio));
  }
}

/**
 * Panel Helper
 */
export class PanelHelper {
  private readonly locator: Locator;
  private readonly panel: Panel;
  private readonly title: string;
  private readonly selectors: LocatorSelectors<typeof TEST_IDS.panel>;

  constructor(dashboardPage: DashboardPage, panelTitle: string) {
    this.panel = dashboardPage.getPanelByTitle(panelTitle);
    this.title = panelTitle;
    this.locator = this.panel.locator;
    this.selectors = getLocatorSelectors(TEST_IDS.panel)(this.locator);
  }

  private getMsg(msg: string): string {
    return `Panel: ${msg}`;
  }

  public async checkIfNoErrors() {
    return expect(this.panel.getErrorIcon(), this.getMsg('Check If No Errors')).not.toBeVisible();
  }

  public async getPanel() {
    return this.panel;
  }

  public async checkPresence() {
    return expect(this.selectors.root(), this.getMsg(`Check ${this.title} Presence`)).toBeVisible();
  }

  public async checkAlert() {
    return expect(this.selectors.warning(), this.getMsg(`Check ${this.title} Alert`)).toBeVisible();
  }

  public getImageView() {
    return new ImageViewHelper(this.locator);
  }

  public getPdfView() {
    return new PdfViewHelper(this.locator);
  }

  public getVideoView() {
    return new VideoViewHelper(this.locator);
  }

  public getAudioView() {
    return new AudioViewHelper(this.locator);
  }

  public checkAlertMessage(message: string) {
    return expect(this.selectors.warning()).toHaveText(message);
  }
}
