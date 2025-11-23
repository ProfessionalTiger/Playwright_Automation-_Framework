import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
const envFile = process.env.ENV ? `.env.${process.env.ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Get configuration from environment variables
const baseURL = process.env.BASE_URL || '';
const headless = process.env.HEADLESS !== 'false';
const parallelWorkers = parseInt(process.env.PARALLEL_WORKERS || '4', 10);
const retries = parseInt(process.env.RETRIES || '0', 10);
const screenshotOnFailure = process.env.SCREENSHOT_ON_FAILURE === 'true';
const videoOnFailure = process.env.VIDEO_ON_FAILURE === 'true';
const pageTimeout = parseInt(process.env.PAGE_TIMEOUT || '140000', 10);
const navigationTimeout = parseInt(process.env.NAVIGATION_TIMEOUT || '140000', 10);


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',


        
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry configuration */
  retries: process.env.CI ? 2 : retries,
  
  /* Parallel workers configuration */
  workers: process.env.CI ? 1 : parallelWorkers,
  
  /* Global teardown for preserving Lighthouse reports */
  globalTeardown: path.resolve('./tests/globalTeardown.ts'),
  
  /* Reporter configuration with multiple reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  
  /* Global timeout settings */
  timeout: pageTimeout,
  expect: { timeout: pageTimeout },
  navigationTimeout: navigationTimeout,
  
  /* Global test settings */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: baseURL,
    
    /* Screenshots on failure */
    screenshot: screenshotOnFailure ? 'only-on-failure' : 'off',
    
    /* Video recording */
    video: videoOnFailure ? 'retain-on-failure' : 'off',
    
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    
    /* Slow motion for easier debugging */
    slowMo: parseInt(process.env.SLOW_MO || '0', 10),
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: headless,
        launchArgs: ['--disable-blink-features=AutomationControlled'],
      },
    },
    {
          timeout: 60000, // Increase to 60 seconds (or more)
          // ... other configurations
        },

   // {
     // name: 'firefox',
      //use: { 
       // ...devices['Desktop Firefox'],
        //headless: headless,
      //},
    //},

    //{
      //name: 'webkit',
     // use: { 
    //    ...devices['Desktop Safari'],
      //  headless: headless,
   //   },
    //},

    /* Test against mobile viewports */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  /* Output folder for test results */
  outputDir: 'test-results',
});

