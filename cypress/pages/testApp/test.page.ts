import BasePage from './base.page'

export default class TestPage extends BasePage {
  elements = {
   ...this.elements, 
   bannerTitle: () => cy.get('.banner h1')
  }

  checkPageTitle() {
    cy.title().should('exist')
  }

  checkBannerText(text: string) {
    this.elements.bannerTitle().should('exist').and('have.text', text)
  }
}