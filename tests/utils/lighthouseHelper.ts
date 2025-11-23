import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

/**
 * Lighthouse Helper for Performance Testing
 * Provides utilities to run Lighthouse audits and analyze performance metrics
 */

export interface LighthouseScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa?: number;
}

export interface LighthouseMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay (deprecated, use INP)
  inp: number; // Interaction to Next Paint
  ttfb: number; // Time to First Byte
}

export interface LighthouseReport {
  url: string;
  timestamp: string;
  scores: LighthouseScore;
  metrics: LighthouseMetrics;
  rawAudits: any;
}

class LighthouseHelper {
  private chromePort: number = 9222;
  private chrome: any = null;

  /**
   * Launch Chrome browser for Lighthouse
   */
  async launchChrome(): Promise<number> {
    this.chrome = await chromeLauncher.launch({
      port: this.chromePort,
      chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
    });
    return this.chrome.port;
  }

  /**
   * Kill Chrome browser
   */
  async killChrome(): Promise<void> {
    if (this.chrome) {
      await this.chrome.kill();
    }
  }

  /**
   * Run Lighthouse audit on a URL
   */
  async runAudit(url: string, options?: any): Promise<any> {
    const chromePort = await this.launchChrome();
    
    // Create custom temp directory to avoid Windows permission issues
    const customTempDir = path.join(process.cwd(), '.lighthouse-tmp');
    await fs.ensureDir(customTempDir);

    const opts = {
      logLevel: 'info',
      output: 'json',
      port: chromePort,
      disableFullPageScreenshot: true,
      disableStorageReset: false,
      chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', `--user-data-dir=${customTempDir}`],
      ...options,
    };

    try {
      const runnerResult = await lighthouse(url, opts);
      await this.killChrome();
      
      // Clean up temp directory after audit
      try {
        await fs.remove(customTempDir);
      } catch (cleanupError) {
        console.warn('⚠️ Could not clean up temp directory:', cleanupError);
      }
      
      return runnerResult;
    } catch (error) {
      await this.killChrome();
      
      // Clean up temp directory on error
      try {
        await fs.remove(customTempDir);
      } catch (cleanupError) {
        console.warn('⚠️ Could not clean up temp directory:', cleanupError);
      }
      
      throw error;
    }
  }

  /**
   * Extract performance scores from Lighthouse report
   */
  extractScores(lhr: any): LighthouseScore {
    return {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      pwa: lhr.categories.pwa ? Math.round(lhr.categories.pwa.score * 100) : undefined,
    };
  }

  /**
   * Extract Core Web Vitals and key metrics
   */
  extractMetrics(lhr: any): LighthouseMetrics {
    const audits = lhr.audits;

    return {
      fcp: audits['first-contentful-paint']?.numericValue || 0,
      lcp: audits['largest-contentful-paint']?.numericValue || 0,
      cls: audits['cumulative-layout-shift']?.numericValue || 0,
      fid: audits['max-potential-fid']?.numericValue || 0,
      inp: audits['interaction-to-next-paint']?.numericValue || 0,
      ttfb: audits['time-to-first-byte']?.numericValue || 0,
    };
  }

  /**
   * Generate full Lighthouse report
   */
  async generateReport(url: string, options?: any): Promise<LighthouseReport> {
    const runnerResult = await this.runAudit(url, options);
    const lhr = runnerResult.lhr;

    const report: LighthouseReport = {
      url,
      timestamp: new Date().toISOString(),
      scores: this.extractScores(lhr),
      metrics: this.extractMetrics(lhr),
      rawAudits: lhr,
    };

    return report;
  }

  /**
   * Save report to JSON file
   */
  async saveReport(report: LighthouseReport, filename: string): Promise<void> {
    const reportDir = path.join(process.cwd(), 'test-results', 'lighthouse-reports');
    await fs.ensureDir(reportDir);

    const filepath = path.join(reportDir, filename);
    await fs.writeJSON(filepath, report, { spaces: 2 });
    console.log(`📊 Report saved to: ${filepath}`);
  }

  /**
   * Assert performance scores meet thresholds
   */
  assertScoresAboveThreshold(
    scores: LighthouseScore,
    thresholds: Partial<LighthouseScore>
  ): { passed: boolean; issues: string[] } {
    const issues: string[] = [];

    const defaults = {
      performance: 50,
      accessibility: 50,
      bestPractices: 50,
      seo: 50,
      ...thresholds,
    };

    if (scores.performance < defaults.performance) {
      issues.push(
        `Performance score ${scores.performance} is below threshold ${defaults.performance}`
      );
    }
    if (scores.accessibility < defaults.accessibility) {
      issues.push(
        `Accessibility score ${scores.accessibility} is below threshold ${defaults.accessibility}`
      );
    }
    if (scores.bestPractices < defaults.bestPractices) {
      issues.push(
        `Best Practices score ${scores.bestPractices} is below threshold ${defaults.bestPractices}`
      );
    }
    if (scores.seo < defaults.seo) {
      issues.push(`SEO score ${scores.seo} is below threshold ${defaults.seo}`);
    }

    return {
      passed: issues.length === 0,
      issues,
    };
  }

