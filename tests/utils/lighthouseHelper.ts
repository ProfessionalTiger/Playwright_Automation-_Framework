import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import * as fs from 'fs-extra';
import path from 'path';

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

    const opts = {
      logLevel: 'info',
      output: 'json',
      port: chromePort,
      ...options,
    };

    try {
      const runnerResult = await lighthouse(url, opts);
      await this.killChrome();
      return runnerResult;
    } catch (error) {
      await this.killChrome();
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
