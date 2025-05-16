import { expect } from '@wdio/globals'

describe(`My Web application on env: ${process.env.ENV_NAME}`, () => {
    it('should login with valid credentials', async () => {
        await pages.loginPage.open()
        await pages.loginPage.login('tomsmith', 'SuperSecretPassword!')
        await expect(pages.securePage.flashAlert).toBeExisting()
        await expect(pages.securePage.flashAlert).toHaveText(
            expect.stringContaining('You logged into a secure area!')
        )
        await expect(true).toBe(false)
    })
})
