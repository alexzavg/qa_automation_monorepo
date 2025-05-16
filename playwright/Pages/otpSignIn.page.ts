// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, Page } from '@playwright/test'
import { PageActions } from './PageActions'
import { step } from '../utils/envName'
import { OTPGenerator } from '../APIs/OTPgenerator'

interface SignInData {
  email: string
  password: string
  otpSecret: string
}

export class OTPSignInPage extends PageActions {

  readonly otpGenerator: OTPGenerator
  readonly baseUrl: string
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly otpInput: Locator
  readonly signInButton: Locator
  readonly loginSuccessMessageContainer: Locator

  constructor(page: Page) {
    super(page)
    this.otpGenerator = new OTPGenerator()
    this.baseUrl = process.env.OTP_BASE_URL!
    this.emailInput = page.locator('#email')
    this.passwordInput = page.locator('#password')
    this.otpInput = page.locator('#totpmfa')
    this.signInButton = page.locator('[value="Log In"]')
    this.loginSuccessMessageContainer = page.locator('.alert-success')
  }

  async signIn(signInData: SignInData) {
    await step(`signs in with valid user credentials & OTP`, async () => {
      await this.openUrl(this.baseUrl)
      await this.clearBrowserData()
      await this.fillElement(this.emailInput, signInData.email)
      await this.fillElement(this.passwordInput, signInData.password)

      const otp = this.otpGenerator.getOTP(signInData.otpSecret)
      this.otpGenerator.verifyOTP(signInData.otpSecret, otp)
      await this.fillElement(this.otpInput, otp)

      await this.clickElement(this.signInButton)
      await this.waitForElementPartialText(this.loginSuccessMessageContainer, 'Success')
    })
  }

}
