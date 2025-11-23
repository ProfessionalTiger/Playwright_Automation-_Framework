# Date/Time Based Lighthouse Report Generation

## Overview
Your Lighthouse testing framework now generates reports organized by date and time, making it easy to track performance metrics over time.

## Report Structure

### Directory Organization
Reports are automatically saved in a `YYYY-MM-DD/HH-MM-SS` directory structure:

```
test-results/
└── lighthouse-reports/
    ├── 2025-11-21/           # Date folder (YYYY-MM-DD)
    │   ├── 15-23-25/         # Time folder (HH-MM-SS)
    │   │   └── lighthouse-1763720605867.json
    │   └── 15-30-42/         # Multiple times on same date
    │       └── lighthouse-1763721042123.json
    └── 2025-11-20/           # Previous date
        └── 14-15-30/
            └── lighthouse-1763633730456.json
```

## Usage

### Generate Reports with Date/Time
When you run the Lighthouse test, reports are automatically saved with date/time organization:

```bash
npm run test:lighthouse
# or
npx playwright test tests/lighthouse-simple.spec.ts
```

**Output:**
```
📊 Report saved to: ...test-results/lighthouse-reports/2025-11-21/15-23-25/lighthouse-1763720605867.json
   Generated at: 2025-11-21 15:23:25
```

### Generate Consolidated HTML Report
After running tests, create a consolidated HTML report from all saved reports:

```bash
npm run report:lighthouse
# or
npx ts-node scripts/generateLighthouseReport.ts
```

**Output:**
- **Location:** `playwright-report/lighthouse_reports/index.html`
- **Contains:** All reports organized by date, with summary statistics and detailed performance metrics
- **Generated:** Includes timestamp of when consolidated report was created

## Report Features

### Summary Dashboard
The consolidated report displays:
- **Total Reports:** Number of tests run
- **Avg Performance:** Average performance score across all reports
- **Avg Accessibility:** Average accessibility score
- **Avg SEO:** Average SEO score

### Detailed Results Table
Shows each report with:
- **URL:** The website tested
- **Performance:** Lighthouse performance score (0-100)
- **Accessibility:** Lighthouse accessibility score (0-100)
- **Best Practices:** Best practices compliance (0-100)
- **SEO:** SEO score (0-100)
- **FCP:** First Contentful Paint (milliseconds)
- **LCP:** Largest Contentful Paint (milliseconds)
- **CLS:** Cumulative Layout Shift (unitless)
- **Tested:** Timestamp of when the test was run

### Color-Coded Scores
Scores are color-coded for quick assessment:
- 🟢 **Green (≥90):** Good performance
- 🟠 **Orange (50-89):** Average performance
- 🔴 **Red (<50):** Poor performance

## Implementation Details

### New Methods in `lighthouseHelper.ts`

#### `getDateTimePath()`
Generates the date/time folder structure.
```typescript
const { folder, dateTime } = getDateTimePath();
// folder: "2025-11-21/15-23-25"
// dateTime: "2025-11-21 15:23:25"
```

#### `saveReportWithDateTime(report, filename?)`
Saves a report with automatic date/time folder organization.
```typescript
await lighthouseHelper.saveReportWithDateTime(report, `lighthouse-${Date.now()}.json`);
// Saves to: test-results/lighthouse-reports/2025-11-21/15-23-25/lighthouse-[timestamp].json
```

#### `generateConsolidatedReportWithDateTime(reportDir?)`
Generates consolidated HTML from all date/time organized reports.
```typescript
const html = await lighthouseHelper.generateConsolidatedReportWithDateTime();
// Reads from all YYYY-MM-DD/HH-MM-SS directories
// Returns HTML string with all reports organized by date
```

#### `saveConsolidatedReportWithDateTime(outputPath?)`
Saves consolidated report as HTML file.
```typescript
await lighthouseHelper.saveConsolidatedReportWithDateTime(
  'playwright-report/lighthouse_reports/index.html'
);
```

## Example Workflow

### 1. Run Lighthouse Tests
```bash
npm run test:lighthouse
```

Reports are saved to:
- `test-results/lighthouse-reports/2025-11-21/15-23-25/lighthouse-1763720605867.json`

### 2. Generate Consolidated Report
```bash
npm run report:lighthouse
```

Creates `playwright-report/lighthouse_reports/index.html` with:
- Summary statistics
- All reports in a sortable table
- Generation timestamp: "2025-11-21 15:24:10"

### 3. View the Report
Open `playwright-report/lighthouse_reports/index.html` in your browser to see:
- Visual performance dashboard
- Historical report trends
- Per-test metrics and scores

## Benefits

✅ **Easy Historical Tracking:** Date/time folders make it simple to find reports from specific dates
✅ **Organized Results:** Automatic directory structure with no manual organization needed
✅ **Performance Trends:** Consolidated HTML report shows performance over time
✅ **Timestamp Records:** Each report includes exact timestamp for reference
✅ **Consistent Format:** All reports follow the same structure and naming convention

## Running Tests Frequently

If you run tests multiple times per day, you'll see:

```
test-results/lighthouse-reports/
└── 2025-11-21/
    ├── 15-23-25/lighthouse-1763720605867.json
    ├── 15-30-42/lighthouse-1763721042123.json
    ├── 16-45-15/lighthouse-1763725515789.json
    └── 17-12-30/lighthouse-1763727150456.json
```

The consolidated report will show all 4 reports with their respective timestamps.

## Notes

- Reports are sorted by timestamp (newest first) in the consolidated HTML
- JSON reports are retained in their date/time directories for archival
- The consolidated report is regenerated each time, showing all available reports
- Directory structure is created automatically if it doesn't exist

## Next Steps

1. **Monitor Performance Over Time:** Run tests regularly and track metrics
2. **Set Performance Targets:** Use the reports to establish baseline metrics
3. **Automate Testing:** Schedule lighthouse tests as part of your CI/CD pipeline
4. **Archive Reports:** Keep JSON reports for long-term performance analysis

For more information, see [LIGHTHOUSE_INTEGRATION_SUMMARY.md](LIGHTHOUSE_INTEGRATION_SUMMARY.md)
