# Playwright Test Automation Framework

A comprehensive, production-ready test automation framework built with Playwright and JavaScript/TypeScript ES modules.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Page Object Model](#page-object-model)
- [Test Data Management](#test-data-management)
- [Utilities and Helpers](#utilities-and-helpers)
- [Custom Fixtures](#custom-fixtures)
- [API Testing](#api-testing)
- [Reporting](#reporting)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## ✨ Features

### Core Components

1. **Page Object Model (POM)** - Encapsulated page interactions for reusability
2. **Test Data Management** - JSON fixtures and Faker-generated dynamic data
3. **Custom Utilities** - Helper functions for dates, strings, retries, and more
4. **Environment Configuration** - Multi-environment support (dev, staging, prod)
5. **HTML Reporting** - Comprehensive test reports with screenshots and videos
6. **CI/CD Integration** - GitHub Actions workflows for automated testing
7. **Custom Fixtures** - Setup/teardown logic and reusable test fixtures
8. **Cross-Browser Testing** - Chromium, Firefox, and WebKit support
9. **API Testing** - Full API testing capabilities
10. **Performance Testing** - Web vitals and performance metrics
11. **Google Lighthouse Integration** - Automated performance, accessibility, SEO audits

### Bonus Features

- Parallel test execution
- Video recording on failure
- Screenshots on failure
- Trace recording for debugging
- Custom test hooks
- Mock API responses
- Response time measurement

## 📁 Project Structure

```
tests/
├── pages/
│   ├── basePage.ts          # Base page class with common methods
│   ├── homePage.ts          # Home page POM
│   └── searchPage.ts        # Search page POM
├── utils/
│   ├── helpers.ts           # Utility functions (dates, strings, etc.)
│   └── dataGenerator.ts     # Faker-based test data generation
├── fixtures/
│   ├── testData.json        # Static test data
│   ├── fixtures.ts          # Custom test fixtures
│   └── globalSetup.ts       # Global setup/teardown
├── reports/
│   └── test-results/        # Test results and artifacts
├── example.spec.ts          # Example tests (POM + utilities)
├── api.spec.ts              # API testing examples
└── performance.spec.ts      # Performance testing examples
```

## 🚀 Installation

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Setup

```bash
# Clone or navigate to project directory
cd d:\PlayWrite\Project_Test

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# (Optional) Install browsers with dependencies for CI/CD
npx playwright install --with-deps
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root (or copy from `.env` template):

```env
# Application Environment
ENV=dev

# Base URLs
BASE_URL=http://localhost:3000
DEV_URL=http://localhost:3000
STAGING_URL=https://staging.example.com
PROD_URL=https://example.com

# Browser Configuration
BROWSER=chromium
HEADLESS=true
SLOW_MO=0

# Test Configuration
PARALLEL_WORKERS=4
RETRIES=0
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true

# Timeouts (in milliseconds)
PAGE_TIMEOUT=30000
NAVIGATION_TIMEOUT=30000
```

### Multiple Environment Profiles

- `.env` - Default development environment
- `.env.staging` - Staging environment configuration
- `.env.prod` - Production environment configuration

To use a specific environment:

```bash
# Run with staging environment
cross-env ENV=staging npm test

# Run with production environment
cross-env ENV=prod npm test
```

### Playwright Configuration

Edit `playwright.config.ts` to customize:

- Timeout settings
- Reporter options
- Browser configurations
- Network conditions
- Device emulation

## 🧪 Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run with debug mode
npm run test:debug

# Run in headed mode (see browser)
npm run test:headed

# Run specific test file
npx playwright test tests/example.spec.ts
```

### Browser-Specific Tests

```bash
# Run only Chromium
npm run test:chromium

# Run only Firefox
npm run test:firefox

# Run only WebKit
npm run test:webkit

# Run on all browsers
npm run test:all-browsers
```

### Environment-Specific Tests

```bash
# Run tests on dev environment
npm run test:dev

# Run tests on staging environment
npm run test:staging

# Run tests on production environment
npm run test:prod
```

### Advanced Options

```bash
# Run specific test with grep pattern
npx playwright test --grep "Home Page"

# Run tests in reverse order
npx playwright test --order-reversed

# Run with specific number of workers
npx playwright test --workers 2

# Run single test file
npx playwright test tests/example.spec.ts

# Run tests matching pattern
npx playwright test tests/example.spec.ts -g "should display"
```

## 📄 Page Object Model

### Base Page Class

All page objects extend `BasePage` which provides:

```typescript
// Navigation
async goto(url: string): Promise<void>

// Page info
async getPageTitle(): Promise<string>
async getCurrentURL(): Promise<string>

// Utilities
async wait(ms: number): Promise<void>
async takeScreenshot(filename: string): Promise<void>
async closePage(): Promise<void>
```

### Creating a New Page Object

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './basePage.js';

export class LoginPage extends BasePage {
  readonly usernameInput = '[name="username"]';
  readonly passwordInput = '[name="password"]';
  readonly loginButton = 'button[type="submit"]';

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
    await this.page.waitForURL('**/dashboard');
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.page.locator(this.usernameInput).isVisible();
  }
}
```

### Using Page Objects in Tests

```typescript
test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigateToHome();
  await loginPage.login('testuser', 'password123');
  
  // Verify logged in state
});
```

## 🗂️ Test Data Management

### Static Test Data

Use `tests/fixtures/testData.json`:

```typescript
import testData from '../fixtures/testData.json' assert { type: 'json' };

test('search with predefined keyword', async ({ searchPage }) => {
  const keyword = testData.searchKeywords[0]; // "JavaScript"
  await searchPage.search(keyword);
});
```

### Dynamic Test Data with Faker

```typescript
import { DataGenerator } from '../utils/dataGenerator.js';

test('create user with random data', async ({ page }) => {
  const user = DataGenerator.generateUser();
  const email = DataGenerator.generateEmail();
  const product = DataGenerator.generateProduct();
  
  // Use generated data in test
});
```

### Available Data Generators

- `generateUser()` - Random user with name, email, password, etc.
- `generateProduct()` - Random product data
- `generateCompany()` - Random company data
- `generateArticle()` - Random article/blog content
- `generateSearchQueries(count)` - Multiple search queries
- `generateEmail()` - Random email address
- `generatePhoneNumber()` - Random phone number
- `generateRandomString(length)` - Random alphanumeric string
- `generateRandomNumber(min, max)` - Random number in range
- `generateFutureDate(years)` - Date in the future
- `generatePastDate(years)` - Date in the past

## 🛠️ Utilities and Helpers

### Date Functions

```typescript
import { 
  getTodayDate, 
  formatDate, 
  addDays, 
  subtractDays,
  getDaysDifference,
  isFutureDate,
  isPastDate 
} from '../utils/helpers.js';

// Get today's date
const today = getTodayDate('YYYY-MM-DD');

// Format a date
const formatted = formatDate(new Date(), 'DD/MM/YYYY');

// Add/subtract days
const tomorrow = addDays(1);
const yesterday = subtractDays(1);

// Check date relationships
const isFuture = isFutureDate(new Date(Date.now() + 86400000));
```

### String Functions

```typescript
import {
  toLowerCase,
  toUpperCase,
  capitalizeString,
  trimString,
  containsString,
  generateRandomString
} from '../utils/helpers.js';

const capitalized = capitalizeString('playwright'); // "Playwright"
const randomStr = generateRandomString(10);
```

### Execution Control

```typescript
import { delay, retry, waitForCondition } from '../utils/helpers.js';

// Delay execution
await delay(1000);

// Retry a function with exponential backoff
const result = await retry(
  () => fetchData(),
  3, // max attempts
  1000 // initial delay
);

// Wait for condition
const success = await waitForCondition(
  () => element.isVisible(),
  5000, // timeout
  100 // check interval
);
```

### Object Functions

```typescript
import {
  deepClone,
  isEmptyObject,
  mergeObjects,
  parseJSON
} from '../utils/helpers.js';

const cloned = deepClone(originalObject);
const merged = mergeObjects(obj1, obj2);
const parsed = parseJSON(jsonString, defaultValue);
```

## 🔧 Custom Fixtures

### Using Built-in Fixtures

```typescript
import { test, expect } from './fixtures/fixtures.js';

test('with HomePage fixture', async ({ homePage }) => {
  await homePage.navigateToHome();
  await expect(homePage.page).toHaveTitle(/Playwright/);
});

test('with authenticated page', async ({ authenticatedPage }) => {
  // Page is already logged in
  await authenticatedPage.goto('/dashboard');
});
```

### Creating Custom Fixtures

Add to `tests/fixtures/fixtures.ts`:

```typescript
export const test = base.extend<CustomFixtures>({
  myFixture: async ({ page }, use) => {
    // Setup
    console.log('Setting up myFixture');
    const data = { foo: 'bar' };
    
    // Use fixture
    await use(data);
    
    // Teardown
    console.log('Cleaning up myFixture');
  },
});
```

## 🔌 API Testing

### Basic API Requests

```typescript
test('should make API request', async ({ request }) => {
  const response = await request.get('https://api.example.com/users');
  
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.length).toBeGreaterThan(0);
});
```

### With Headers and Data

```typescript
test('should POST with data', async ({ request }) => {
  const response = await request.post('https://api.example.com/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    headers: {
      'Authorization': 'Bearer token123'
    }
  });
  
  expect(response.status()).toBe(201);
});
```

### Measuring Performance

```typescript
test('should measure response time', async ({ request }) => {
  const start = Date.now();
  const response = await request.get('https://api.example.com/data');
  const duration = Date.now() - start;
  
  expect(duration).toBeLessThan(1000); // Should respond in under 1s
});
```

## 📊 Reporting

### HTML Report

After running tests, generate and view the HTML report:

```bash
npm run report
```

Report includes:
- Test results summary
- Pass/fail status
- Screenshots on failure
- Video recordings
- Execution time per test
- Browser and OS information

### Report Files

- `playwright-report/` - HTML report
- `test-results/` - JSON and XML test results
- `test-results/videos/` - Recorded videos (on failure)
- `test-results/har.har` - HTTP Archive for network inspection

### Custom Report Configuration

In `playwright.config.ts`:

```typescript
reporter: [
  ['html', { outputFolder: 'playwright-report' }],
  ['json', { outputFile: 'test-results/results.json' }],
  ['junit', { outputFile: 'test-results/junit.xml' }],
  ['list'],
]
```

## 🔄 CI/CD Integration

### GitHub Actions Workflows

The framework includes two workflows:

1. **playwright-tests.yml** - Runs on push and PR
   - Tests across Node 18 and 20
   - Tests across Chromium, Firefox, WebKit
   - Tests on dev and staging environments
   - Artifact uploads

2. **prod-tests.yml** - Scheduled production tests
   - Runs every 6 hours
   - Tests production environment only
   - Slack notifications on failure

### Running Workflows Locally

```bash
# Install act (GitHub Actions local runner)
choco install act-cli

