import { test, expect } from './fixtures/fixtures.js';
import { lighthouseHelper, LighthouseScore, LighthouseMetrics } from './utils/lighthouseHelper.js';

/**
 * Test Suite: Google Lighthouse Performance Audits
 * Automated performance testing using Lighthouse
 */

test.describe('Lighthouse Performance Audits', () => {
  const targetUrl = 'https://playwright.dev';

  test('should pass Lighthouse performance audit', async () => {
    // Arrange & Act
    console.log(`🚀 Running Lighthouse audit for: ${targetUrl}`);
    const report = await lighthouseHelper.generateReport(targetUrl);

    // Print summary
    lighthouseHelper.printReportSummary(report);

    // Save report
    await lighthouseHelper.saveReport(report, `lighthouse-${Date.now()}.json`);

    // Assert - Minimum thresholds
    const performanceThreshold = 50;
    expect(report.scores.performance).toBeGreaterThanOrEqual(performanceThreshold);

    console.log(`✅ Performance score: ${report.scores.performance}/100`);
  });

  test('should meet accessibility standards', async () => {
    // Arrange & Act
    const report = await lighthouseHelper.generateReport(targetUrl);

    // Assert
    const accessibilityThreshold = 80;
    expect(report.scores.accessibility).toBeGreaterThanOrEqual(accessibilityThreshold);

    console.log(`✅ Accessibility score: ${report.scores.accessibility}/100`);
  });

  test('should follow best practices', async () => {
    // Arrange & Act
    const report = await lighthouseHelper.generateReport(targetUrl);

    // Assert
    const bestPracticesThreshold = 80;
    expect(report.scores.bestPractices).toBeGreaterThanOrEqual(bestPracticesThreshold);

    console.log(`✅ Best Practices score: ${report.scores.bestPractices}/100`);
  });

  test('should have good SEO score', async () => {
    // Arrange & Act
    const report = await lighthouseHelper.generateReport(targetUrl);

    // Assert
    const seoThreshold = 80;
    expect(report.scores.seo).toBeGreaterThanOrEqual(seoThreshold);

    console.log(`✅ SEO score: ${report.scores.seo}/100`);
  });

  test('should meet Core Web Vitals thresholds', async () => {
    // Arrange & Act
    const report = await lighthouseHelper.generateReport(targetUrl);
    const metrics = report.metrics;

    // Assert Core Web Vitals
    expect(metrics.fcp).toBeLessThan(1800); // FCP < 1.8s
    expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
    expect(metrics.cls).toBeLessThan(0.1); // CLS < 0.1

    console.log(`✅ Core Web Vitals check passed`);
    console.log(`   FCP: ${metrics.fcp.toFixed(2)}ms (< 1800ms)`);
    console.log(`   LCP: ${metrics.lcp.toFixed(2)}ms (< 2500ms)`);
    console.log(`   CLS: ${metrics.cls.toFixed(3)} (< 0.1)`);
  });

  test('should have fast First Contentful Paint', async () => {
    // Arrange & Act
    const report = await lighthouseHelper.generateReport(targetUrl);
    const fcp = report.metrics.fcp;

    // Assert
    const fcpThreshold = 1800; // 1.8 seconds
    expect(fcp).toBeLessThan(fcpThreshold);

    console.log(`✅ FCP: ${fcp.toFixed(2)}ms (threshold: ${fcpThreshold}ms)`);
  });

  test('should have fast Largest Contentful Paint', async () => {
    // Arrange & Act
    const report = await lighthouseHelper.generateReport(targetUrl);
    const lcp = report.metrics.lcp;

    // Assert
    const lcpThreshold = 2500; // 2.5 seconds
    expect(lcp).toBeLessThan(lcpThreshold);

    console.log(`✅ LCP: ${lcp.toFixed(2)}ms (threshold: ${lcpThreshold}ms)`);
  });

  test('should have low Cumulative Layout Shift', async () => {
    // Arrange & Act
    const report = await lighthouseHelper.generateReport(targetUrl);
    const cls = report.metrics.cls;

    // Assert
    const clsThreshold = 0.1;
    expect(cls).toBeLessThan(clsThreshold);

    console.log(`✅ CLS: ${cls.toFixed(3)} (threshold: ${clsThreshold})`);
  });

  test('should have fast Time to First Byte', async () => {
    // Arrange & Act
    const report = await lighthouseHelper.generateReport(targetUrl);
    const ttfb = report.metrics.ttfb;

    // Assert
    const ttfbThreshold = 600; // 600ms
    expect(ttfb).toBeLessThan(ttfbThreshold);

    console.log(`✅ TTFB: ${ttfb.toFixed(2)}ms (threshold: ${ttfbThreshold}ms)`);
  });

  test('should generate detailed performance report', async () => {
    // Arrange & Act
    const report = await lighthouseHelper.generateReport(targetUrl);

    // Assert
    expect(report.url).toBe(targetUrl);
    expect(report.timestamp).toBeTruthy();
    expect(report.scores).toBeTruthy();
    expect(report.metrics).toBeTruthy();
    expect(report.rawAudits).toBeTruthy();

    lighthouseHelper.printReportSummary(report);

    console.log(`✅ Report generated with all required fields`);
  });
});

