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
  test.beforeEach(async ({ page }) => {
    console.log('📝 Setting up test - navigating to Login page');
    // Navigate to login page before each test
    const baseUrl = process.env.BASE_URL || '/web/tango';
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
  });

  test('should perform login with valid credentials', async ({ loginPage }) => {
    // Arrange
    const username = 'aamirs';
    const password = '123';

    // Act
    await loginPage.login(username, password);

    // Assert
    console.log('✅ Login performed with valid credentials');
  });

});

