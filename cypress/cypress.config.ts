import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Determine the environment (default to 'stage')
const env = process.env.CYPRESS_ENV || 'stage';
const envFilePath = path.resolve(process.cwd(), `.env.${env}`);

// Load environment variables
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
  console.log(`Loaded environment variables from ${envFilePath}`);
} else {
  console.warn(`No .env.${env} file found, using default environment variables`);
}

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://example.cypress.io',
    // Test configuration
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
        envName: process.env.CYPRESS_ENV_NAME || 'Development',
        baseUrl: process.env.CYPRESS_BASE_URL
      };
      
      return config;
    },
  },
  
  // Video configuration
  video: true,
  videoCompression: 16,
  videosFolder: 'cypress/videos',
  
  // Screenshot configuration
  screenshotsFolder: 'cypress/screenshots',
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
});
