import { test, expect } from './fixtures/fixtures.ts';
import { lighthouseHelper } from './utils/lighthouseHelper.ts';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Simplified Lighthouse Performance Tests
 * More reliable tests without complex Playwright fixture interactions
 * Automatically generates consolidated HTML report after test completes
 */

test.describe('Lighthouse Performance Tests', () => {
  test.setTimeout(120000); // 120 seconds timeout for lighthouse audits

  test('run lighthouse audit and save report with date/time', async ({ authenticatedPage }) => {
    // Use STAGING_URL from npm scripts (dashboard URL for audit)
    const targetUrl = process.env.STAGING_URL;
    
    if (!targetUrl) {
      throw new Error('STAGING_URL environment variable is not set. Please check your npm script configuration.');
    }

    // Navigate to target URL on the authenticated page
    console.log(`\n📍 Navigating to target URL: ${targetUrl}`);
    await authenticatedPage.goto(targetUrl, { waitUntil: 'load' });

    console.log(`\n🚀 Running Lighthouse audit for: ${targetUrl}`);

    try {
      // Run lighthouse audit
      const report = await lighthouseHelper.generateReport(targetUrl);

      // Print summary
      lighthouseHelper.printReportSummary(report);

      // Save report with date/time folder structure
      await lighthouseHelper.saveReportWithDateTime(report, `lighthouse-${Date.now()}.json`);

      // Basic assertions
      expect(report.scores.performance).toBeGreaterThan(0);
      expect(report.scores.accessibility).toBeGreaterThan(0);
      expect(report.scores.bestPractices).toBeGreaterThan(0);
      expect(report.scores.seo).toBeGreaterThan(0);

      console.log(`\n✅ Lighthouse audit completed successfully`);
      console.log(`   Performance: ${report.scores.performance}/100`);
      console.log(`   Accessibility: ${report.scores.accessibility}/100`);
      console.log(`   Best Practices: ${report.scores.bestPractices}/100`);
      console.log(`   SEO: ${report.scores.seo}/100`);

      // Auto-trigger: Generate consolidated HTML report with timestamped filename
      console.log(`\n📊 Auto-generating consolidated HTML report...`);
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
      
      // Save to dedicated lighthouse-reports directory (persists across test runs)
      const outputDir = path.join(process.cwd(), 'lighthouse-reports');
      
      // Ensure the output directory exists before saving
      const fs = await import('fs-extra');
      await fs.ensureDir(outputDir);
      
      const outputPath = path.join(outputDir, `lighthouse-report-${timestamp}.html`);

      const reportPath = await lighthouseHelper.saveConsolidatedReportWithDateTime(outputPath);

      if (reportPath) {
        console.log(`✅ Consolidated report auto-generated: lighthouse-report-${timestamp}.html`);
        console.log(`📁 Primary location: playwright-report/lighthouse-reports/`);
        console.log(`📁 Backup location: lighthouse-reports/`);
      } else {
        console.log(`⚠️  Failed to auto-generate report`);
      }
    } catch (error) {
      console.error('❌ Lighthouse audit failed:', error);
      throw error;
    }
  });
});