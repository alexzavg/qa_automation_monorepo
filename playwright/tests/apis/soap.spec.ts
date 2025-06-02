import { test } from "../../utils/envName"
import { expect } from "@playwright/test"

test.describe('SOAP Example', () => {

  test(`Calculator "Add" operation`, async ({ pageManager }) => {
    const result = await pageManager.soapExampleApi.add(1, 2)
    expect(result).toBe(3)
  })

})