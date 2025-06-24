// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, Page, expect } from '@playwright/test'
import { PageActions } from './PageActions'
import { test } from '../utils/envName'

interface TemplateData {}

export class TemplatePage extends PageActions {
  
  readonly form: Locator

  constructor(page: Page) {
    super(page)
    this.form = page.locator('form[id="singup-form"]')
  }

  async templateMethod(templateData: TemplateData) {
    await test.step('fills sign-up form', async () => {
      await this.openUrl(process.env.BASE_URL)
      await this.fillElement(this.form, "text")
    })
  }
}
