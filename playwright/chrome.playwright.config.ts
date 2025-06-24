import { PlaywrightTestConfig } from '@playwright/test'
import base from './playwright.config'
import { globTimeout } from './playwright.config'

const config: PlaywrightTestConfig = {
  ...base,
  fullyParallel: false,
  timeout: globTimeout,
  workers: 1,
  retries: 0,
  use: {
    ...base.use,
    headless: false,
    viewport: null,
    ignoreHTTPSErrors: true,
    launchOptions: {
      slowMo: 1000, // for demo purposes, emulates real user behavior with a bit of delay
      channel: 'chrome',
      // Chromium capabilities list https://peter.sh/experiments/chromium-command-line-switches
      args: [
        '--start-maximized',
        '--disable-extensions',
        '--incognito',
        '--test-type=browser',
        '--disable-dev-shm-usage'
      ]
    }
  },
}
export default config