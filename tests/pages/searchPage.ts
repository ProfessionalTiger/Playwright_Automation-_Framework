import { Page } from '@playwright/test';
import { BasePage } from './basePage.js';

/**
 * Search Page Object Model
 */
export class SearchPage extends BasePage {
  // Locators
  readonly searchInputSelector = '[placeholder*="Search"], [aria-label*="Search"], input[type="search"]';
  readonly searchButtonSelector = 'button[type="submit"], [aria-label*="search" i]';
  readonly resultsContainerSelector = '[role="main"], .search-results, .results';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to a search page
   * @param url - Search page URL
   */
  async navigateToSearchPage(url: string): Promise<void> {
    await this.goto(url);
  }

  /**
   * Perform a search with given keyword
   * @param keyword - Search keyword
   */
  async search(keyword: string): Promise<void> {
    await this.page.fill(this.searchInputSelector, keyword);
    await this.page.click(this.searchButtonSelector);
    // Wait for results to load
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get search input field value
   * @returns Input field value
   */
  async getSearchInputValue(): Promise<string> {
    return await this.page.inputValue(this.searchInputSelector);
  }

  /**
   * Clear search input field
   */
  async clearSearchInput(): Promise<void> {
    await this.page.fill(this.searchInputSelector, '');
  }

  /**
   * Get number of results
   * @returns Number of results found
   */
  async getResultsCount(): Promise<number> {
    const results = await this.page.locator('.result-item, li').count();
    return results;
  }

  /**
   * Get all result titles
   * @returns Array of result titles
   */
  async getResultTitles(): Promise<string[]> {
    const titles = await this.page.locator('.result-title, h2, h3').allTextContents();
    return titles;
  }

  /**
   * Click on specific result by index
   * @param index - Result index (0-based)
   */
  async clickResultByIndex(index: number): Promise<void> {
    const results = await this.page.locator('.result-item, li');
    await results.nth(index).click();
  }

  /**
   * Verify search results are displayed
   */
  async areResultsDisplayed(): Promise<boolean> {
    const count = await this.getResultsCount();
    return count > 0;
  }

  /**
   * Search and verify results contain keyword
   * @param keyword - Keyword to search for
   */
  async searchAndVerify(keyword: string): Promise<boolean> {
    await this.search(keyword);
    const results = await this.getResultTitles();
    return results.some(result => result.toLowerCase().includes(keyword.toLowerCase()));
  }
}
