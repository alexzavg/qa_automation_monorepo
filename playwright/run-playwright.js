const { execSync } = require('child_process')
const path = require('path')

const configName = process.argv[2]
const projectName = process.argv[3]
const testEnv = process.argv[4] || 'prod' // Default to 'prod' if not provided

if (!configName || !projectName) {
  console.error('Usage: node run-playwright.js <config-name> <project-name> [test-env]')
  process.exit(1)
}

const configPath = path.join(__dirname, `${configName}.playwright.config.ts`)

const command = `cross-env test_env=${testEnv} npx playwright test --config=${configPath} --project=${projectName}`
execSync(command, { stdio: 'inherit' })