describe('GQL API Example', () => {
  it('gets & asserts country data', () => {
    pages.testApp.gqlTestOperations.getCountry('BR').then((response) => {
      cy.log('Response status:', response.status)
      cy.log('Response body:', JSON.stringify(response.body, null, 2))

      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('data')
      expect(response.body.data).to.have.property('country')

      const country = response.body.data.country
      expect(country.name).to.eq('Brazil')
      expect(country.native).to.eq('Brasil')
      expect(country.capital).to.eq('Brasília')
      expect(country.emoji).to.eq('🇧🇷')
      expect(country.currency).to.eq('BRL')

      expect(country.languages).to.be.an('array').and.have.length(1)
      expect(country.languages[0].code).to.eq('pt')
      expect(country.languages[0].name).to.eq('Portuguese')
    })
  })
})
