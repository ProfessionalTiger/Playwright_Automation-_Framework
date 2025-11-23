#!/usr/bin/env node

/**
 * Script to generate consolidated Lighthouse HTML report
 * Usage: npx ts-node scripts/generateLighthouseReport.ts
 */

import { lighthouseHelper } from '../tests/utils/lighthouseHelper.ts';
import path from 'path';

async function main() {
  try {
    console.log('🚀 Generating consolidated Lighthouse report with date/time in filename...\n');

    const reportsDir = path.join(process.cwd(), 'test-results', 'lighthouse-reports');
    
    // Generate filename with date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    
    const outputDir = path.join(process.cwd(), 'playwright-report', 'lighthouse_reports');
    const outputPath = path.join(outputDir, `lighthouse-report-${timestamp}.html`);

    // Use the new date/time-based report generation
    const report = await lighthouseHelper.saveConsolidatedReportWithDateTime(outputPath);

    if (report) {
      console.log('\n✅ Report generation complete!');
      console.log(`📂 Report File: lighthouse-report-${timestamp}.html`);
      console.log(`📂 Full Path: ${report}`);
      console.log('\n💡 You can open the report in your browser to view the results.');
    } else {
      console.log('\n⚠️  No reports available. Run lighthouse tests first to generate reports.');
      console.log('   Command: npm run test:lighthouse');
    }
  } catch (error) {
    console.error('❌ Error generating report:', error);
    process.exit(1);
  }
}

main();
