# Google Lighthouse Integration Guide

## Overview

This framework now includes **Google Lighthouse** integration for comprehensive performance testing and web quality audits. Lighthouse audits automatically test your site's performance, accessibility, best practices, and SEO.

## What is Lighthouse?

Google Lighthouse is an automated tool for improving web page quality. It runs a series of audits against a page and generates a report with performance metrics, accessibility issues, and best practices recommendations.

### Key Metrics Measured

**Performance Scores (0-100):**
- **Performance** - How fast your page loads and becomes interactive
- **Accessibility** - How accessible your site is to users with disabilities
- **Best Practices** - Best practices for modern web development
- **SEO** - Search engine optimization best practices
- **PWA** - Progressive Web App capabilities

**Core Web Vitals:**
- **FCP** (First Contentful Paint) - Time until first content appears (< 1.8s is good)
- **LCP** (Largest Contentful Paint) - Time until largest content appears (< 2.5s is good)
- **CLS** (Cumulative Layout Shift) - Visual stability (< 0.1 is good)
- **TTFB** (Time to First Byte) - Server response time (< 600ms is good)

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install the Lighthouse packages:
- `lighthouse` - Main Lighthouse engine
- `chrome-launcher` - Launches Chrome for audits
- `fs-extra` - File system utilities

### 2. Verify Installation

```bash
npm list lighthouse
npm list chrome-launcher
```

## Usage

### Run Lighthouse Tests

**Run all Lighthouse tests:**
```bash
npm run test:lighthouse
```

**Run specific test:**
```bash
npx playwright test tests/lighthouse.spec.ts --grep "should pass Lighthouse performance audit"
```

**Run in headed mode (see browser):**
```bash
npx playwright test tests/lighthouse.spec.ts --headed
```

**Run in debug mode:**
```bash
npx playwright test tests/lighthouse.spec.ts --debug
```

### Test Files

- `tests/lighthouse.spec.ts` - Main Lighthouse audit tests
- `tests/utils/lighthouseHelper.ts` - Lighthouse helper utilities

## API Reference

### LighthouseHelper Class

#### Methods

```typescript
// Launch Chrome browser for Lighthouse
async launchChrome(): Promise<number>

// Kill Chrome browser
async killChrome(): Promise<void>

// Run Lighthouse audit on a URL
async runAudit(url: string, options?: any): Promise<any>

// Generate complete report
async generateReport(url: string, options?: any): Promise<LighthouseReport>

// Save report to JSON file
async saveReport(report: LighthouseReport, filename: string): Promise<void>

// Assert scores meet thresholds
assertScoresAboveThreshold(
  scores: LighthouseScore,
  thresholds: Partial<LighthouseScore>
): { passed: boolean; issues: string[] }

// Assert metrics meet thresholds
assertMetricsBelowThreshold(
  metrics: LighthouseMetrics,
  thresholds: Partial<LighthouseMetrics>
): { passed: boolean; issues: string[] }

// Print formatted report summary
printReportSummary(report: LighthouseReport): void
```

### Interfaces

```typescript
interface LighthouseScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa?: number;
}

interface LighthouseMetrics {
  fcp: number;      // First Contentful Paint
  lcp: number;      // Largest Contentful Paint
  cls: number;      // Cumulative Layout Shift
  fid: number;      // First Input Delay
  inp: number;      // Interaction to Next Paint
  ttfb: number;     // Time to First Byte
}

interface LighthouseReport {
  url: string;
  timestamp: string;
  scores: LighthouseScore;
  metrics: LighthouseMetrics;
  rawAudits: any;
}
```

## Usage Examples

### Basic Performance Test

```typescript
import { test, expect } from './fixtures/fixtures.js';
import { lighthouseHelper } from './utils/lighthouseHelper.js';

test('should have good performance', async () => {
  const report = await lighthouseHelper.generateReport('https://example.com');
  
  expect(report.scores.performance).toBeGreaterThanOrEqual(70);
  console.log(`Performance: ${report.scores.performance}/100`);
});
```

### Test with Custom Thresholds

```typescript
test('should meet custom performance thresholds', async () => {
  const report = await lighthouseHelper.generateReport('https://example.com');
  
  const thresholds = {
    performance: 80,
    accessibility: 90,
    bestPractices: 85,
    seo: 85,
  };
  
  const result = lighthouseHelper.assertScoresAboveThreshold(
    report.scores,
    thresholds
  );
  
  if (!result.passed) {
    console.warn('Issues:', result.issues);
  }
  expect(result.passed).toBe(true);
});
```

### Test Core Web Vitals

