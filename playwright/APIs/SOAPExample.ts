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
    this.actionBaseUrl = process.env.SOAP_ACTION_BASE!
  }

  async add(a: number, b: number): Promise<number> {
    const body = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <soap:Body>
          <Add xmlns="${this.actionBaseUrl}">
            <intA>${a}</intA>
            <intB>${b}</intB>
          </Add>
        </soap:Body>
      </soap:Envelope>`

    const response = await this.request.post(`${this.baseUrl}/calculator.asmx`, {
      headers: {
        'Content-Type': 'text/xml;charset=utf-8',
        'SOAPAction': `"${this.actionBaseUrl}/Add"`,
      },
      data: body,
    })

    expect(response.status()).toBe(200)
    const rawXml = await response.text()
    
    // Parse the XML and extract the result
    const parsed = new XMLParser().parse(rawXml)
    const result = parsed['soap:Envelope']['soap:Body']['AddResponse']['AddResult']
    
    // Convert to number and return
    return Number(result)
  }
}
