import fs from 'fs';
import path from 'path';

/**
 * Global teardown - runs after all tests complete
 * Preserves Lighthouse HTML reports in playwright-report by copying from lighthouse-reports
 */
async function globalTeardown() {
  try {
    const sourceDir = path.join(process.cwd(), 'lighthouse-reports');
    const destDir = path.join(process.cwd(), 'playwright-report', 'lighthouse-reports');

    // Check if source directory exists
    if (!fs.existsSync(sourceDir)) {
      console.log('ℹ️  No Lighthouse reports to preserve');
      return;
    }

    // Create destination directory
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Copy all HTML files from lighthouse-reports to playwright-report
    const files = fs.readdirSync(sourceDir);
    const htmlFiles = files.filter(f => f.endsWith('.html'));

    if (htmlFiles.length === 0) {
      console.log('ℹ️  No Lighthouse HTML files to preserve');
      return;
    }

    for (const file of htmlFiles) {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Preserved: ${file}`);
    }

    console.log(`📁 Lighthouse reports preserved in: playwright-report/lighthouse-reports/`);
  } catch (error) {
    console.error('❌ Error in globalTeardown:', error);
  }
}

export default globalTeardown;
