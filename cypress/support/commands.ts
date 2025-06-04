/// <reference types="cypress" />

import pageManager from './pageManager'

declare global {
  namespace Cypress {
    interface Chainable {
      page: {
        testApp: typeof pageManager.testApp
      }
    }
  }
}

Cypress.Commands.add('page', () => pageManager)