# Run workflow
act push -j test
```

### Integrating with Other CI Systems

#### Jenkins

```groovy
stage('Playwright Tests') {
  steps {
    sh 'npm install'
    sh 'npx playwright install --with-deps'
    sh 'npm test'
  }
  post {
    always {
      junit 'test-results/junit.xml'
      publishHTML([
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'Playwright Report'
      ])
    }
  }
}
```

#### Azure DevOps

```yaml
- script: |
    npm install
    npx playwright install --with-deps
    npm test
  displayName: 'Run Playwright Tests'

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: 'test-results/junit.xml'
    searchFolder: '$(System.DefaultWorkingDirectory)'
```

## ✅ Best Practices

### Test Structure

```typescript
test('should perform specific action', async ({ page, homePage }) => {
  // Arrange - Setup test data and page state
  const testData = DataGenerator.generateUser();
  await homePage.navigateToHome();

  // Act - Perform the action
  await homePage.clickGetStartedLink();

  // Assert - Verify expected outcomes
  await expect(page).toHaveURL('**/docs/intro');
});
```

### POM Best Practices

1. **Keep locators private** - Use readonly properties
2. **Method names should describe actions** - Use verbs like `click`, `fill`, `submit`
3. **Return meaningful values** - Methods should return data needed for assertions
4. **Avoid test logic in pages** - Pages should only interact with the UI
5. **Group related methods** - Organize methods by functionality

```typescript
// Good ✅
async fillLoginForm(username: string, password: string): Promise<void> {
  await this.page.fill(this.usernameInput, username);
  await this.page.fill(this.passwordInput, password);
}

