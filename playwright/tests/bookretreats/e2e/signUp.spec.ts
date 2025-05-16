import { test } from "../../../utils/envName"
import { signUp } from "../../../TestData/bookretreats.data"

test.describe('E2E Tests - Bookretreats', () => {

  test(`Valid sign up`, async ({ pageManager }) => {
    await pageManager.bookretreatsPage.fillSignUpForm(signUp)
    await pageManager.bookretreatsPage.solveRecaptcha()
    //await pageManager.bookretreatsPage.submitSignUpForm()
  })

})