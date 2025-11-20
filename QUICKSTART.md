# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
npx playwright install
```

### 2. Configure Environment

Copy `.env` to `.env.local` and update `BASE_URL` to your application:

```bash
cp .env .env.local
```

Edit `.env.local`:
```env
BASE_URL=http://localhost:3000
```

### 3. Run Your First Test

```bash
# Run all tests
npm test

# Or specific test file
npx playwright test tests/example.spec.ts

# Or in headed mode
npm run test:headed
```

### 4. View Results

```bash
npm run report
```

## 📖 Common Tasks

### Create a New Test

Create `tests/myTest.spec.ts`:

```typescript
import { test, expect } from './fixtures/fixtures.js';
import { HomePage } from './pages/homePage.js';

test('my first test', async ({ homePage }) => {
  await homePage.navigateToHome();
  await expect(homePage.page).toHaveTitle(/Playwright/);
});
```

### Create a New Page Object

Create `tests/pages/myPage.ts`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './basePage.js';

export class MyPage extends BasePage {
  readonly myButton = 'button#my-button';

  async clickMyButton(): Promise<void> {
    await this.page.click(this.myButton);
  }
}
```

### Use Test Data

```typescript
import { DataGenerator } from './utils/dataGenerator.js';
import { getTodayDate } from './utils/helpers.js';

test('use test data', async ({ page }) => {
  const user = DataGenerator.generateUser();
  const date = getTodayDate('DD/MM/YYYY');
  
  console.log(user.email, date);
});
```

### Run Tests by Environment

```bash
npm run test:dev      # Development
npm run test:staging  # Staging
npm run test:prod     # Production
```

### Run Tests by Browser

```bash
npm run test:chromium # Chrome
npm run test:firefox  # Firefox
npm run test:webkit   # Safari
```

## 🔗 Key Files

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Framework configuration |
| `.env` | Environment variables |
| `tests/pages/` | Page Object Models |
| `tests/utils/helpers.ts` | Utility functions |
| `tests/fixtures/testData.json` | Static test data |
| `.github/workflows/` | CI/CD pipelines |

## 💡 Tips & Tricks

### Debug a Test

```bash
npm run test:debug
```

### Run a Single Test

```bash
npx playwright test --grep "specific test name"
```

### Generate Data

```typescript
const user = DataGenerator.generateUser();      // Random user
const queries = DataGenerator.generateSearchQueries(5); // 5 queries
const email = DataGenerator.generateEmail();    // Random email
```

### Measure Dates

```typescript
import { addDays, formatDate, getTodayDate } from './utils/helpers.js';

const today = getTodayDate();      // Today's date
const tomorrow = addDays(1);       // Tomorrow
const nextWeek = addDays(7);       // Next week
```

## ⚙️ Configuration

### Change Browser

Edit `.env`:
```env
BROWSER=firefox  # or webkit
HEADLESS=false   # Show browser window
```

### Change Timeouts

Edit `.env`:
```env
PAGE_TIMEOUT=60000        # 60 seconds
NAVIGATION_TIMEOUT=30000  # 30 seconds
```

### Enable Screenshots

Edit `.env`:
```env
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
```

## 📊 View Reports

After running tests:

```bash
npm run report
```

Open `playwright-report/index.html` in browser.

## 🆘 Troubleshooting

### Tests won't run

```bash
# Reinstall everything
rm -rf node_modules
npm install
npx playwright install --with-deps
```

### Timeout errors

Increase timeout in `.env`:
```env
PAGE_TIMEOUT=60000
NAVIGATION_TIMEOUT=60000
```

### Browser won't start

```bash
# Reinstall browsers
npx playwright install --with-deps chromium
```

## 📚 Next Steps

1. Read [README.md](./README.md) for comprehensive documentation
2. Check [tests/example.spec.ts](./tests/example.spec.ts) for examples
3. Review [tests/pages/homePage.ts](./tests/pages/homePage.ts) for POM pattern
4. Explore [tests/utils/helpers.ts](./tests/utils/helpers.ts) for utilities

## 🎯 Command Reference

```bash
npm test                    # Run all tests
npm run test:debug         # Debug mode
npm run test:headed        # Show browser
npm run test:chromium      # Chrome only
npm run test:all-browsers  # All browsers
npm run test:dev           # Dev environment
npm run test:staging       # Staging environment
npm run test:prod          # Production environment
npm run report             # View HTML report
```

Happy testing! 🎉
