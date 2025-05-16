import { expect } from '@wdio/globals'

describe(`My Android application on env: ${process.env.ENV_NAME}`, () => {
    it('should open a website on the Android emulator and validate header text', async () => {
        await pages.herokuHomePage.open('https://the-internet.herokuapp.com/')
        await pages.herokuHomePage.assertHeaderText('Welcome to the-internet')
        expect(true).toBe(false)
    })
})
