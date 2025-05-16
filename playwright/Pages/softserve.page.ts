// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, Page } from '@playwright/test'
import { PageActions } from './PageActions'

export class SoftServePage extends PageActions {
  
  readonly serviceItemContent: Locator

  constructor(page: Page) {
    super(page)
    this.serviceItemContent = page.locator('.services__aside .services-item__content')
  }

}
