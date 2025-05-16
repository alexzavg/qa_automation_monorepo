import { test, step } from '../../utils/envName'
import { expect } from '@playwright/test'

test.describe('spec', () => {
  test('test', async () => {
    await step('passes', async () => {
      expect(true).toBe(true)
    })

    await step('fails', async () => {
      expect(false).toBe(true)
    })
  })
})
