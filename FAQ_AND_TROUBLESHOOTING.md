# FAQ & Troubleshooting Guide

## ❓ Frequently Asked Questions

### Installation & Setup

**Q: What Node.js versions are supported?**
A: Node.js 18+ or 20+. We recommend using Node.js 20 LTS for best compatibility.

**Q: Do I need to install browsers separately?**
A: Yes, run `npx playwright install` after npm install. For CI/CD, use `npx playwright install --with-deps`.

**Q: Can I use this with a monorepo?**
A: Yes. Adjust the paths in `playwright.config.ts` and import statements as needed.

### Configuration

**Q: How do I add a new environment?**
A: Create a new `.env.{environment}` file with the required variables, then run tests using `cross-env ENV={environment} npm test`.

**Q: Where should I put my base URL?**
A: Set it in the `.env` file under `BASE_URL` or use `baseURL` in `playwright.config.ts`.

**Q: Can I run tests against multiple URLs?**
A: Yes, define multiple URLs in `.env` (DEV_URL, STAGING_URL, PROD_URL) and use them in your tests.

**Q: How do I change the timeout?**
A: Modify `PAGE_TIMEOUT` or `NAVIGATION_TIMEOUT` in `.env` or update `playwright.config.ts`.

### Running Tests

**Q: How do I run a single test?**
A: Use `npx playwright test --grep "test name"` or `npx playwright test tests/example.spec.ts -g "test name"`.

**Q: Can I run tests in parallel?**
A: Yes, by default Playwright runs tests in parallel. Control with `PARALLEL_WORKERS` in `.env` or `--workers` flag.

**Q: How do I run tests in headed mode?**
A: Use `npm run test:headed` or set `HEADLESS=false` in `.env`.

**Q: Can I debug a specific test?**
A: Yes, use `npm run test:debug` to open the Playwright Inspector.

**Q: How do I run tests on a specific browser?**
A: Use `npm run test:chromium`, `npm run test:firefox`, or `npm run test:webkit`.

### Page Object Model

**Q: How do I create a new page object?**
A: Create a new file in `tests/pages/` extending `BasePage` and implement methods for page interactions.

**Q: Should all locators be private?**
A: Yes, make locators `readonly` properties to encapsulate implementation details.

**Q: Can I inherit from my custom page?**
A: Yes, you can create hierarchies. For example, create a `BasePage` -> `AuthenticatedPage` -> `DashboardPage`.

**Q: What's the best way to wait for elements?**
A: Use Playwright's built-in waits like `locator.isVisible()`, `page.waitForURL()`, or `page.waitForLoadState()`.

### Test Data

**Q: Should I hardcode test data in tests?**
A: No, use the provided static data in `testData.json` or generate data with `DataGenerator`.

**Q: How do I generate random data?**
A: Use the `DataGenerator` class. Example: `const user = DataGenerator.generateUser()`.

**Q: Can I add custom data generators?**
A: Yes, add methods to `tests/utils/dataGenerator.ts`.

**Q: Where should I store credentials?**
A: Store credentials in environment variables (`.env` files), never hardcode them.

### Reporting

**Q: Where are test reports saved?**
A: Reports are saved in `playwright-report/` and `test-results/` directories.

**Q: Can I view reports from CI/CD?**
A: Yes, download artifacts from your CI/CD system or configure artifact upload to a storage service.

**Q: How do I enable video recording?**
A: Set `VIDEO_ON_FAILURE=true` in `.env` to record videos of failed tests.

**Q: Can I customize the HTML report?**
A: Yes, modify the reporter configuration in `playwright.config.ts`.

### Fixtures & Utilities

**Q: How do I create a custom fixture?**
A: Add a new fixture in `tests/fixtures/fixtures.ts` extending the base `test`.

**Q: Can I share state between tests?**
A: Use fixtures to set up shared state. For cross-test state, use custom fixtures with setup/teardown.

**Q: Which utility functions are available?**
A: See `tests/utils/helpers.ts` for 50+ utility functions organized by category.

### API Testing

**Q: Can I mock API responses?**
A: Yes, use `mockAPIResponse()` from `globalSetup.ts` or Playwright's `page.route()`.

**Q: How do I measure API response time?**
A: Track `Date.now()` before and after the request, then calculate the difference.

**Q: Can I intercept and log API calls?**
A: Yes, use `interceptAPICalls()` helper from `globalSetup.ts`.

---

## 🐛 Troubleshooting Guide

### Installation Issues

#### Error: "Cannot find module '@playwright/test'"

**Solution:**
```bash
npm install
npx playwright install --with-deps
```

#### Error: "ENOENT: no such file or directory, open '.env'"

**Solution:**
```bash
cp .env .env.local
# Make sure .env exists in the project root
```

#### Browser installation fails

**Solution:**
```bash
# Clear and reinstall browsers
npm run test -- --install-only
# Or
npx playwright install --with-deps chromium firefox webkit
```

### Test Execution Issues

#### Tests timeout

**Solutions:**
1. Increase timeout in `.env`:
   ```env
   PAGE_TIMEOUT=60000
   NAVIGATION_TIMEOUT=60000
   ```

2. Check if application is running and accessible

3. Use `--debug` flag to see what's happening:
   ```bash
   npm run test:debug
   ```

4. Check network conditions - add artificial delay:
   ```bash
   SLOW_MO=1000 npm test
   ```

#### "Target page, context or browser has been closed"

**Solutions:**
- Ensure page is not closed prematurely in your test
- Check for race conditions in your test logic
- Use proper wait mechanisms instead of hard waits

#### Tests pass locally but fail in CI

