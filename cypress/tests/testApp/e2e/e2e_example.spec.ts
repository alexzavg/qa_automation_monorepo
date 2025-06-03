describe('E2E Example', () => {
  it('should load the correct environment configuration', () => {
    cy.log(`Environment: ${Cypress.env('CYPRESS_ENV_NAME')}`)
    cy.log(`Base URL: ${Cypress.config('baseUrl')}`)
    cy.log(`Specific value: ${Cypress.env('CYPRESS_ENV_SPECIFIC_VALUE')}`)
    
    cy.visit('/')
    cy.title().should('exist')
  })

  it('should fail on purpose', () => {
    expect(true).to.be.false
  })
})
