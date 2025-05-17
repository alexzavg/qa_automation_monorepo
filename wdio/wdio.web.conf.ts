import { config as base } from './wdio.conf'

// app selection for specific spec scope (e.g. testApp)
const appName = process.argv.find(arg => arg.includes('--appName='))?.split('=')[1]
// suite selection for specific spec scope (e.g. e2e, api, smoke, uat)
const suiteName = process.argv.find(arg => arg.includes('--suiteName='))?.split('=')[1]
// suite path selection for specific spec scope (e.g. e2e, api, smoke, uat or ALL)
let suitePath: string
if(suiteName === 'all') {
    suitePath = `./tests/web/${appName}/**/*.test.ts`
} else {
    suitePath = `./tests/web/${appName}/${suiteName}/*.test.ts`
}
// max instances selection for parallel runs (e.g. 1,2,3)
const maxInstances = process.argv.find(arg => arg.includes('--maxInstances='))?.split('=')[1]

export const config = {
    ...base,
    runner: 'local',
    specs: [suitePath],
    maxInstances: maxInstances || 1,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: [
              '--headless',
              '--disable-gpu',
              '--no-sandbox',
              '--disable-dev-shm-usage',
              '--disable-extensions',
              '--start-maximized',
              `--user-data-dir=/tmp/chrome-data-${Date.now()}`,
          ],
          prefs: {
              'profile.default_content_settings.popups': 0,
              'download.prompt_for_download': false,
              'download.default_directory': './chrome-downloads',
              'profile.default_content_setting_values.notifications': 2,
          },
      },
      acceptInsecureCerts: true,
      'goog:loggingPrefs': {
          browser: 'ALL', // Enable all browser logs
          driver: 'ALL',  // Enable WebDriver logs
      },
    }],
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 30000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },
}