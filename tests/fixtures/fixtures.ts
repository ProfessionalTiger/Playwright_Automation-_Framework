import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.ts';
import { SearchPage } from '../pages/StrategyPage.ts';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
   * Uses BASE_URL from .env file with /web/tango appended for login
   */
  authenticatedPage: async ({ page }, use) => {
    // Setup: Navigate and perform login
    console.log('🔐 Setting up authenticated session');
    
    // Use BASE_URL from .env and append /web/tango for login page
    const baseUrl = process.env.BASE_URL;
    
    if (!baseUrl) {
      throw new Error('BASE_URL environment variable is not set in .env file.');
    }
    
    const loginUrl = `${baseUrl}/web/tango`;
    console.log('📍 Using login URL from BASE_URL (.env)');
    
    // Navigate to login page with timeout
    await page.goto(loginUrl, { waitUntil: 'load', timeout: 20000 });
    
    // Perform login
    const username = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;
    
    if (!username || !password) {
      throw new Error('TEST_USERNAME and TEST_PASSWORD environment variables must be set in .env file.');
    }
    
    await page.fill('[id="_58_login"]', username, { timeout: 5000 });
    await page.fill('[id="_58_password"]', password, { timeout: 5000 });
    await page.click('button[type="submit"]', { timeout: 5000 });
    
    // Wait for dashboard to load (post-login navigation)
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await page.waitForLoadState('load');

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
