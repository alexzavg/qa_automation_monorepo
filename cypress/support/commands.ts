/// <reference types="cypress" />

// cypress/support/commands.ts
import pageManager from './pageManager'

declare global {
  namespace Cypress {
    interface Chainable {
      pages: typeof pageManager
    }
  }
}

// Add pages to cy.pages
Cypress.Commands.add('pages', { prevSubject: false }, () => pageManager)