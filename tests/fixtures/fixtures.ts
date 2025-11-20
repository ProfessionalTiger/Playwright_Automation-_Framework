import { test as base, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/homePage.js';
import { SearchPage } from '../pages/searchPage.js';

/**
 * Custom fixtures interface
 */
export interface CustomFixtures {
  homePage: HomePage;
  searchPage: SearchPage;
  authenticatedPage: Page;
}

/**
 * Extend base test with custom fixtures
 */
export const test = base.extend<CustomFixtures>({
  /**
   * Home Page fixture
   * Provides HomePage instance with automatic initialization
   */
  homePage: async ({ page }, use) => {
    // Setup: Create HomePage instance
    const homePage = new HomePage(page);
    
    console.log('📄 Home Page fixture initialized');
    
    // Use the fixture in the test
    await use(homePage);
    
    // Teardown: Close page if needed
    console.log('🧹 Home Page fixture cleanup');
  },

  /**
   * Search Page fixture
   * Provides SearchPage instance with automatic initialization
   */
  searchPage: async ({ page }, use) => {
    // Setup: Create SearchPage instance
    const searchPage = new SearchPage(page);
    
    console.log('🔍 Search Page fixture initialized');
    
    // Use the fixture in the test
    await use(searchPage);
    
    // Teardown: Cleanup
    console.log('🧹 Search Page fixture cleanup');
  },

  /**
   * Authenticated Page fixture
   * Provides a page instance with pre-authenticated session
   * (Mock implementation - customize based on your auth logic)
   */
  authenticatedPage: async ({ page }, use) => {
    // Setup: Navigate and perform login
    console.log('🔐 Setting up authenticated session');
    
    // Example authentication setup (customize as needed)
    // await page.goto('https://example.com/login');
    // await page.fill('[name="username"]', process.env.TEST_USERNAME || 'testuser');
    // await page.fill('[name="password"]', process.env.TEST_PASSWORD || 'testpass');
    // await page.click('button[type="submit"]');
    // await page.waitForLoadState('networkidle');

    console.log('✅ Authentication setup complete');
    
    // Use the fixture in the test
    await use(page);
    
    // Teardown: Logout or cleanup
    console.log('🧹 Authenticated session cleanup');
    // await page.context().clearCookies();
  },
});

// Re-export expect from Playwright
export { expect };