**Solutions:**
1. Check Node.js version in CI matches local version
2. Install dependencies with `--with-deps` in CI
3. Set `CI=true` environment variable
4. Check for timing issues (use longer timeouts in CI)
5. Verify environment variables are set correctly

#### "Element is not visible"

**Solutions:**
1. Wait for element to be visible:
   ```typescript
   await expect(element).toBeVisible();
   ```

2. Scroll into view if needed:
   ```typescript
   await element.scrollIntoViewIfNeeded();
   ```

3. Check if element is actually on page:
   ```typescript
   const count = await page.locator('selector').count();
   console.log('Elements found:', count);
   ```

### Reporting Issues

#### Report not generated

**Solutions:**
```bash
# Ensure playwright is configured to generate reports
npm test
npm run report

# If file doesn't exist, check playwright.config.ts
```

#### Videos not recording

**Solutions:**
1. Enable video recording in `.env`:
   ```env
   VIDEO_ON_FAILURE=true
   ```

2. Or in `playwright.config.ts`:
   ```typescript
   video: 'retain-on-failure'
   ```

3. Check disk space - video files can be large

#### Screenshots not appearing

**Solutions:**
1. Enable screenshots in `.env`:
   ```env
   SCREENSHOT_ON_FAILURE=true
   ```

2. Verify test actually failed (screenshots only on failure)

3. Check file permissions in reports directory

### Environment & Configuration Issues

#### "Cannot find module" errors

**Solutions:**
1. Check import paths use correct extensions (`.js` for ES modules):
   ```typescript
   import { HomePage } from './pages/homePage.js';
   ```

2. Verify `package.json` has `"type": "module"`

3. Check TypeScript configuration in `tsconfig.json`

#### Wrong environment variables loading

**Solutions:**
1. Verify `.env` file exists and is readable
2. Check if using correct environment file:
   ```bash
   cross-env ENV=staging npm test
   ```

3. Print environment variables to debug:
   ```typescript
   console.log('BASE_URL:', process.env.BASE_URL);
   ```

#### Tests run on wrong browser

**Solutions:**
1. Specify browser explicitly:
   ```bash
   npx playwright test --project=chromium
   ```

2. Or use npm script:
   ```bash
   npm run test:chromium
   ```

3. Check `playwright.config.ts` projects configuration

### Data & Fixture Issues

#### Faker not generating expected data

**Solutions:**
```typescript
// Make sure to import correctly
import { DataGenerator } from '../utils/dataGenerator.js';

// Generate data
const user = DataGenerator.generateUser();
console.log(user); // Verify structure
```

#### Test data file not found

**Solutions:**
```typescript
// Verify import path
import testData from '../fixtures/testData.json' assert { type: 'json' };

// Check file exists at correct location
// tests/fixtures/testData.json
```

#### Fixture not working

**Solutions:**
1. Ensure using correct import:
   ```typescript
   import { test } from '../fixtures/fixtures.js';
   ```

2. Not the built-in Playwright test:
   ```typescript
   // Wrong
   import { test } from '@playwright/test';
   
   // Correct
   import { test } from '../fixtures/fixtures.js';
   ```

### API Testing Issues

#### API request fails

**Solutions:**
```typescript
const response = await request.get(url).catch(err => {
  console.error('Request failed:', err.message);
  throw err;
});

expect(response.ok()).toBeTruthy();
```

#### Can't access response body

**Solutions:**
```typescript
// For JSON responses
const data = await response.json();

// For text responses
const text = await response.text();

// For checking type
const contentType = response.headers()['content-type'];
```

---

## 🆘 Getting Help

### Debug Commands

```bash
# Run with debug inspector
npm run test:debug

# Run single test with full output
npx playwright test tests/example.spec.ts -vv

# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Useful Commands

```bash
# List all tests
npx playwright test --list

# Show Playwright version
npx playwright --version

# Reset/clear cache
npx playwright install --with-deps --clean

# Show configuration
npx playwright test --config
```

### Enable Logging

```bash
# Enable Playwright debug logs
DEBUG=pw:api npm test

# Enable all logs
DEBUG=* npm test
```

### Resources

- **Playwright Docs**: https://playwright.dev
- **Faker.js Docs**: https://fakerjs.dev
- **GitHub Issues**: Create issues in your repository
- **Slack/Discord**: Join Playwright community

---

## ✅ Verification Checklist

Before reporting an issue, verify:

- [ ] Node.js version is 18+ or 20+
- [ ] Dependencies installed: `npm install`
- [ ] Browsers installed: `npx playwright install --with-deps`
- [ ] `.env` file exists and is readable
- [ ] Application under test is running (if needed)
- [ ] Import paths are correct (with `.js` extension)
- [ ] Using custom fixtures, not default Playwright test
- [ ] Test has proper waits (not hard timeouts)
- [ ] No hardcoded credentials or URLs
- [ ] Checked existing issues/documentation

---

## 💡 Performance Tips

1. **Reduce parallel workers** if tests fail intermittently:
   ```env
   PARALLEL_WORKERS=2
   ```

2. **Use `--debug` mode** to understand slow tests

3. **Record only on failure** to save disk space:
   ```env
   VIDEO_ON_FAILURE=true
   ```

4. **Use selective waits** instead of hard timeouts

5. **Reuse browser context** between related tests

---

## 📞 Support

For additional help:
1. Check README.md and QUICKSTART.md
2. Review example tests in tests/ directory
3. Check Playwright official documentation
4. Consult this FAQ & Troubleshooting guide

---

**Last Updated**: November 2025
**Framework Version**: 1.0.0
