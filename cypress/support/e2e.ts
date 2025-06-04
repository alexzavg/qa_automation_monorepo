// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************
import './commands'
import 'cypress-mochawesome-reporter/register'
import pageManager from './pageManager'
import { slowCypressDown } from 'cypress-slow-down'

// Add pages to cy.pages
globalThis.pages = pageManager

// Slow down test execution by 100ms between commands
slowCypressDown(100)

// Configure screenshots to be taken on test failure
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: true,
  capture: 'fullPage',
})

// Extend Cypress types
declare global {
  namespace Cypress {
    interface CurrentTest {
      title: string
      titlePath: string[]
    }
  }
}

// Global before each test
beforeEach(() => {
  // Log test information
  const test = Cypress.currentTest
  const fullTestName = test.titlePath ? test.titlePath.join(' - ') : test.title
  
  cy.log(`\n\n--- Test: ${fullTestName} ---\n`)
})

// Global after each test
afterEach(() => {
  // Take a screenshot on test failure
  const test = Cypress.currentTest
  
  // Check if the test failed by looking at the mocha runner
  // This is a more reliable way to check test status in Cypress
  cy.on('fail', (error) => {
    const testName = test.titlePath ? test.titlePath.join(' - ') : 'test-failure'
    cy.screenshot(testName, { capture: 'runner' })
    throw error // Re-throw the error to fail the test
  })
})
