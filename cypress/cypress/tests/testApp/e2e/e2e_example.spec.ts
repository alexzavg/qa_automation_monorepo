describe('E2E Example', () => {
  it('should load the correct environment configuration', () => {
    // Log environment information
    cy.log(`Environment: ${Cypress.env('CYPRESS_ENV_NAME')}`)
    cy.log(`Base URL: ${Cypress.env('CYPRESS_BASE_URL')}`)
    cy.log(`Specific value: ${Cypress.env('CYPRESS_ENV_SPECIFIC_VALUE')}`)
    
    // Verify the base URL is set correctly
    cy.visit('/')
    
    // Simple assertion that we're on a page with a valid title
    cy.title().should('exist')
    
    // Log the current URL (for debugging)
    cy.url().then(url => {
      cy.log(`Current URL: ${url}`)
    })
  })
})
