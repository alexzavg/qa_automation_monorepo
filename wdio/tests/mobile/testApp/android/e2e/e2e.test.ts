describe(`My Android application on env: ${process.env.ENV_NAME}`, () => {
    it('enables test mode switch', async () => {
        await pages.testAppHomePage.enableTestModeSwitch()
    })
})
