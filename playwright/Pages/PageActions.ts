import { step } from '../utils/envName'
import { Locator, Page, expect } from '@playwright/test'

export class PageActions {
  readonly page: Page
  readonly baseUrl: string

  constructor(page: Page) {
    this.page = page
    this.baseUrl = process.env.BASE_URL!
  }

  private readonly uiActionPrefix = 'UI Action: '

  async openUrl(url: string) {
    await step(`${this.uiActionPrefix}Navigates to URL: '${url}'`, async () => {
      await this.page.goto(url)
    })
  }

  async refreshPage() {
    await step(`${this.uiActionPrefix}Refreshes page`, async () => {
      await this.page.reload()
      await this.page.waitForLoadState('load')
      await this.page.waitForLoadState('domcontentloaded')
      await this.page.waitForLoadState('networkidle')
      await this.page.waitForTimeout(1000)
    })
  }

  async waitForUrl(url: string) {
    await step(`${this.uiActionPrefix}Waits until page URL is: '${url}'`, async () => {
      await this.page.waitForURL(url)
      await this.page.waitForLoadState('load')
      await this.page.waitForLoadState('domcontentloaded')
      await this.page.waitForLoadState('networkidle')
      await this.page.waitForTimeout(500)
    })
  }

  async waitForElement(locator: Locator) {
    await step(`${this.uiActionPrefix}Waits until element: '${locator}' is visible`, async () => {
      await locator.waitFor()
    })
  }

  async waitForElementInvisible(locator: Locator) {
    await step(
      `${this.uiActionPrefix}Waits until element: '${locator}' is invisible`,
      async () => {
        await expect(locator).not.toBeVisible()
      }
    )
  }

  async waitForElementEnabled(locator: Locator) {
    await step(
      `${this.uiActionPrefix}Waits until element: '${locator}' doesn't have "disabled" attribute`,
      async () => {
        await expect(locator).toBeEnabled()
      }
    )
  }

  async waitForElementEditable(locator: Locator) {
    await step(
      `${this.uiActionPrefix}Waits until element: '${locator}' doesn't have "readonly" property`,
      async () => {
        await expect(locator).toBeEditable()
      }
    )
  }

  async clickElement(locator: Locator) {
    await step(`${this.uiActionPrefix}Clicks element: '${locator}'`, async () => {
      await locator.click()
    })
  }

  async clickElementForce(locator: Locator) {
    await step(`${this.uiActionPrefix}Force-clicks element: '${locator}'`, async () => {
      await locator.click({
        button: 'middle',
        clickCount: 10,
        delay: 250,
      })
    })
  }

  async clickElementCentre(locator: Locator) {
    await step(`${this.uiActionPrefix}Clicks element centre: '${locator}'`, async () => {
      const box = await locator.boundingBox()
      // await selector.scrollIntoViewIfNeeded()
      await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    })
  }

  async fillElement(locatorToFill: Locator, text: string, maxRetries: number = 10) {
    await step(
      `${this.uiActionPrefix}Fills element: '${locatorToFill}' with text: '${text}'`,
      async () => {
        let retries = 0

        while (retries < maxRetries) {
          const isVisible = await locatorToFill.isVisible()
          const isEnabled = await locatorToFill.isEnabled()

          if (isVisible && isEnabled) {
            await locatorToFill.clear()
            await locatorToFill.fill(text)
            const value = await locatorToFill.inputValue()

            if (value === text) {
              console.log(`✅ Input value is: ${value}`)
              break
            } else {
              console.log(`❌ Input value is: ${value}, retrying...`)
              retries++
              await locatorToFill.waitFor({ state: 'visible', timeout: 5000 })
            }
          } else {
            console.log(`❌ Input is not visible or not enabled. Retrying...`)
            retries++
            await locatorToFill.waitFor({ state: 'visible', timeout: 5000 })
          }
        }

        if (retries === maxRetries) {
          const lastValue = await locatorToFill.inputValue()
          throw new Error(
            `❌ Failed to fill the text input after maximum retries. Last attempted value: ${lastValue}`
          )
        }
      }
    )
  }

  async fillElementAsRealUser(locatorToFill: Locator, text: string, maxRetries: number = 10) {
    await step(
      `${this.uiActionPrefix}Fills element: '${locatorToFill}' with text: '${text}'`,
      async () => {
        let retries = 0

        while (retries < maxRetries) {
          const isVisible = await locatorToFill.isVisible()
          const isEnabled = await locatorToFill.isEnabled()

          if (isVisible && isEnabled) {
            await locatorToFill.clear()

            for (const char of text) {
              await locatorToFill.type(char)
            }

            const value = await locatorToFill.inputValue()

            if (value === text) {
              console.log(`✅ Input value is: ${value}`)
              break
            } else {
              console.log(`❌ Input value is: ${value}, retrying...`)
              retries++
              await locatorToFill.waitFor({ state: 'visible', timeout: 5000 })
            }
          } else {
            console.log(`❌ Input is not visible or not enabled. Retrying...`)
            retries++
            await locatorToFill.waitFor({ state: 'visible', timeout: 5000 })
          }
        }

        if (retries === maxRetries) {
          const lastValue = await locatorToFill.inputValue()
          throw new Error(
            `❌ Failed to fill the text input after maximum retries. Last attempted value: ${lastValue}`
          )
        }
      }
    )
  }

  async pressKey(key: string) {
    await step(`${this.uiActionPrefix}Presses '${key}' key`, async () => {
      await this.page.keyboard.press(key)
    })
  }

  async clearBrowserData() {
    await step(`${this.uiActionPrefix}Clearing browser data`, async () => {
      await this.page.context().clearCookies()
      await this.page.context().clearPermissions()

      await this.page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    })
  }

