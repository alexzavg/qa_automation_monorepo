import { test } from "../../utils/envName"
import { testData } from "../../TestData/template.data"
import { expect } from "@playwright/test"

test.describe('E2E Tests - Template', () => {

  test(`Template test`, async ({ pageManager }) => {
    //await pageManager.templatePage.templateMethod(testData)
    expect(true).toEqual(true)
  })

})