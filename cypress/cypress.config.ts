import { defineConfig } from 'cypress'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import mochawesome from 'cypress-mochawesome-reporter/plugin'

// Get environment variables with defaults
const env = process.env.ENV
const appName = process.env.APP_NAME
const suiteName = process.env.SUITE_NAME

// Environment variables type
interface EnvVars {
  [key: string]: string | undefined
}

// Load environment specific .env file
const envFilePath = path.resolve(process.cwd(), `.env.${env}`)
const envVars: EnvVars = {}

if (fs.existsSync(envFilePath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envFilePath))
  Object.assign(envVars, envConfig)
  console.log(`Loaded environment variables from ${envFilePath}`)
} else {
  console.warn(`No .env.${env} file found, using default environment variables`)
}

// Validate required environment variables
if (!appName) {
  throw new Error('APP_NAME environment variable is required')
}

console.log(`Running ${suiteName} tests for app: ${appName} in ${env} environment`)

// Expose all CYPRESS_* environment variables to the browser
// All env vars in .env files must start with CYPRESS_ in order for this to work
const cypressEnvVars = {}
Object.entries(envVars).forEach(([key, value]) => {
  if (key.startsWith('CYPRESS_')) {
    cypressEnvVars[key] = value
  }
})

export default defineConfig({
  // Global settings
  video: true,
  videoCompression: 16,
  videosFolder: 'videos',
  screenshotOnRunFailure: true,
  screenshotsFolder: 'screenshots',
  trashAssetsBeforeRuns: true,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'reports',
    overwrite: false,
    html: false,
    json: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  e2e: {
    specPattern: `tests/${appName}/${suiteName}/**/*.spec.ts`,
    supportFile: 'support/e2e.ts',
    fixturesFolder: 'fixtures',
    baseUrl: envVars.CYPRESS_BASE_URL,
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 10000,
    responseTimeout: 15000,
    pageLoadTimeout: 90000,
    blockHosts: ['securepubads.g.doubleclick.net'],
    chromeWebSecurity: false,
    experimentalMemoryManagement: true,
    watchForFileChanges: false,
    retries: {
      runMode: 1,
      openMode: 0,
    },

    setupNodeEvents(on, config: Cypress.PluginConfigOptions) {
      console.log('Setting up cleanup hooks...')
      
      // Clean up once before any tests run
      on('before:run', () => {
        console.log('\n=== Starting cleanup before test run ===')
        console.log(`Current working directory: ${process.cwd()}`)
        
        const filesToRemove = [
          'mochawesome.json',
          'mochawesome-report',
          'cypress/mochawesome.json',
          'cypress/reports',
          'reports',
          'cypress/screenshots',
          'cypress/videos'
        ]
        
        for (const file of filesToRemove) {
          const fullPath = path.resolve(process.cwd(), file)
          console.log(`\nChecking: ${fullPath}`)
          
          try {
            if (fs.existsSync(fullPath)) {
              const stat = fs.lstatSync(fullPath)
              if (stat.isDirectory()) {
                console.log(`Removing directory: ${fullPath}`)
                fs.rmSync(fullPath, { recursive: true, force: true })
                console.log(`Successfully removed directory: ${fullPath}`)
              } else {
                console.log(`Removing file: ${fullPath}`)
                fs.unlinkSync(fullPath)
                console.log(`Successfully removed file: ${fullPath}`)
              }
            } else {
              console.log(`Path does not exist: ${fullPath}`)
            }
          } catch (err) {
            console.error(`Error processing ${fullPath}:`, err)
          }
        }
        
          // Ensure reports directory exists
          const reportsDir = path.resolve(process.cwd(), 'reports')
          if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true })
          }
        
        console.log('=== Cleanup completed ===\n')
      })
      
      mochawesome(on)

      // Set environment variables
      config.env = {
        ...config.env,
        ...cypressEnvVars 
      }

      // Add Chrome launch options
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--disable-dev-shm-usage')
          launchOptions.args.push('--disable-gpu')
          launchOptions.args.push('--window-size=1920,1080')
        }
        return launchOptions
      })

      return config
    },
  }
})
