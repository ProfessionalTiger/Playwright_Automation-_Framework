import { test, expect } from './fixtures/fixtures.ts';
import { LoginPage } from './pages/LoginPage.ts';
//import { SearchPage } from './pages/searchPage.ts';
import { DataGenerator } from './utils/dataGenerator.js';
import { 
  getTodayDate, 
  formatDate, 
  delay, 
  generateRandomString,
  capitalizeString
} from './utils/helpers.ts';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test Suite: Login Page Tests
 * Using Page Object Model pattern with custom fixtures
 */
test.describe('LoginPage Tests', () => {
  test('should perform login with valid credentials', async ({ page }) => {
    // Arrange
    console.log('📝 Setting up test - navigating to Login page');
    const baseUrl = `${process.env.BASE_URL}/web/tango`;
    const username = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;

    if (!username || !password) {
      throw new Error('TEST_USERNAME and TEST_PASSWORD must be set in .env file');
    }

    // Navigate to login page with timeout
    await page.goto(baseUrl, { waitUntil: 'load', timeout: 20000 });

    // Create LoginPage instance
    const loginPage = new LoginPage(page);

    // Act - Perform login
    await loginPage.login(username, password);

    // Assert
    expect(page.url()).toContain('dashboard');
    console.log('✅ Login performed with valid credentials');
  });

  test('should display login form', async ({ page }) => {
    // Arrange
    const baseUrl = `${process.env.BASE_URL}/web/tango`;
    
    // Navigate to login page with timeout
    await page.goto(baseUrl, { waitUntil: 'load', timeout: 20000 });
    
    const loginPage = new LoginPage(page);

    // Act - Check if form is visible
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBeTruthy();
    console.log('✅ Login form is visible');
  });

});