  /**
   * Assert metrics meet thresholds (Core Web Vitals)
   */
  assertMetricsBelowThreshold(
    metrics: LighthouseMetrics,
    thresholds: Partial<LighthouseMetrics>
  ): { passed: boolean; issues: string[] } {
    const issues: string[] = [];

    const defaults = {
      fcp: 1800, // 1.8 seconds
      lcp: 2500, // 2.5 seconds
      cls: 0.1, // 0.1
      fid: 100, // 100ms
      inp: 200, // 200ms
      ttfb: 600, // 600ms
      ...thresholds,
    };

    if (metrics.fcp > defaults.fcp) {
      issues.push(`FCP ${metrics.fcp}ms exceeds threshold ${defaults.fcp}ms`);
    }
    if (metrics.lcp > defaults.lcp) {
      issues.push(`LCP ${metrics.lcp}ms exceeds threshold ${defaults.lcp}ms`);
    }
    if (metrics.cls > defaults.cls) {
      issues.push(`CLS ${metrics.cls} exceeds threshold ${defaults.cls}`);
    }
    if (metrics.ttfb > defaults.ttfb) {
      issues.push(`TTFB ${metrics.ttfb}ms exceeds threshold ${defaults.ttfb}ms`);
    }

    return {
      passed: issues.length === 0,
      issues,
    };
  }

  /**
   * Convert JSON report to HTML
   */
  async convertToHTML(jsonReportPath: string): Promise<string> {
    const report = await fs.readJSON(jsonReportPath) as LighthouseReport;
    const timestamp = new Date(report.timestamp).toLocaleString();

    const getScoreClass = (score: number): string => {
      if (score >= 90) return 'score-good';
      if (score >= 50) return 'score-average';
      return 'score-poor';
    };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lighthouse Performance Report - ${new URL(report.url).hostname}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .content {
            padding: 30px;
        }

        .info-section {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .info-section p {
            margin: 5px 0;
        }

        .info-label {
            font-weight: 600;
            color: #333;
            display: inline-block;
            min-width: 100px;
        }

        .scores-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .score-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }

        .score-card h3 {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .score-value {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 10px;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px auto;
            color: white;
        }

        .score-good {
            background: #0cce6b;
        }

        .score-average {
            background: #ffa400;
        }

        .score-poor {
            background: #ff4e42;
        }

        .metrics-section h2 {
            font-size: 20px;
            margin-bottom: 15px;
            color: #333;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }

        .metric-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #667eea;
        }

        .metric-item .label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .metric-item .value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }

        .metric-item .unit {
            font-size: 12px;
            color: #999;
        }

        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }

