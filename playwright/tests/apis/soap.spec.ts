import { test } from "../../utils/envName"
import { expect } from "@playwright/test"
import { additionData } from "../../TestData/soapAPI.data"

test.describe('SOAP Example', () => {

  test(`Calculator "Add" operation`, async ({ pageManager }) => {
    console.log(`Addition data: ${JSON.stringify(additionData)}`)
    const result = await pageManager.soapExampleApi.add(additionData)
    expect(result).toBe(additionData.a + additionData.b)
  })

})