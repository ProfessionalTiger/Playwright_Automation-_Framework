import { test, expect } from './fixtures/fixtures.js';
import { LoginPage} from './pages/LoginPage.js';
import { SearchPage } from './pages/StrategyPage.js';
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

  test('should display Playwright Login page', async ({ loginPage }) => {
    // Arrange & Act
    const isVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isVisible).toBeTruthy();
  });

  test('should have correct login form', async ({ loginPage }) => {
    // Arrange & Act
    const formVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(formVisible).toBe(true);
  });

  test('should perform login action', async ({ page, loginPage }) => {
    // Arrange
    await page.goto('http://localhost:3000/login');

    // Act
    await loginPage.login('testuser', 'password123');

    // Assert
    await expect(page).toHaveURL('**/dashboard');
  });

  test('should validate login form elements', async ({ loginPage }) => {
    // Arrange & Act
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Assert
    expect(isFormVisible).toBeTruthy();
    console.log('✅ Login form elements are visible');
  });
});

/**
 * Test Suite: Search Page Tests
 * Demonstrates search functionality with POM
 */
test.describe('Search Page Tests', () => {
  test('should perform search with keyword', async ({ page, searchPage }) => {
    // Arrange
    const searchKeyword = 'JavaScript';

    // Act
    await searchPage.navigateToSearchPage('https://www.google.com');
    await searchPage.search(searchKeyword);

    // Assert
    const inputValue = await searchPage.getSearchInputValue();
    expect(inputValue.toLowerCase()).toContain(searchKeyword.toLowerCase());
  });

  test('should clear search input', async ({ searchPage }) => {
    // Arrange
    await searchPage.navigateToSearchPage('https://www.google.com');

    // Act
    await searchPage.search('TypeScript');
    await searchPage.clearSearchInput();

    // Assert
    const inputValue = await searchPage.getSearchInputValue();
    expect(inputValue).toBe('');
  });
});

/**
 * Test Suite: Data Generation Tests
 * Demonstrates usage of Faker for test data
 */
test.describe('Data Generation Tests', () => {
  test('should generate random user data', async ({ page }) => {
    // Arrange & Act
    const user = DataGenerator.generateUser();

    // Assert
    expect(user.firstName).toBeTruthy();
    expect(user.email).toContain('@');
    expect(user.password.length).toBeGreaterThan(0);
    console.log('Generated User:', user);
  });

  test('should generate random product data', async ({ page }) => {
    // Arrange & Act
    const product = DataGenerator.generateProduct();

    // Assert
    expect(product.name).toBeTruthy();
    expect(product.price).toBeGreaterThan(0);
    expect(product.sku).toBeTruthy();
    console.log('Generated Product:', product);
  });

  test('should generate multiple search queries', async ({ page }) => {
    // Arrange & Act
    const queries = DataGenerator.generateSearchQueries(3);

    // Assert
    expect(queries.length).toBe(3);
    queries.forEach(query => {
      expect(query.length).toBeGreaterThan(0);
    });
    console.log('Generated Queries:', queries);
  });

  test('should generate random email', async ({ page }) => {
    // Arrange & Act
    const email = DataGenerator.generateEmail();

    // Assert
    expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    console.log('Generated Email:', email);
  });
});

/**
 * Test Suite: Utility Functions Tests
 * Demonstrates usage of helper utilities
 */
test.describe('Utility Functions Tests', () => {
  test('should get today date in correct format', async ({ page }) => {
    // Arrange & Act
    const todayDate = getTodayDate('YYYY-MM-DD');

    // Assert
    expect(todayDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    console.log('Today Date:', todayDate);
  });

  test('should format date correctly', async ({ page }) => {
    // Arrange
    const testDate = new Date('2025-01-15');

    // Act
    const formatted = formatDate(testDate, 'DD/MM/YYYY');

    // Assert
    expect(formatted).toBe('15/01/2025');
  });

  test('should delay execution', async ({ page }) => {
    // Arrange
    const startTime = Date.now();

    // Act
    await delay(500);
    const endTime = Date.now();

    // Assert
    expect(endTime - startTime).toBeGreaterThanOrEqual(500);
  });

  test('should generate random string', async ({ page }) => {
    // Arrange & Act
    const randomStr = generateRandomString(10);

    // Assert
    expect(randomStr.length).toBe(10);
    expect(/^[a-zA-Z0-9]+$/.test(randomStr)).toBe(true);
  });

  test('should capitalize string correctly', async ({ page }) => {
    // Arrange
    const testString = 'playwright';

    // Act
    const capitalized = capitalizeString(testString);

    // Assert
    expect(capitalized).toBe('Playwright');
  });
});

/**
 * Test Suite: Cross-browser Tests
 * Tests run on Chromium, Firefox, and WebKit
 */
test.describe('Cross-browser Tests', () => {
  test('should work on all browsers', async ({ page, browserName }) => {
    // Arrange & Act
    await page.goto('https://playwright.dev/');

    // Assert
    const title = await page.title();
    expect(title).toContain('Playwright');
    console.log(`✅ Test passed on ${browserName}`);
  });

  test('should have correct viewport on all browsers', async ({ page, browserName }) => {
    // Assert
    const size = page.viewportSize();
    expect(size).toBeTruthy();
    console.log(`${browserName} viewport: ${size?.width}x${size?.height}`);
  });
});

/**
 * Test Suite: Advanced Testing Scenarios
 */
test.describe('Advanced Testing Scenarios', () => {
  test('should handle multiple actions in sequence', async ({ loginPage, page }) => {
    // Arrange
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Act
    await page.goto('https://playwright.dev/');
    await page.waitForURL('https://playwright.dev/');
    const url = page.url();

    // Assert
    expect(isFormVisible).toBeTruthy();
    expect(url).toContain('playwright.dev');
  });

  test('should combine POM and direct page interactions', async ({ loginPage, page }) => {
    // Arrange
    const isFormVisible = await loginPage.isLoginFormVisible();

    // Act - Using POM
    expect(isFormVisible).toBeTruthy();

    // Act - Using direct page interaction
    await page.goto('https://playwright.dev/');
    const pageTitle = await page.title();

    // Assert
    expect(pageTitle).toContain('Playwright');
  });

  test('should generate and use test data in flow', async ({ page }) => {
    // Arrange
    const testUser = DataGenerator.generateUser();
    const randomId = DataGenerator.generateRandomNumber(1, 1000);

    // Act
    await page.goto('https://playwright.dev/');
    const todayDate = getTodayDate('DD/MM/YYYY');

    // Assert
    expect(testUser.email).toBeTruthy();
    expect(randomId).toBeGreaterThan(0);
    expect(todayDate).toBeTruthy();
    
    console.log(`Test data - User: ${testUser.firstName}, ID: ${randomId}, Date: ${todayDate}`);
  });
});

