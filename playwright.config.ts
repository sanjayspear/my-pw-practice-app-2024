import { defineConfig, devices } from '@playwright/test';

require('dotenv').config();

export default defineConfig({
  timeout: 40000,
  //globalTimeout: 60000,

  expect: {
    timeout: 2000
  },
  retries: 0,

  // C:\Users\Administrator\Documents\Playwright_2024\pw-practice-app\tests
  reporter: [
    ['json', { outputFile: 'test-results/jsonReport.json' }],
    ['junit', { outputFile: 'test-results/junitReport.xml' }],
    ['html']
  ],
  use: {
    baseURL: process.env.DEV = '1' ? 'http://localhost:4200/'
      : process.env.STAGING == '1' ? 'http://localhost:4202/'
        : 'http://localhost:4200/',

    trace: 'on-first-retry',
    actionTimeout: 20000,
    navigationTimeout: 25000,
    video: {
      mode: 'off',
      size: { width: 1920, height: 1080 }
    }
  },

  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/'
      }
    },
    {
      name: 'chromium',
      //timeout: 60000
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        video: {
          mode: 'on',
          size: { width: 1920, height: 1080 }
        }
      }
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePOM.spec.ts',
      use: {
        viewport: { width: 1920, height: 1080 }
      }
    },

    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro']
      }
    }
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/',
    timeout: 580000
  }
});
