export default class BasePage {
  elements = {
    testElement: () => cy.get('[data-cy="test-element"]'),
  }

  visit() {
    cy.visit('/')
  }
}