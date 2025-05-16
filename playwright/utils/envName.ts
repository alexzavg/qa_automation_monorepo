import { test as base, expect } from '@playwright/test'
import { color } from './common'
import { PageManager } from './pageManager'

type TestFixtures = {
  saveLogs: void
  pageManager: PageManager
}

export const test = base.extend<TestFixtures>({
  saveLogs: [
    async ({}, use) => {
      console.log(color.info(`<<< ENVIRONMENT: ${process.env.ENV_NAME} >>>`))
      console.log(color.info(`Working directory: ${process.cwd()}`))
      await use()
    },
    { auto: true },
  ],
  pageManager: async ({ page }, use) => {
    const pageManager = new PageManager(page)
    await use(pageManager)
  },
})

export const step = async (name: string, callback: () => Promise<void>): Promise<void> => {
  try {
    await test.step(name, callback)
    console.log(color.success(`Test step [${name}] passed`))
  } catch (error) {
    if (error instanceof Error) {
      console.log(color.error(`Test step [${name}] failed: ${error.message}`))
    } else {
      console.log(color.error(`Test step [${name}] failed: ${error}`))
    }
    throw new Error(`Test step [${name}] failed`)
  }
}

export { expect }