        .section {
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Lighthouse Performance Report</h1>
            <p>${report.url}</p>
        </div>

        <div class="content">
            <div class="info-section">
                <p><span class="info-label">URL:</span> ${report.url}</p>
                <p><span class="info-label">Tested:</span> ${timestamp}</p>
            </div>

            <div class="section">
                <h2 style="font-size: 20px; margin-bottom: 15px; color: #333;">Performance Scores</h2>
                <div class="scores-grid">
                    <div class="score-card">
                        <h3>Performance</h3>
                        <div class="score-value ${getScoreClass(report.scores.performance)}">${report.scores.performance}</div>
                    </div>
                    <div class="score-card">
                        <h3>Accessibility</h3>
                        <div class="score-value ${getScoreClass(report.scores.accessibility)}">${report.scores.accessibility}</div>
                    </div>
                    <div class="score-card">
                        <h3>Best Practices</h3>
                        <div class="score-value ${getScoreClass(report.scores.bestPractices)}">${report.scores.bestPractices}</div>
                    </div>
                    <div class="score-card">
                        <h3>SEO</h3>
                        <div class="score-value ${getScoreClass(report.scores.seo)}">${report.scores.seo}</div>
                    </div>
                </div>
            </div>

            <div class="section metrics-section">
                <h2>Core Web Vitals</h2>
                <div class="metrics-grid">
                    <div class="metric-item">
                        <div class="label">FCP</div>
                        <div class="value">${report.metrics.fcp.toFixed(0)}<span class="unit">ms</span></div>
                        <div style="font-size: 11px; color: #999; margin-top: 5px;">First Contentful Paint</div>
                    </div>
                    <div class="metric-item">
                        <div class="label">LCP</div>
                        <div class="value">${report.metrics.lcp.toFixed(0)}<span class="unit">ms</span></div>
                        <div style="font-size: 11px; color: #999; margin-top: 5px;">Largest Contentful Paint</div>
                    </div>
                    <div class="metric-item">
                        <div class="label">CLS</div>
                        <div class="value">${report.metrics.cls.toFixed(3)}</div>
                        <div style="font-size: 11px; color: #999; margin-top: 5px;">Cumulative Layout Shift</div>
                    </div>
                    <div class="metric-item">
                        <div class="label">TTFB</div>
                        <div class="value">${report.metrics.ttfb.toFixed(0)}<span class="unit">ms</span></div>
                        <div style="font-size: 11px; color: #999; margin-top: 5px;">Time to First Byte</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Generated by Lighthouse | ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Generate consolidated HTML report from multiple JSON reports
   */
  async generateConsolidatedReport(reportDir?: string): Promise<string> {
    const reportsDir = reportDir || path.join(process.cwd(), 'test-results', 'lighthouse-reports');
    
    if (!await fs.pathExists(reportsDir)) {
      console.warn(`⚠️  Report directory not found: ${reportsDir}`);
      return '';
    }

    const files = await fs.readdir(reportsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.warn('⚠️  No JSON reports found');
      return '';
    }

    const reports: LighthouseReport[] = [];
    for (const file of jsonFiles) {
      const report = await fs.readJSON(path.join(reportsDir, file)) as LighthouseReport;
      reports.push(report);
    }

    // Sort by timestamp
    reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const reportRows = reports.map(r => `
        <tr>
            <td>${r.url}</td>
            <td><div class="score ${r.scores.performance >= 90 ? 'good' : r.scores.performance >= 50 ? 'avg' : 'poor'}">${r.scores.performance}</div></td>
            <td><div class="score ${r.scores.accessibility >= 90 ? 'good' : r.scores.accessibility >= 50 ? 'avg' : 'poor'}">${r.scores.accessibility}</div></td>
            <td><div class="score ${r.scores.bestPractices >= 90 ? 'good' : r.scores.bestPractices >= 50 ? 'avg' : 'poor'}">${r.scores.bestPractices}</div></td>
            <td><div class="score ${r.scores.seo >= 90 ? 'good' : r.scores.seo >= 50 ? 'avg' : 'poor'}">${r.scores.seo}</div></td>
            <td>${r.metrics.fcp.toFixed(0)}ms</td>
            <td>${r.metrics.lcp.toFixed(0)}ms</td>
            <td>${r.metrics.cls.toFixed(3)}</td>
            <td>${new Date(r.timestamp).toLocaleString()}</td>
        </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lighthouse Reports - Consolidated</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .content {
            padding: 30px;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th {
            background: #f8f9fa;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #e0e0e0;
            font-size: 12px;
            text-transform: uppercase;
            color: #333;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 13px;
        }

        tr:hover {
            background: #f8f9fa;
        }

        .score {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 600;
            text-align: center;
            min-width: 40px;
            color: white;
        }

        .score.good {
            background: #0cce6b;
        }

        .score.avg {
            background: #ffa400;
        }

        .score.poor {
            background: #ff4e42;
        }

        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .summary-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
        }

        .summary-card .label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
        }

        .summary-card .value {
            font-size: 28px;
            font-weight: bold;
            color: #667eea;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Lighthouse Reports</h1>
            <p>Consolidated Performance Analysis</p>
        </div>

        <div class="content">
            <div class="summary">
                <div class="summary-card">
                    <div class="label">Total Reports</div>
                    <div class="value">${reports.length}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Avg Performance</div>
                    <div class="value">${Math.round(reports.reduce((sum, r) => sum + r.scores.performance, 0) / reports.length)}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Avg Accessibility</div>
                    <div class="value">${Math.round(reports.reduce((sum, r) => sum + r.scores.accessibility, 0) / reports.length)}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Avg SEO</div>
                    <div class="value">${Math.round(reports.reduce((sum, r) => sum + r.scores.seo, 0) / reports.length)}</div>
                </div>
            </div>

            <h2 style="margin-top: 30px; margin-bottom: 15px;">Detailed Results</h2>
            <table>
                <thead>
                    <tr>
                        <th>URL</th>
                        <th>Performance</th>
                        <th>Accessibility</th>
                        <th>Best Practices</th>
                        <th>SEO</th>
                        <th>FCP</th>
                        <th>LCP</th>
                        <th>CLS</th>
                        <th>Tested</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportRows}
                </tbody>
            </table>
        </div>

        <div class="footer">
            <p>Generated on ${new Date().toLocaleString()} | Total Reports: ${reports.length}</p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Save consolidated report as HTML
   */
  async saveConsolidatedReportAsHTML(outputPath?: string): Promise<string> {
    const html = await this.generateConsolidatedReport();
    
    if (!html) {
      console.error('❌ No reports available to generate consolidated report');
      return '';
    }

    const reportPath = outputPath || path.join(process.cwd(), 'playwright-report', 'lighthouse_reports', 'index.html');
    const reportDir = path.dirname(reportPath);

    await fs.ensureDir(reportDir);
    await fs.writeFile(reportPath, html);
    console.log(`✅ Consolidated report saved to: ${reportPath}`);

    return reportPath;
  }

  /**
   * Generate date and time based report folder structure
   */
  getDateTimePath(): { folder: string; dateTime: string } {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const dateFolder = `${year}-${month}-${day}`;
    const timeFolder = `${hours}-${minutes}-${seconds}`;
    const dateTime = `${dateFolder} ${hours}:${minutes}:${seconds}`;
    
    const folder = path.join(dateFolder, timeFolder);
    
    return { folder, dateTime };
  }

  /**
   * Save report with date/time folder structure
   */
  async saveReportWithDateTime(report: LighthouseReport, filename?: string): Promise<string> {
    const { folder, dateTime } = this.getDateTimePath();
    const reportDir = path.join(process.cwd(), 'test-results', 'lighthouse-reports', folder);
    await fs.ensureDir(reportDir);

    const finalFilename = filename || `lighthouse-${Date.now()}.json`;
    const filepath = path.join(reportDir, finalFilename);
    await fs.writeJSON(filepath, report, { spaces: 2 });
    
    console.log(`📊 Report saved to: ${filepath}`);
    console.log(`   Generated at: ${dateTime}`);
    
    return filepath;
  }

  /**
   * Generate consolidated report with date/time subdirectories
   */
  async generateConsolidatedReportWithDateTime(reportDir?: string): Promise<string> {
    const { folder: dateTimeFolder, dateTime } = this.getDateTimePath();
    const reportsDir = reportDir || path.join(process.cwd(), 'test-results', 'lighthouse-reports');
    
    if (!await fs.pathExists(reportsDir)) {
      console.warn(`⚠️  Report directory not found: ${reportsDir}`);
      return '';
    }

    // Get all subdirectories (date-based folders)
    const dateFolders = await fs.readdir(reportsDir);
    const reports: LighthouseReport[] = [];

    for (const dateFolder of dateFolders) {
      const dateFolderPath = path.join(reportsDir, dateFolder);
      const stat = await fs.stat(dateFolderPath);
      
      if (!stat.isDirectory()) continue;

      // Get all time-based subdirectories
      const timeFolders = await fs.readdir(dateFolderPath);
      
      for (const timeFolder of timeFolders) {
        const timeFolderPath = path.join(dateFolderPath, timeFolder);
        const timeStat = await fs.stat(timeFolderPath);
        
        if (!timeStat.isDirectory()) continue;

        // Get all JSON files in the time folder
        const files = await fs.readdir(timeFolderPath);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        for (const file of jsonFiles) {
          const report = await fs.readJSON(path.join(timeFolderPath, file)) as LighthouseReport;
          reports.push(report);
        }
      }
    }

    if (reports.length === 0) {
      console.warn('⚠️  No JSON reports found');
      return '';
    }

    // Sort by timestamp
    reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const reportRows = reports.map(r => `
        <tr>
            <td>${r.url}</td>
            <td><div class="score ${r.scores.performance >= 90 ? 'good' : r.scores.performance >= 50 ? 'avg' : 'poor'}">${r.scores.performance}</div></td>
            <td><div class="score ${r.scores.accessibility >= 90 ? 'good' : r.scores.accessibility >= 50 ? 'avg' : 'poor'}">${r.scores.accessibility}</div></td>
            <td><div class="score ${r.scores.bestPractices >= 90 ? 'good' : r.scores.bestPractices >= 50 ? 'avg' : 'poor'}">${r.scores.bestPractices}</div></td>
            <td><div class="score ${r.scores.seo >= 90 ? 'good' : r.scores.seo >= 50 ? 'avg' : 'poor'}">${r.scores.seo}</div></td>
            <td>${r.metrics.fcp.toFixed(0)}ms</td>
            <td>${r.metrics.lcp.toFixed(0)}ms</td>
            <td>${r.metrics.cls.toFixed(3)}</td>
            <td>${new Date(r.timestamp).toLocaleString()}</td>
        </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lighthouse Reports - ${dateTime}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .content {
            padding: 30px;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th {
            background: #f8f9fa;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #e0e0e0;
            font-size: 12px;
            text-transform: uppercase;
            color: #333;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 13px;
        }

        tr:hover {
            background: #f8f9fa;
        }

        .score {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 600;
            text-align: center;
            min-width: 40px;
            color: white;
        }

        .score.good {
            background: #0cce6b;
        }

        .score.avg {
            background: #ffa400;
        }

        .score.poor {
            background: #ff4e42;
        }

        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .summary-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
        }

        .summary-card .label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
        }

        .summary-card .value {
            font-size: 28px;
            font-weight: bold;
            color: #667eea;
            margin-top: 10px;
        }

        .timestamp {
            font-size: 14px;
            color: #f8fafaff;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Lighthouse Performance Reports</h1>
            <p>Consolidated Performance Analysis</p>
            <div class="timestamp">Generated: ${dateTime}</div>
        </div>

        <div class="content">
            <div class="summary">
                <div class="summary-card">
                    <div class="label">Total Reports</div>
                    <div class="value">${reports.length}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Avg Performance</div>
                    <div class="value">${Math.round(reports.reduce((sum, r) => sum + r.scores.performance, 0) / reports.length)}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Avg Accessibility</div>
                    <div class="value">${Math.round(reports.reduce((sum, r) => sum + r.scores.accessibility, 0) / reports.length)}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Avg SEO</div>
                    <div class="value">${Math.round(reports.reduce((sum, r) => sum + r.scores.seo, 0) / reports.length)}</div>
                </div>
            </div>

            <h2 style="margin-top: 30px; margin-bottom: 15px;">Detailed Results</h2>
            <table>
                <thead>
                    <tr>
                        <th>URL</th>
                        <th>Performance</th>
                        <th>Accessibility</th>
                        <th>Best Practices</th>
                        <th>SEO</th>
                        <th>FCP</th>
                        <th>LCP</th>
                        <th>CLS</th>
                        <th>Tested</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportRows}
                </tbody>
            </table>
        </div>

        <div class="footer">
            <p>Generated on ${dateTime} | Total Reports: ${reports.length}</p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Save consolidated report with date/time folder structure
   */
  async saveConsolidatedReportWithDateTime(outputPath?: string): Promise<string> {
    const html = await this.generateConsolidatedReportWithDateTime();
    
    if (!html) {
      console.error('❌ No reports available to generate consolidated report');
      return '';
    }

    const { folder: dateTimeFolder } = this.getDateTimePath();
    const reportPath = outputPath || path.join(process.cwd(), 'playwright-report', 'lighthouse_reports', 'lighthouse-report-latest.html');
    const reportDir = path.dirname(reportPath);

    try {
      await fs.ensureDir(reportDir);
      await fs.writeFile(reportPath, html, 'utf8');
      console.log(`✅ Consolidated report saved to: ${reportPath}`);
    } catch (error) {
      console.error(`❌ Error saving report: ${error}`);
      throw error;
    }

    return reportPath;
  }

  /**
   * Print formatted report summary
   */
  printReportSummary(report: LighthouseReport): void {
    console.log('\n📊 Lighthouse Report Summary');
    console.log('=' + '='.repeat(49));
    console.log(`URL: ${report.url}`);
    console.log(`Time: ${report.timestamp}`);
    console.log('');
    console.log('📈 Performance Scores:');
    console.log(`  Performance:     ${report.scores.performance}/100`);
    console.log(`  Accessibility:   ${report.scores.accessibility}/100`);
    console.log(`  Best Practices:  ${report.scores.bestPractices}/100`);
    console.log(`  SEO:             ${report.scores.seo}/100`);
    if (report.scores.pwa) {
      console.log(`  PWA:             ${report.scores.pwa}/100`);
    }
    console.log('');
    console.log('⚡ Core Web Vitals:');
    console.log(`  FCP:   ${report.metrics.fcp.toFixed(2)}ms`);
    console.log(`  LCP:   ${report.metrics.lcp.toFixed(2)}ms`);
    console.log(`  CLS:   ${report.metrics.cls.toFixed(3)}`);
    console.log(`  TTFB:  ${report.metrics.ttfb.toFixed(2)}ms`);
    console.log('=' + '='.repeat(49) + '\n');
  }
}

export const lighthouseHelper = new LighthouseHelper();
