import { Page } from '@playwright/test';

/**
 * Base Page class containing common methods for all pages
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get the current page title
   * @returns Page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   * @returns Current page URL
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for a specific time in milliseconds
   * @param ms - Time in milliseconds
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Take a screenshot
   * @param filename - Screenshot filename
   */
  async takeScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({ path: `./tests/reports/${filename}` });
  }

  /**
   * Close the page
   */
  async closePage(): Promise<void> {
    await this.page.close();
  }
}
