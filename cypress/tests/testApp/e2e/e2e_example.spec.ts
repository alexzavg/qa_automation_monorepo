import { headerBanner } from '../../../testData/testApp/test.page.data'

describe('E2E Example', () => {
  before(() => {
    cy.log(`Environment: ${Cypress.env('CYPRESS_ENV_NAME')}`)
    cy.log(`Base URL: ${Cypress.config('baseUrl')}`)
  })

  it('visits the page and checks the title', () => {
    pages.testApp.testPage.visit()
    pages.testApp.testPage.checkPageTitle()
    pages.testApp.testPage.checkBannerText(headerBanner.title)
  })

  it('fails on purpose', () => {
    expect(true).to.be.false
  })
})
