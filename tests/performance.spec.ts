import { test, expect } from './fixtures/fixtures.js';

/**
 * Test Suite: Performance and Visual Testing
 */
test.describe('Performance and Visual Tests', () => {
  test('should load page within acceptable time', async ({ page }) => {
    // Arrange
    const startTime = Date.now();

    // Act
    await page.goto('https://playwright.dev/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    // Assert
    expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
    console.log(`✅ Page loaded in ${loadTime}ms`);
  });

  test('should have correct accessibility tree', async ({ page }) => {
    // Arrange
    await page.goto('https://playwright.dev/');

    // Act
    const headings = await page.locator('h1, h2, h3').count();

    // Assert
    expect(headings).toBeGreaterThan(0);
    console.log(`✅ Found ${headings} headings on the page`);
  });

  test('should verify images are loaded', async ({ page }) => {
    // Arrange
    await page.goto('https://playwright.dev/');

    // Act
    const images = await page.locator('img');
    const imageCount = await images.count();

    // Assert
    expect(imageCount).toBeGreaterThan(0);
    console.log(`✅ Found ${imageCount} images on the page`);
  });

  test('should detect broken links', async ({ page, request }) => {
    // Arrange
    await page.goto('https://playwright.dev/');

    // Act
    const links = await page.locator('a[href]').all();
    let brokenLinks = 0;

    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('mailto:') && !href.startsWith('#')) {
        try {
          // Only check internal links or common external domains
          if (href.startsWith('/') || href.includes('playwright.dev')) {
            const response = await request.head(href).catch(() => null);
            if (!response || !response.ok()) {
              console.log(`⚠️  Broken link found: ${href}`);
              brokenLinks++;
            }
          }
        } catch (e) {
          // Skip external links that can't be verified
        }
      }
    }

    // Assert
    expect(brokenLinks).toBeLessThan(5);
    console.log(`✅ Broken links check complete (${brokenLinks} issues found)`);
  });

  test('should measure core web vitals', async ({ page }) => {
    // Arrange
    await page.goto('https://playwright.dev/');

    // Act
    const metrics = await page.evaluate(() => ({
      navigationStart: performance.timing.navigationStart,
      loadEventEnd: performance.timing.loadEventEnd,
      domContentLoaded: performance.timing.domContentLoadedEventEnd,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
    }));

    const pageLoadTime = metrics.loadEventEnd - metrics.navigationStart;
    const dcl = metrics.domContentLoaded - metrics.navigationStart;

    // Assert
    expect(pageLoadTime).toBeLessThan(10000);
    expect(dcl).toBeLessThan(5000);

    console.log(`✅ Page Load Time: ${pageLoadTime}ms`);
    console.log(`✅ DOM Content Loaded: ${dcl}ms`);
  });

  test('should verify responsive design at different viewports', async ({ browser }) => {
    // Arrange
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    // Act & Assert
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();

      await page.goto('https://playwright.dev/');
      await page.waitForLoadState('networkidle');

      const visible = await page.locator('main').isVisible();
      expect(visible).toBeTruthy();

      console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}) rendering successful`);

      await context.close();
    }
  });
});
