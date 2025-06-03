import { defineConfig } from 'cypress'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Get environment variables with defaults
const env = process.env.ENV
const appName = process.env.APP_NAME
const suiteName = process.env.SUITE_NAME

// Load environment specific .env file
const envFilePath = path.resolve(process.cwd(), `.env.${env}`);
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
  console.log(`Loaded environment variables from ${envFilePath}`);
} else {
  console.warn(`No .env.${env} file found, using default environment variables`);
}

// Validate required environment variables
if (!appName) {
  throw new Error('APP_NAME environment variable is required');
}

console.log(`Running ${suiteName} tests for app: ${appName} in ${env} environment`);

export default defineConfig({
  e2e: {
    // Set the spec pattern based on app name and suite name
    specPattern: `cypress/tests/${appName}/${suiteName}/**/*.spec.ts`,
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    baseUrl: process.env.CYPRESS_BASE_URL,
    video: true,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 90000,
    chromeWebSecurity: false,

    setupNodeEvents(on, config) {
      // Set environment variables in Cypress
      config.env = {
        ...config.env,
        envName: process.env.CYPRESS_ENV_NAME
      }
      
      return config
    },
  },
  
  video: true,
  videoCompression: 16,
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
})