```typescript
test('should meet Core Web Vitals standards', async () => {
  const report = await lighthouseHelper.generateReport('https://example.com');
  const metrics = report.metrics;
  
  expect(metrics.fcp).toBeLessThan(1800);  // FCP < 1.8s
  expect(metrics.lcp).toBeLessThan(2500);  // LCP < 2.5s
  expect(metrics.cls).toBeLessThan(0.1);   // CLS < 0.1
});
```

### Save and Analyze Reports

```typescript
test('should generate and save performance report', async () => {
  const report = await lighthouseHelper.generateReport('https://example.com');
  
  // Save report to file
  await lighthouseHelper.saveReport(report, `report-${Date.now()}.json`);
  
  // Print summary
  lighthouseHelper.printReportSummary(report);
});
```

## Report Storage

Lighthouse reports are automatically saved to:
```
test-results/lighthouse-reports/
```

Reports are stored as JSON files with timestamp in filename:
```
lighthouse-1700000000000.json
```

You can analyze these reports for performance trends over time.

## Default Performance Thresholds

The framework includes reasonable defaults for different metrics:

### Performance Scores
- **Performance:** 50/100 (minimum)
- **Accessibility:** 50/100 (minimum)
- **Best Practices:** 50/100 (minimum)
- **SEO:** 50/100 (minimum)

### Core Web Vitals
- **FCP:** 1800ms (1.8 seconds)
- **LCP:** 2500ms (2.5 seconds)
- **CLS:** 0.1 (cumulative shift)
- **TTFB:** 600ms (time to first byte)
- **FID:** 100ms (first input delay)
- **INP:** 200ms (interaction to next paint)

## Customizing Thresholds

Modify thresholds in your tests:

```typescript
// For scores
const customThresholds: Partial<LighthouseScore> = {
  performance: 80,
  accessibility: 95,
  bestPractices: 90,
  seo: 90,
};

// For metrics
const metricThresholds: Partial<LighthouseMetrics> = {
  fcp: 1500,
  lcp: 2000,
  cls: 0.05,
  ttfb: 400,
};
```

## CI/CD Integration

### GitHub Actions Example

Add to `.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse Audit

on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm install
      - name: Run Lighthouse tests
        run: npm run test:lighthouse
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-reports
          path: test-results/lighthouse-reports/
```

## Troubleshooting

### Chrome/Chromium Not Found

If you get errors about Chrome not being found:

```bash
# Install Playwright browsers
npx playwright install chromium

# Or reinstall with system dependencies
npx playwright install --with-deps chromium
```

### Port Already in Use

If port 9222 is already in use:

```typescript
// Modify the port in lighthouseHelper.ts
private chromePort: number = 9223; // Change to different port
```

### Audit Timeout

Lighthouse audits may take time. Increase the Playwright timeout:

```typescript
test.setTimeout(120000); // 2 minutes
```

### SSL/TLS Issues

For HTTPS sites with certificate issues:

```typescript
const report = await lighthouseHelper.generateReport(url, {
  disableStorageReset: false,
});
```

## Performance Optimization Tips

Based on Lighthouse reports, consider:

### For Performance
- Minimize JavaScript
- Optimize images
- Enable compression
- Use lazy loading
- Cache resources

### For Accessibility
- Add alt text to images
- Use proper heading hierarchy
- Ensure color contrast
- Add ARIA labels where needed

### For Best Practices
- Keep dependencies updated
- Use HTTPS everywhere
- Avoid deprecated APIs
- Implement proper error handling

### For SEO
- Add meta descriptions
- Use structured data
- Ensure mobile-friendly design
- Create XML sitemap

## Best Practices

1. **Regular Audits** - Run Lighthouse tests as part of CI/CD
2. **Track Trends** - Save reports and analyze trends over time
3. **Set Realistic Thresholds** - Different sites have different requirements
4. **Test Multiple URLs** - Audit key pages, not just homepage
5. **Test Different Scenarios** - Test on different networks and devices
6. **Monitor Regressions** - Alert on significant score drops

## Integrated Tests

The framework includes pre-built Lighthouse tests:

- ✅ Performance audit
- ✅ Accessibility standards
- ✅ Best practices compliance
- ✅ SEO assessment
- ✅ Core Web Vitals validation
- ✅ Custom threshold testing
- ✅ Performance bottleneck detection
- ✅ Multi-audit trending

## Additional Resources

- [Google Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Lighthouse Architecture](https://github.com/GoogleChrome/lighthouse/blob/main/docs/architecture.md)
- [Performance Best Practices](https://web.dev/performance/)

---

**Get started:** Run `npm run test:lighthouse` to execute the first Lighthouse audit!
