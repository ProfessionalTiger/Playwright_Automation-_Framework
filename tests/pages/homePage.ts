import { Page } from '@playwright/test';
import { BasePage } from './basePage.js';

/**
 * Home Page Object Model
 */
export class HomePage extends BasePage {
  // Locators
  readonly pageTitle = 'Playwright';
  readonly getStartedLink = 'Get started';
  readonly documentationLink = 'Docs';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Playwright homepage
   */
  async navigateToHome(): Promise<void> {
    await this.goto('https://playwright.dev/');
  }

  /**
   * Verify page title contains "Playwright"
   */
  async verifyPageTitle(): Promise<boolean> {
    const title = await this.getPageTitle();
    return title.includes(this.pageTitle);
  }

  /**
   * Click on the "Get started" link
   */
  async clickGetStartedLink(): Promise<void> {
    await this.page.getByRole('link', { name: this.getStartedLink }).click();
  }

  /**
   * Verify "Get started" link is visible
   */
  async isGetStartedLinkVisible(): Promise<boolean> {
    const link = this.page.getByRole('link', { name: this.getStartedLink });
    return await link.isVisible();
  }

  /**
   * Get all links on the page
   */
  async getAllLinks(): Promise<string[]> {
    const links = await this.page.locator('a').allTextContents();
    return links;
  }

  /**
   * Search for a specific link by partial text
   */
  async clickLinkByPartialText(partialText: string): Promise<void> {
    await this.page.getByRole('link', { name: new RegExp(partialText, 'i') }).click();
  }
}
