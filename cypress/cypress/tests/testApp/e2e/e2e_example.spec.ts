describe('E2E Example', () => {
  it('should load the correct environment configuration', () => {
    // Log environment information
    cy.log(`Environment: ${Cypress.env('CYPRESS_ENV_NAME')}`)
    cy.log(`Base URL: ${Cypress.config('baseUrl')}`)
    cy.log(`Specific value: ${Cypress.env('CYPRESS_ENV_SPECIFIC_VALUE')}`)
    
    // Visit the page and perform all assertions first
    cy.visit('/')
      .then(() => {
        // Verify the page loaded correctly
        cy.title().should('exist')
        
        // Log the current URL (for debugging)
        return cy.url()
      })
      .then((url) => {
        cy.log(`Current URL: ${url}`)
        
        // Deliberate test failure - this will run last
        expect(true).to.be.false
      })
  })
})
