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
   * Uses LOGIN_URL for authentication from npm scripts
   */
  authenticatedPage: async ({ page }, use) => {
    // Setup: Navigate and perform login
    console.log('🔐 Setting up authenticated session');
    
    // Use LOGIN_URL from environment variables (set by npm scripts via cross-env)
    // URL must be defined via npm script for security
    const loginUrl = process.env.LOGIN_URL;
    
    if (!loginUrl) {
      throw new Error('LOGIN_URL environment variable is not set. Please check your npm script configuration.');
    }
    
    console.log('📍 Using login URL from npm script (LOGIN_URL)');
    
    // Navigate to login page
    await page.goto(loginUrl);
    
    // Perform login
    await page.fill('[id="_58_login"]', process.env.TEST_USERNAME || 'autodev');
    await page.fill('[id="_58_password"]', process.env.TEST_PASSWORD || '123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

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
