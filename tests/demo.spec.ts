import { test, expect } from './fixtures/fixtures.js';
import { LoginPage} from './pages/LoginPage.js';
//import { SearchPage } from './pages/searchPage.js';
import { DataGenerator } from './utils/dataGenerator.js';
import { 
  getTodayDate, 
  formatDate, 
  delay, 
  generateRandomString,
  capitalizeString
} from './utils/helpers.js';

/**
 * Test Suite: Login Page Tests
 * Using Page Object Model pattern with custom fixtures
 */
test.describe('LoginPage Tests', () => {
  test.beforeEach(async ({ page }) => {
    console.log('📝 Setting up test - navigating to Login page');
    // Navigate to login page before each test
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.waitForLoadState('networkidle');
  });

  test('should perform login with valid credentials', async ({ loginPage }) => {
    // Arrange
    const username = 'student';
    const password = 'Password123';

    // Act
    await loginPage.login(username, password);

    // Assert
    console.log('✅ Login performed with valid credentials');
  });

});

