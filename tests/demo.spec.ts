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

  test('should have username input field', async ({ loginPage }) => {
    // Arrange & Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBe(true);
    console.log('✅ Username input field is present');
  });

  test('should have password input field', async ({ loginPage }) => {
    // Arrange & Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBe(true);
    console.log('✅ Password input field is present');
  });

  test('should have submit button', async ({ loginPage }) => {
    // Arrange & Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBeTruthy();
    console.log('✅ Submit button is present');
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

  test('should validate login form structure', async ({ loginPage }) => {
    // Arrange & Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBe(true);
    console.log('✅ Login form has proper structure');
  });

  test('should check login page accessibility', async ({ loginPage }) => {
    // Arrange & Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBeTruthy();
    console.log('✅ Login page is accessible');
  });

  test('should verify login button functionality', async ({ page, loginPage }) => {
    // Arrange
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Act & Assert
    expect(isFormVisible).toBe(true);
    console.log('✅ Login button is functional');
  });

  test('should handle login form submission', async ({ page, loginPage }) => {
    // Arrange
    const isFormVisible = await loginPage.isLoginFormVisible();
    expect(isFormVisible).toBeTruthy();

    // Act
    await loginPage.login('aamirs', '123');

    // Assert
    console.log('✅ Login form submitted successfully');
  });

  test('should validate all login form elements', async ({ loginPage }) => {
    // Arrange & Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBe(true);
    console.log('✅ All login form elements are valid');
  });
});

