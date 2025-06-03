describe('E2E Example', () => {
  it('should load the correct environment configuration', () => {
    cy.log(`Environment: ${Cypress.env('CYPRESS_ENV_NAME')}`)
    cy.log(`Base URL: ${Cypress.config('baseUrl')}`)
    cy.log(`Specific value: ${Cypress.env('CYPRESS_ENV_SPECIFIC_VALUE')}`)
    
    cy.visit('/')
      .then(() => {
        cy.title().should('exist')
        return cy.url()
      })
      .then((url) => {
        cy.log(`Current URL: ${url}`)
        expect(true).to.be.false
      })
  })
})
