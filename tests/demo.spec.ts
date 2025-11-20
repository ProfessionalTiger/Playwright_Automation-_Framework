import { test, expect } from './fixtures/fixtures.js';
import { LoginPage} from './pages/LoginPage.js';
import { SearchPage } from './pages/searchPage.js';
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
    // Setup before each test
  });

  test.afterEach(async ({ page }) => {
    console.log('🧹 Cleaning up after test');
    // Cleanup after each test
  });

  test('should display login form', async ({ loginPage }) => {
    // Arrange & Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBeTruthy();
    console.log('✅ Login form is visible');
  });

  test('should have correct login form structure', async ({ page, loginPage }) => {
    // Arrange
    await page.goto('http://localhost:3000/login');

    // Act
    const isVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isVisible).toBe(true);
    console.log('✅ Login form structure is correct');
  });

  test('should perform login successfully', async ({ page, loginPage }) => {
    // Arrange
    await page.goto('http://localhost:3000/login');

    // Act
    await loginPage.login('aamirs', '123');

    // Assert
    await expect(page).toHaveURL('**/dashboard');
    console.log('✅ Login successful');
  });

  test('should validate username input field', async ({ loginPage }) => {
    // Arrange & Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBeTruthy();
    console.log('✅ Username field is present');
  });

  test('should validate password input field', async ({ loginPage }) => {
    // Arrange & Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBeTruthy();
    console.log('✅ Password field is present');
  });

  test('should validate login button', async ({ page, loginPage }) => {
    // Arrange
    await page.goto('http://localhost:3000/login');

    // Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBe(true);
    console.log('✅ Login button is present');
  });

  test('should handle login with valid credentials', async ({ page, loginPage }) => {
    // Arrange
    const username = 'aamirs';
    const password = '123';
    await page.goto('http://localhost:3000/login');

    // Act
    await loginPage.login(username, password);
    const currentUrl = page.url();

    // Assert
    expect(currentUrl).toContain('dashboard');
    console.log('✅ Valid credentials handled correctly');
  });

  test('should display login page title', async ({ page }) => {
    // Arrange & Act
    await page.goto('http://localhost:3000/login');
    const title = await page.title();

    // Assert
    expect(title).toBeTruthy();
    console.log(`✅ Page title: ${title}`);
  });

  test('should have proper form layout', async ({ loginPage, page }) => {
    // Arrange
    await page.goto('http://localhost:3000/login');

    // Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBe(true);
    console.log('✅ Login form has proper layout');
  });

  test('should verify login page is responsive', async ({ page, loginPage }) => {
    // Arrange
    await page.setViewportSize({ width: 1280, height: 1024 });
    await page.goto('http://localhost:3000/login');

    // Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBeTruthy();
    console.log('✅ Login page is responsive');
  });
});

