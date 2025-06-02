import { APIRequestContext, expect } from '@playwright/test'
import { RequestLogger } from './RequestLogger'
import { XMLParser } from 'fast-xml-parser'

export class SOAPExample extends RequestLogger {
  readonly request: APIRequestContext
  readonly baseUrl: string
  readonly actionBaseUrl: string

  constructor(request: APIRequestContext) {
    super()
    this.request = request
    this.baseUrl = process.env.SOAP_BASE_URL!
    this.actionBaseUrl = process.env.SOAP_ACTION_BASE_URL!
  }

  async add(a: number, b: number): Promise<number> {
    const body = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <Add xmlns="${this.actionBaseUrl}/">
            <intA>${a}</intA>
            <intB>${b}</intB>
        </Add>
    </soap:Body>
</soap:Envelope>`

    const url = `${this.baseUrl}/calculator.asmx`;
    const headers = {
      'Content-Type': 'text/xml;charset=UTF-8',
      'SOAPAction': `"${this.actionBaseUrl}/Add"`
    }

    const response = await this.request.post(url, {
      headers,
      data: body,
    })

    expect(response.status()).toBe(200)
    const rawXml = await response.text()
    
    try {
      // Parse the XML and extract the result
      const parser = new XMLParser()
      const parsed = parser.parse(rawXml)
      
      // Log the parsed XML for debugging
      console.log('Parsed XML: \n', JSON.stringify(parsed, null, 2))
      
      // Direct path to the result
      const result = parsed['soap:Envelope']['soap:Body']['AddResponse']['AddResult']
      
      if (result === undefined) {
        throw new Error('Could not find AddResult in the response')
      }
      
      return Number(result)
    } catch (error) {
      console.error('Error parsing XML:', error)
      throw error
    }
  }
}
