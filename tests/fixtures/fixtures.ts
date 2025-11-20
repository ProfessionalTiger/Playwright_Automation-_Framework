import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SearchPage } from '../pages/searchPage.js';

/**
 * Custom fixtures interface
 */
export interface CustomFixtures {
  loginPage: LoginPage;
  searchPage: SearchPage;
  authenticatedPage: Page;
}

/**
 * Extend base test with custom fixtures
 */
export const test = base.extend<CustomFixtures>({
  /**
   * Login Page fixture
   * Provides LoginPage instance with automatic initialization
   */
  loginPage: async ({ page }: { page: Page }, use: Function) => {
    // Setup: Create LoginPage instance
    const loginPage = new LoginPage(page);
    
    console.log('🔐 Login Page fixture initialized');
    
    // Use the fixture in the test
    await use(loginPage);
    
    // Teardown: Cleanup
    console.log('🧹 Login Page fixture cleanup');
  },

  /**
   * Search Page fixture
   * Provides SearchPage instance with automatic initialization
   */
  searchPage: async ({ page }: { page: Page }, use: Function) => {
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
