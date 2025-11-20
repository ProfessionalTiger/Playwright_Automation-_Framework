# Lighthouse Integration - Quick Start Guide

## ✅ Successfully Integrated!

Google Lighthouse has been successfully integrated into your Playwright Test Automation Framework for comprehensive performance testing.

## What Was Added

### 1. **Dependencies**
Added to your `package.json`:
- `lighthouse` - Main Lighthouse engine
- `chrome-launcher` - Launches Chrome for audits
- `fs-extra` - File system utilities

### 2. **Files Created**

#### `tests/utils/lighthouseHelper.ts`
A comprehensive helper class providing:
- Launch/manage Chrome browser instances
- Run Lighthouse audits on any URL
- Extract performance scores and metrics
- Assert scores and metrics against thresholds
- Generate and save detailed reports
- Print formatted summaries

#### `tests/lighthouse.spec.ts`
Two test suites with 12+ test cases:
- **Lighthouse Performance Audits** (9 tests)
  - Performance, accessibility, best practices, SEO
  - Core Web Vitals validation (FCP, LCP, CLS, TTFB)
  - Detailed report generation

- **Custom Lighthouse Audits** (5 tests)
  - Custom performance thresholds
  - Metric threshold validation
  - Performance category breakdown
  - Trend tracking across multiple audits
  - Bottleneck identification

### 3. **Documentation**
- `LIGHTHOUSE_SETUP.md` - Complete setup and usage guide

### 4. **NPM Scripts**
```json
"test:lighthouse": "playwright test tests/lighthouse.spec.ts --headed"
"test:performance": "playwright test tests/performance.spec.ts"
```

## Quick Start

### Run Lighthouse Tests

```bash
# Run all Lighthouse tests (recommended)
npm run test:lighthouse

# Run in headless mode
npx playwright test tests/lighthouse.spec.ts

# Run specific test
npx playwright test tests/lighthouse.spec.ts --grep "performance audit"

# Run in debug mode
npx playwright test tests/lighthouse.spec.ts --debug
```

### View Results

Reports are saved to:
```
test-results/lighthouse-reports/lighthouse-TIMESTAMP.json
```

View HTML report:
```bash
npm run report
```

## What Gets Tested

### Performance Metrics
- ⚡ **First Contentful Paint (FCP)** - < 1.8s
- ⚡ **Largest Contentful Paint (LCP)** - < 2.5s
- ⚡ **Cumulative Layout Shift (CLS)** - < 0.1
- ⚡ **Time to First Byte (TTFB)** - < 600ms

### Quality Scores (0-100)
- 📊 **Performance** - Load speed and responsiveness
- ♿ **Accessibility** - Usability for all users
- ✅ **Best Practices** - Security and performance standards
- 🔍 **SEO** - Search engine optimization

## Example Test Output

```
📊 Lighthouse Report Summary
==================================================
URL: https://playwright.dev
Time: 2024-11-20T15:30:45.123Z

📈 Performance Scores:
  Performance:     92/100
  Accessibility:   92/100
  Best Practices:  100/100
  SEO:             100/100

⚡ Core Web Vitals:
  FCP:   1245.56ms
  LCP:   2145.23ms
  CLS:   0.015
  TTFB:  445.12ms
==================================================
```

## Using in Your Tests

### Simple Performance Check
```typescript
test('should have good performance', async () => {
  const report = await lighthouseHelper.generateReport('https://example.com');
  expect(report.scores.performance).toBeGreaterThanOrEqual(70);
});
```

### Custom Thresholds
```typescript
test('should meet custom thresholds', async () => {
  const report = await lighthouseHelper.generateReport('https://example.com');
  
  const result = lighthouseHelper.assertScoresAboveThreshold(
    report.scores,
    {
      performance: 80,
      accessibility: 90,
      bestPractices: 85,
      seo: 90,
    }
  );
  
  expect(result.passed).toBe(true);
});
```

### Core Web Vitals Testing
```typescript
test('should meet Core Web Vitals', async () => {
  const report = await lighthouseHelper.generateReport('https://example.com');
  
  expect(report.metrics.fcp).toBeLessThan(1800);  // FCP
  expect(report.metrics.lcp).toBeLessThan(2500);  // LCP
  expect(report.metrics.cls).toBeLessThan(0.1);   // CLS
});
```

## Key Features

✅ **Automated Audits** - Lighthouse runs automatically  
✅ **Multiple Metrics** - Performance, accessibility, best practices, SEO  
✅ **Core Web Vitals** - Test critical user experience metrics  
✅ **Custom Thresholds** - Set your own performance standards  
✅ **Report Generation** - JSON reports saved for analysis  
✅ **Trend Tracking** - Monitor performance over time  
✅ **CI/CD Ready** - Integrates with GitHub Actions, Jenkins, etc.  
✅ **Detailed Logging** - Console output for debugging  

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run test:lighthouse` | Run all Lighthouse tests with browser visible |
| `npx playwright test tests/lighthouse.spec.ts` | Run headless |
| `npm run test:performance` | Run performance tests |
| `npm test` | Run all tests |
| `npm run report` | View HTML test report |

## Next Steps

1. **Customize Thresholds** - Edit thresholds in `tests/lighthouse.spec.ts` to match your requirements
2. **Test Your URLs** - Add your own URLs to test
3. **Set Up CI/CD** - Add Lighthouse tests to GitHub Actions
4. **Monitor Trends** - Analyze saved reports to track performance changes
5. **Performance Optimization** - Use Lighthouse suggestions to improve your site

## Troubleshooting

### Tests taking too long?
- Lighthouse audits take time. This is normal (2-5 minutes per URL)
- Run with fewer parallel workers: `npx playwright test --workers 1`

### Chrome not found?
```bash
npx playwright install chromium
```

### Port already in use?
Edit `tests/utils/lighthouseHelper.ts`:
```typescript
private chromePort: number = 9223; // Change port number
```

## Documentation

For complete documentation, see: **LIGHTHOUSE_SETUP.md**

## Summary

Your Playwright framework now has enterprise-grade performance testing capabilities powered by Google Lighthouse. You can:

- Audit performance automatically
- Test accessibility compliance
- Verify best practices
- Check SEO optimization
- Validate Core Web Vitals
- Generate detailed reports
- Track performance trends

**Happy testing!** 🚀

---

Questions? Check `LIGHTHOUSE_SETUP.md` for detailed documentation.
