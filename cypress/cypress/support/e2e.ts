// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Extend Cypress types
declare global {
  namespace Cypress {
    interface CurrentTest {
      title: string;
      titlePath: string[];
    }
  }
}

// Global before each test
beforeEach(() => {
  // Log test information
  const test = Cypress.currentTest;
  const fullTestName = test.titlePath ? test.titlePath.join(' - ') : test.title;
  
  cy.log(`\n\n--- Test: ${fullTestName} ---\n`);
});

// Global after each test
afterEach(() => {
  // Take a screenshot on test failure
  const test = Cypress.currentTest;
  
  // Check if the test failed by looking at the mocha runner
  // This is a more reliable way to check test status in Cypress
  cy.on('fail', (error) => {
    const testName = test.titlePath ? test.titlePath.join(' - ') : 'test-failure';
    cy.screenshot(testName, { capture: 'runner' });
    throw error; // Re-throw the error to fail the test
  });
});
