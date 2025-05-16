import { test } from "../../utils/envName"
import { credentials } from "../../TestData/authentication.data"

test.describe('OTP MFA Sign In', () => {

  test(`Valid sign in as Admin`, async ({ pageManager }) => {
    await pageManager.otpSignInPage.signIn(credentials.admin)
  })

})