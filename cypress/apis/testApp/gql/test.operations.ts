import GQLBaseOperations from './base.operations'

export default class GQLTestOperations extends GQLBaseOperations {
  getCountry(countryCode: string) {
    return cy.request({
      method: 'POST',
      url: this.gqlBaseURL,
      body: {
        //operationName: '',
        variables: {},
        query: `
          {
            country(code: "${countryCode}") {
              name
              native
              capital
              emoji
              currency
              languages {
                code
                name
              }
            }
          }`,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}