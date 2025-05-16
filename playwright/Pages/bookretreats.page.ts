// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, FrameLocator, Page, expect } from '@playwright/test'
import { PageActions } from './PageActions'
import { test } from '../utils/envName'

interface SignUpData {
  url: string
  firstName: string
  lastName: string
  email: string
  password: string
}

export class BookRetreatsPage extends PageActions {
  
  readonly form: Locator
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly recaptchaIframe: FrameLocator
  readonly recaptchaCheckbox: Locator
  readonly recaptchaCheckboxChechmark: Locator
  readonly recaptchaChallengeIframe: FrameLocator
  readonly recaptchaChallengeContainer: Locator
  readonly recaptchaObjectNameContainer: Locator
  readonly createAccountButton: Locator

  constructor(page: Page) {
    super(page)
    this.form = page.locator('form[id="singup-form"]')
    this.firstNameInput = this.form.locator('input[name="first_name"]')
    this.lastNameInput = this.form.locator('input[name="last_name"]')
    this.emailInput = this.form.locator('input[name="email"]')
    this.passwordInput = this.form.locator('input[name="password"]')
    this.recaptchaIframe = this.form.frameLocator('iframe[title="reCAPTCHA"]')
    this.recaptchaCheckbox = this.recaptchaIframe.locator('.recaptcha-checkbox-unchecked')
    this.recaptchaChallengeIframe = page.frameLocator('[style*="width"] iframe[title="recaptcha challenge expires in two minutes"]')
    this.recaptchaObjectNameContainer = this.recaptchaChallengeIframe.locator('.rc-imageselect-desc-no-canonical strong')
    this.recaptchaChallengeContainer = this.recaptchaChallengeIframe.locator('.rc-imageselect-challenge')
    this.recaptchaCheckboxChechmark = this.recaptchaIframe.locator('.recaptcha-checkbox-checkmark')
    this.createAccountButton = this.form.locator('[class*="validSubmit"]')
  }

  async fillSignUpForm(signUpData: SignUpData) {
    await test.step('fills sign-up form', async () => {
      await this.openUrl(signUpData.url)
      await this.fillElement(this.firstNameInput, signUpData.firstName)
      await this.fillElement(this.lastNameInput, signUpData.lastName)
      await this.fillElement(this.emailInput, signUpData.email)
      await this.fillElement(this.passwordInput, signUpData.password)
    })
  }

  async generateGptPrompt(objectNameToSearch: string): Promise<string> {
    return `Count the amount of images on this picture.
    Store the amount of images in a numbered array, e.g. [1,2,3,4,5,6,7...(depending on the image quantity)].
    Then, detect which of the images contain "${objectNameToSearch}".
    If there's any images containing "${objectNameToSearch}" - return me a numbered array containing the id's of images, which contain "${objectNameToSearch}".
    Return ONLY the array, NOTHING ELSE.
    If there are no images containing "${objectNameToSearch}" - return the EXACT RESPONSE: "no images found".`
  }

  async solveRecaptcha() {
    await test.step('solves reCAPTCHA', async () => {
      await this.recaptchaCheckbox.click()

      const challengeVisible = await this.recaptchaChallengeIframe.locator('body').isVisible({ timeout: 5000 }).catch(() => false)
      console.log(`ReCAPTCHA challenge visible: ${challengeVisible}`)

      if (challengeVisible === true) {
        console.log('ReCAPTCHA challenge shown, solving...')
        const objectName = await this.recaptchaObjectNameContainer.textContent()
        const objectNameToSearch = objectName?.trim()
        console.log(`ReCAPTCHA Object To Search: ${objectNameToSearch}`)

        // console.log('Taking screenshot of reCAPTCHA challenge...')
        // await this.recaptchaChallengeContainer.screenshot({ path: 'recaptcha_challenge.png' })

        // console.log('Sending reCAPTCHA challenge to ChatGPT...')
        // const gptPrompt = await this.generateGptPrompt(objectNameToSearch)
        // const response = await fetch('https://api.openai.com/v1/chat/completions', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        //   },
        //   body: JSON.stringify({
        //     model: 'gpt-4o',
        //     messages: [
        //       { role: 'user', content: gptPrompt }
        //     ]
        //   })
        // })
        
        // const data = await response.json()
        // let imageIds: number[] = []

        // try {
        //   imageIds = JSON.parse(data.choices[0].message.content)
        //   console.log(`Image IDs to click: ${imageIds}`)
        // } catch (error) {
        //   console.error('Failed to parse image IDs:', error)
        // }

        // ...add logic to solve the challenge 
        // - click on the image containers with numbers from the array
      } else {
        console.log('ReCAPTCHA challenge was not shown.')
      }
      expect(true).toEqual(false) // fail deliberately
    })
  }

  async submitSignUpForm() {
    await test.step('submits sign-up form', async () => {
      await this.clickElement(this.createAccountButton)
    })
  }
}
