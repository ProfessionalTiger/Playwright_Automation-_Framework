import { chromium, firefox, webkit, Browser, BrowserContext, Page } from '@playwright/test';

/**
 * Global setup file for hooks and global fixtures
 * This runs once before all tests
 */
export async function globalSetup() {
  console.log('\n🚀 Starting global setup...\n');

  // Initialize any global resources
  // Example: Start test server, set up database, etc.
  
  console.log('✅ Global setup completed\n');
}

/**
 * Global teardown file
 * This runs once after all tests
 */
export async function globalTeardown() {
  console.log('\n🧹 Starting global teardown...\n');

  // Clean up any global resources
  // Example: Stop test server, close database connections, etc.
  
  console.log('✅ Global teardown completed\n');
}

/**
 * Browser context setup helper
 */
export async function setupBrowserContext(browser: Browser): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({
    recordVideo: { dir: 'test-results/videos' },
    recordHar: { path: 'test-results/har.har' },
  });

  const page = await context.newPage();
  return { context, page };
}

/**
 * Login helper for authenticated tests
 */
export async function loginUser(page: Page, username: string, password: string) {
  // Example login implementation - customize based on your app
  // await page.goto('/login');
  // await page.fill('[name="username"]', username);
  // await page.fill('[name="password"]', password);
  // await page.click('button[type="submit"]');
  // await page.waitForURL('**/dashboard');
}

/**
 * Logout helper
 */
export async function logoutUser(page: Page) {
  // Example logout implementation - customize based on your app
  // await page.click('[aria-label="User menu"]');
  // await page.click('text=Logout');
  // await page.waitForURL('**/login');
}

/**
 * Clear browser storage (cookies, local storage, session storage)
 */
export async function clearBrowserStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.context().clearCookies();
}

/**
 * Mock API response
 */
export async function mockAPIResponse(page: Page, urlPattern: string | RegExp, response: unknown) {
  await page.route(urlPattern, async (route) => {
    await route.abort();
    await route.continue({ response: { status: 200, body: JSON.stringify(response) } });
  });
}

/**
 * Intercept and log API calls
 */
export async function interceptAPICalls(page: Page) {
  const apiCalls: Array<{ url: string; method: string; status?: number }> = [];

  page.on('request', (request) => {
    if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
      console.log(`📡 API Request: ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', (response) => {
    if (response.request().resourceType() === 'xhr' || response.request().resourceType() === 'fetch') {
      apiCalls.push({
        url: response.url(),
        method: response.request().method(),
        status: response.status(),
      });
      console.log(`📡 API Response: ${response.status()} ${response.url()}`);
    }
  });

  return apiCalls;
}
