import { countries } from '../../../testData/testApp/gql.data'

describe('GQL API Example', () => {
  it('gets & asserts country data', () => {
    pages.testApp.gqlTestOperations.getCountry(countries.brazil.code).then((response) => {
      cy.log('Response status:', response.status)
      cy.log('Response body:', JSON.stringify(response.body, null, 2))

      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('data')
      expect(response.body.data).to.have.property('country')

      const country = response.body.data.country
      expect(country.name).to.eq(countries.brazil.name)
      expect(country.native).to.eq(countries.brazil.native)
      expect(country.capital).to.eq(countries.brazil.capital)
      expect(country.emoji).to.eq(countries.brazil.emoji)
      expect(country.currency).to.eq(countries.brazil.currency)

      expect(country.languages).to.be.an('array').and.have.length(1)
      expect(country.languages[0].code).to.eq(countries.brazil.languages[0].code)
      expect(country.languages[0].name).to.eq(countries.brazil.languages[0].name)
    })
  })
})
