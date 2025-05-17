import { config as base } from './wdio.conf'

// app selection for specific spec scope (e.g. hydra, playlist)
const appName = process.argv.find(arg => arg.includes('--appName='))?.split('=')[1]
// suite selection for specific spec scope (e.g. e2e, api, smoke, uat)
const suiteName = process.argv.find(arg => arg.includes('--suiteName='))?.split('=')[1]
// suite path selection for specific spec scope (e.g. e2e, api, smoke, uat or ALL)
let suitePath: string
if(suiteName === 'all') {
    suitePath = `./tests/mobile/${appName}/android/**/*.test.ts`
} else {
    suitePath = `./tests/mobile/${appName}/android/${suiteName}/*.test.ts`
}

export const config = {
    ...base,
    runner: 'local',
    specs: [suitePath],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:platformVersion': '14', // Replace with your emulator's platform version
        'appium:deviceName': 'Samsung_S24_API_34', // Replace with your emulator name
        // 'appium:browserName': 'Chrome', // Use Chrome for web app testing
        'appium:automationName': 'UiAutomator2', // Use UiAutomator2 driver
        'appium:noReset': true, // Don't reset app state between sessions
        'appium:fullReset': false, // Avoid uninstalling/reinstalling apps
        //'appium:appPackage': 'com.mobile.app', // App Package name derived from installed application
        //'appium:appActivity': 'com.mobile.app.MainActivity', // App activity string derived from running application
        //'appium:app': `apks/${appName}/app-release.apk` // Install location for app apk in repo
    }],
    services: [
        ['appium', {
            args: {
                relaxedSecurity: true,
            },
        }],
    ],
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