async submitLoginForm(): Promise<void> {
  await this.page.click(this.submitButton);
  await this.page.waitForURL('**/dashboard');
}

// Bad ❌
async doLogin(u: string, p: string): Promise<void> {
  // Test logic embedded in page
  if (!u) throw new Error('Username required');
  // ...
}
```

### Test Data Management

1. **Use fixtures for static data** - testData.json for common values
2. **Use Faker for dynamic data** - Generate unique data per test run
3. **Never hardcode credentials** - Use environment variables
4. **Create test data builder** - Reusable data construction

```typescript
// Good ✅
const user = DataGenerator.generateUser();
const credentials = process.env.TEST_USERNAME;

// Bad ❌
const user = { name: 'John', email: 'john@test.com' };
const credentials = 'hardcoded_user';
```

### Assertions

1. **Use specific assertions** - `toBeVisible()` over `toBeTruthy()`
2. **Test user-visible behavior** - Not implementation details
3. **Keep assertions close to actions** - Don't accumulate assertions

```typescript
// Good ✅
await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
await expect(page).toHaveURL('**/success');

// Bad ❌
expect(element).toBeTruthy();
expect(page.url()).toContain('/success');
```

### Waits and Timeouts

1. **Avoid hard waits** - Use automatic waits when possible
2. **Use proper wait methods** - `waitForURL`, `waitForLoadState`, `locator.isVisible()`
3. **Set appropriate timeouts** - Balance between reliability and speed

```typescript
// Good ✅
await page.waitForURL('**/dashboard');
await expect(page.getByRole('heading')).toBeVisible();

// Bad ❌
await page.waitForTimeout(5000);
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Faker.js Documentation](https://fakerjs.dev)
- [Page Object Model Pattern](https://en.wikipedia.org/wiki/Page_object_model)
- [Test Automation Best Practices](https://testautomationu.applitools.com/)

## 🐛 Troubleshooting

### Tests fail locally but pass in CI

- Check Node version compatibility
- Verify `.env` file configuration
- Ensure all dependencies are installed
- Check for timing issues in headless mode

### Playwright browsers not found

```bash
# Reinstall browsers
npx playwright install --with-deps chromium firefox webkit
```

### Timeout errors

1. Increase timeout in `.env` or `playwright.config.ts`
2. Check if application is responding
3. Use `--debug` flag to identify slow operations
4. Check network conditions

## 📝 License

ISC

## 👥 Contributing

1. Create feature branch
2. Implement changes following best practices
3. Write/update tests
4. Submit pull request

---

**Created with ❤️ using Playwright**