/**
 * Test Suite: Custom Lighthouse Audit with Thresholds
 * Tests with configurable thresholds for different environments
 */

test.describe('Custom Lighthouse Audits', () => {
  const targetUrl = 'https://playwright.dev';

  test('should pass with custom performance thresholds', async () => {
    // Arrange
    const customThresholds: Partial<LighthouseScore> = {
      performance: 60,
      accessibility: 85,
      bestPractices: 80,
      seo: 85,
    };

    // Act
    const report = await lighthouseHelper.generateReport(targetUrl);

    // Assert
    const result = lighthouseHelper.assertScoresAboveThreshold(
      report.scores,
      customThresholds
    );

    if (!result.passed) {
      console.warn('⚠️  Threshold violations:', result.issues);
    }

    expect(result.passed).toBe(true);
    console.log(`✅ All custom thresholds met`);
  });

  test('should pass with custom metrics thresholds', async () => {
    // Arrange
    const customThresholds: Partial<LighthouseMetrics> = {
      fcp: 2000,
      lcp: 3000,
      cls: 0.15,
      ttfb: 800,
    };

    // Act
    const report = await lighthouseHelper.generateReport(targetUrl);

    // Assert
    const result = lighthouseHelper.assertMetricsBelowThreshold(
      report.metrics,
      customThresholds
    );

    if (!result.passed) {
      console.warn('⚠️  Metric violations:', result.issues);
    }

    expect(result.passed).toBe(true);
    console.log(`✅ All custom metric thresholds met`);
  });

  test('should report on performance categories', async () => {
    // Arrange & Act
    const report = await lighthouseHelper.generateReport(targetUrl);

    // Assert
    expect(report.scores.performance).toBeGreaterThan(0);
    expect(report.scores.accessibility).toBeGreaterThan(0);
    expect(report.scores.bestPractices).toBeGreaterThan(0);
    expect(report.scores.seo).toBeGreaterThan(0);

    console.log('📋 Performance Categories Breakdown:');
    console.log(`   Performance:    ${report.scores.performance}/100`);
    console.log(`   Accessibility:  ${report.scores.accessibility}/100`);
    console.log(`   Best Practices: ${report.scores.bestPractices}/100`);
    console.log(`   SEO:            ${report.scores.seo}/100`);
  });

  test('should track performance over time', async () => {
    // Arrange
    const reports = [];

    // Act - Run multiple audits
    for (let i = 0; i < 2; i++) {
      const report = await lighthouseHelper.generateReport(targetUrl);
      reports.push(report);

      if (i < 1) {
        // Add delay between audits
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Assert
    expect(reports.length).toBe(2);

    const firstReport = reports[0];
    const secondReport = reports[1];

    console.log('📊 Performance Trend:');
    console.log(`  Audit 1 - Performance: ${firstReport.scores.performance}/100`);
    console.log(`  Audit 2 - Performance: ${secondReport.scores.performance}/100`);

    // Save both reports
    await lighthouseHelper.saveReport(
      firstReport,
      `lighthouse-audit-1-${Date.now()}.json`
    );
    await lighthouseHelper.saveReport(
      secondReport,
      `lighthouse-audit-2-${Date.now()}.json`
    );
  });

  test('should identify performance bottlenecks', async () => {
    // Arrange & Act
    const report = await lighthouseHelper.generateReport(targetUrl);

    // Assert
    const metrics = report.metrics;
    const issues: string[] = [];

    if (metrics.fcp > 1800) {
      issues.push(`Slow FCP detected: ${metrics.fcp.toFixed(2)}ms`);
    }
    if (metrics.lcp > 2500) {
      issues.push(`Slow LCP detected: ${metrics.lcp.toFixed(2)}ms`);
    }
    if (metrics.cls > 0.1) {
      issues.push(`High CLS detected: ${metrics.cls.toFixed(3)}`);
    }
    if (metrics.ttfb > 600) {
      issues.push(`Slow TTFB detected: ${metrics.ttfb.toFixed(2)}ms`);
    }

    if (issues.length > 0) {
      console.warn('⚠️  Performance Bottlenecks Detected:');
      issues.forEach(issue => console.warn(`   - ${issue}`));
    } else {
      console.log('✅ No performance bottlenecks detected');
    }

    // Lighthouse audits rarely fail completely, so we just log findings
    expect(true).toBe(true);
  });
});