  async checkElementAttribute(locator: Locator, attr: string, value: string) {
    await step(
      `${this.uiActionPrefix}Gets attribute: '${attr}' from element: '${locator}'`,
      async () => {
        const attribute = await locator.getAttribute(attr)
        await expect(attribute).toEqual(value)
      }
    )
  }

  async waitForElementAttribute(
    locator: Locator,
    attribute: string,
    expectedValue?: string,
    timeout: number = 10000
  ) {
    await step(
      `${this.uiActionPrefix}Waits for element '${locator}' to have attribute '${attribute}'${expectedValue ? ` with value: '${expectedValue}'` : ''}`,
      async () => {
        const startTime = Date.now()

        while (true) {
          const attributeValue = await locator.getAttribute(attribute)

          // Ensure the attribute exists
          if (attributeValue !== null) {
            // If expectedValue is provided, check for a match
            if (expectedValue) {
              if (attributeValue.trim() === expectedValue) {
                return
              }
            } else {
              // If only checking for attribute existence, exit once found
              return
            }
          }

          // Timeout check
          if (Date.now() - startTime > timeout) {
            throw new Error(
              `Timeout exceeded while waiting for element '${locator}' to have attribute '${attribute}'${expectedValue ? ` with value '${expectedValue}'` : ''}.`
            )
          }

          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    )
  }

  async checkElementExactText(locator: Locator, text: string) {
    await step(`${this.uiActionPrefix}Checks text from element: '${locator}'`, async () => {
      const textValue = await locator.textContent()
      await expect(textValue).toEqual(text)
    })
  }

  async checkElementPartialText(locator: Locator, partialText: string) {
    await step(`${this.uiActionPrefix}Checks partial text from element: '${locator}'`, async () => {
      const textValue = await locator.textContent()
      await expect(textValue).toContain(partialText)
    })
  }

  async waitForElementExactText(
    locator: Locator,
    expectedText: string,
    timeout: number = 30000
  ) {
    await step(
      `${this.uiActionPrefix}Waits for element '${locator}' to have exact text: '${expectedText}'`,
      async () => {
        const startTime = Date.now()

        while (true) {
          const textValue = await locator.textContent()

          if (textValue?.trim() === expectedText) {
            return
          }

          if (Date.now() - startTime > timeout) {
            throw new Error(
              `Timeout exceeded while waiting for element '${locator}' to have text '${expectedText}'. Actual text: '${textValue}'`
            )
          }

          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    )
  }

  async waitForElementPartialText(
    locator: Locator,
    expectedPartialText: string,
    timeout: number = 30000
  ) {
    await step(
      `${this.uiActionPrefix}Waits for element '${locator}' to contain text: '${expectedPartialText}'`,
      async () => {
        const startTime = Date.now()
  
        while (true) {
          const textValue = await locator.textContent()
  
          if (textValue?.includes(expectedPartialText)) {
            return
          }
  
          if (Date.now() - startTime > timeout) {
            throw new Error(
              `Timeout exceeded while waiting for element '${locator}' to contain text '${expectedPartialText}'. Actual text: '${textValue}'`
            )
          }
  
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    )
  }

  async getElementText(locator: Locator) {
    let text
    await step(`${this.uiActionPrefix}Gets text from element: '${locator}'`, async () => {
      text = await locator.textContent()
    })
    return text as string
  }

  async selectDropdownOption(locator: Locator, option: Locator) {
    await step(
      `${this.uiActionPrefix}Selects option '${option}' from dropdown '${locator}'`,
      async () => {
        await locator.click()
        await option.click()
      }
    )
  }

  async checkCheckbox(locator: Locator) {
    await step(`${this.uiActionPrefix}Checks checkbox '${locator}'`, async () => {
      await locator.check()
      await expect(locator).toBeChecked()
    })
  }

  async isCheckboxChecked(locator: Locator) {
    await step(`${this.uiActionPrefix}Checks checkbox '${locator}'`, async () => {
      await expect(locator).toBeChecked()
    })
  }

  async uncheckCheckbox(locator: Locator) {
    await step(`${this.uiActionPrefix}Unchecks checkbox '${locator}'`, async () => {
      await locator.uncheck()
      await expect(locator).not.toBeChecked()
    })
  }

  async isCheckboxUnchecked(locator: Locator) {
    await step(`${this.uiActionPrefix}Checks checkbox '${locator}'`, async () => {
      await expect(locator).not.toBeChecked()
    })
  }

  async getCookie(URL: string, cookieName: string): Promise<string> {
    let valueOfCookie = ''

    await step(`${this.uiActionPrefix}Gets cookie '${cookieName}'`, async () => {
      const cookies = await this.page.context().cookies(URL)
      const cookie = cookies.find(c => c.name === cookieName)
      if (cookie) {
        valueOfCookie = `${cookieName}=${cookie.value}`
      }
    })

    return valueOfCookie
  }

  async setCookie(cookieName: string, cookieValue: string) {
    await step(`${this.uiActionPrefix}Sets cookie '${cookieName}'`, async () => {
      // Set the cookie
      await this.page.evaluate(
        ({ name, value }) => {
          document.cookie = `${name}=${value}`
        },
        { name: cookieName, value: cookieValue }
      )

      // Check if the cookie was set
      const cookieSet = await this.page.evaluate(name => {
        const cookies = document.cookie
        return cookies.includes(name)
      }, cookieName)

      // Throw an error if the cookie wasn't set
      if (!cookieSet) {
        throw new Error(`Cookie "${cookieName}" was not set.`)
      }
    })
  }

  

}
