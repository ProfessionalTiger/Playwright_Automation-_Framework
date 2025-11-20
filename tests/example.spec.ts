import { test, expect } from './fixtures/fixtures.js';
import { HomePage } from './pages/homePage.js';
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
 * Test Suite: Home Page Tests
 * Using Page Object Model pattern with custom fixtures
 */
test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    console.log('📝 Setting up test - navigating to home page');
    // Setup before each test
  });

  test.afterEach(async ({ page }) => {
    console.log('🧹 Cleaning up after test');
    // Cleanup after each test
  });

  test('should display Playwright home page', async ({ homePage }) => {
    // Arrange
    await homePage.navigateToHome();

    // Act
    const isVisible = await homePage.isGetStartedLinkVisible();

    // Assert
    expect(isVisible).toBeTruthy();
  });

  test('should have correct page title', async ({ homePage }) => {
    // Arrange & Act
    await homePage.navigateToHome();
    const hasTitle = await homePage.verifyPageTitle();

    // Assert
    expect(hasTitle).toBe(true);
  });

  test('should navigate to get started page', async ({ page, homePage }) => {
    // Arrange
    await homePage.navigateToHome();

    // Act
    await homePage.clickGetStartedLink();

    // Assert
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });

  test('should retrieve all links from home page', async ({ homePage }) => {
    // Arrange
    await homePage.navigateToHome();

    // Act
    const links = await homePage.getAllLinks();

    // Assert
    expect(links.length).toBeGreaterThan(0);
    console.log(`Found ${links.length} links on the page`);
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
  test('should handle multiple actions in sequence', async ({ homePage, page }) => {
    // Arrange
    await homePage.navigateToHome();

    // Act
    await homePage.clickGetStartedLink();
    await page.waitForURL('**/docs/intro');
    const url = page.url();

    // Assert
    expect(url).toContain('intro');
  });

  test('should combine POM and direct page interactions', async ({ homePage, page }) => {
    // Arrange
    await homePage.navigateToHome();

    // Act - Using POM
    const links = await homePage.getAllLinks();

    // Assert
    expect(links.length).toBeGreaterThan(0);

    // Act - Using direct page interaction
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

