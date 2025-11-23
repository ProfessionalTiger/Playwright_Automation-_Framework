# Quick Reference - Date/Time Lighthouse Reports

## Common Commands

### Generate New Reports
```bash
npm run test:lighthouse
```
Reports saved to: `test-results/lighthouse-reports/{YYYY-MM-DD}/{HH-MM-SS}/`

### Create Consolidated HTML Report
```bash
npm run report:lighthouse
```
Report created: `playwright-report/lighthouse_reports/index.html`

### View Report
Open `playwright-report/lighthouse_reports/index.html` in your browser

## Report Directory Structure

```
test-results/lighthouse-reports/
├── 2025-11-21/        (Today's date)
│   ├── 15-23-25/      (Morning test)
│   ├── 15-30-42/      (Midday test)
│   └── 16-45-15/      (Afternoon test)
└── 2025-11-20/        (Yesterday's date)
    └── 14-15-30/
        └── lighthouse-[timestamp].json
```

## Report Information

### Summary Statistics
- **Total Reports:** Count of all tests run
- **Avg Performance:** Average score 0-100
- **Avg Accessibility:** Average score 0-100
- **Avg SEO:** Average score 0-100

### Detailed Metrics Per Report
- **URL:** The website tested
- **Performance:** Speed score (🟢 ≥90, 🟠 50-89, 🔴 <50)
- **Accessibility:** A11y score (🟢 ≥90, 🟠 50-89, 🔴 <50)
- **Best Practices:** Best practices score (🟢 ≥90, 🟠 50-89, 🔴 <50)
- **SEO:** SEO score (🟢 ≥90, 🟠 50-89, 🔴 <50)
- **FCP:** First Contentful Paint (milliseconds)
- **LCP:** Largest Contentful Paint (milliseconds)
- **CLS:** Cumulative Layout Shift (unitless)
- **Tested:** Exact timestamp

## Implementation

### Key Methods in lighthouseHelper.ts

```typescript
// Get date/time folder structure
getDateTimePath(): { folder: string; dateTime: string }

// Save report with automatic date/time organization
saveReportWithDateTime(report, filename?)

// Generate HTML from all organized reports
generateConsolidatedReportWithDateTime(reportDir?)

// Save consolidated HTML report
saveConsolidatedReportWithDateTime(outputPath?)
```

### Updated Test File

`tests/lighthouse-simple.spec.ts` now uses:
- `saveReportWithDateTime()` for JSON reports
- `saveConsolidatedReportWithDateTime()` for HTML reports

### Report Generation Script

`scripts/generateLighthouseReport.ts` now uses:
- `saveConsolidatedReportWithDateTime()` to generate HTML from organized reports

## File Locations

| File | Purpose | Location |
|------|---------|----------|
| Test File | Lighthouse test suite | `tests/lighthouse-simple.spec.ts` |
| Helper | Report generation logic | `tests/utils/lighthouseHelper.ts` |
| Script | Standalone report generator | `scripts/generateLighthouseReport.ts` |
| JSON Reports | Raw report data | `test-results/lighthouse-reports/` |
| HTML Report | Consolidated report | `playwright-report/lighthouse_reports/index.html` |
| Setup Guide | Initial setup steps | `LIGHTHOUSE_SETUP.md` |
| Integration Guide | Full integration details | `LIGHTHOUSE_INTEGRATION_SUMMARY.md` |
| DateTime Guide | Date/time organization details | `DATETIME_REPORT_GUIDE.md` |

## Benefits

✅ **Automatic Organization** - Reports automatically sorted by date and time
✅ **Easy Searching** - Find reports from specific dates quickly
✅ **Multiple Tests Per Day** - Each test gets its own time folder
✅ **Historical Tracking** - Keep reports indefinitely for trend analysis
✅ **Professional Reports** - Color-coded HTML dashboard with summaries
✅ **Timestamps Preserved** - Exact time of each test captured

## Workflow

1. **Run Test**
   ```bash
   npm run test:lighthouse
   ```
   ↓ Saves to `test-results/lighthouse-reports/2025-11-21/15-23-25/lighthouse-1763720605867.json`

2. **Generate Report**
   ```bash
   npm run report:lighthouse
   ```
   ↓ Creates `playwright-report/lighthouse_reports/index.html`

3. **View Results**
   - Open HTML file in browser
   - See all reports with summaries and metrics
   - Timestamps show when each test was run

## Example Output

```
✅ Lighthouse audit completed successfully
   Performance: 91/100
   Accessibility: 98/100
   Best Practices: 100/100
   SEO: 92/100
📊 Report saved to: test-results/lighthouse-reports/2025-11-21/15-23-25/lighthouse-1763720605867.json
   Generated at: 2025-11-21 15:23:25

✅ Consolidated report saved to: playwright-report/lighthouse_reports/index.html
```

## Troubleshooting

### No reports generated
- Ensure test-results directory exists
- Check that lighthouse-simple.spec.ts ran successfully
- Verify Node.js and npm are installed

### HTML report is empty
- Run lighthouse tests first: `npm run test:lighthouse`
- Wait for tests to complete (2-3 minutes)
- Then generate report: `npm run report:lighthouse`

### Reports from wrong date/time
- Check system date/time is correct
- Reports use system clock for timestamps
- Correct system time and run tests again

## Advanced Usage

### Run Specific Test
```bash
npx playwright test tests/lighthouse-simple.spec.ts --grep "save report"
```

### View Playwright Report
```bash
npx playwright show-report
```

### Clear Old Reports (Backup First!)
```bash
rm -r test-results/lighthouse-reports/2025-11-20  # Delete old date folder
```

---

**Quick Help:** Run `npm run test:lighthouse && npm run report:lighthouse` to generate fresh reports with date/time organization.
