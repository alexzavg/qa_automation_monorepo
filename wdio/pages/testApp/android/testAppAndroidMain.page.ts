import { browser, $ } from '@wdio/globals'

interface ShellCommandResult {
    code: number
    stdout: string
    stderr: string
}

/**
 * Base Android page object containing common methods and functionality
 * that can be extended by other Android page objects
 */
class TestAppAndroidMainPage {
    /**
     * Navigate to a specific screen in the app
     * @param screenName Name of the screen to navigate to
     */
    async navigateTo(screenName: string) {
        const result = await browser.execute('mobile: shell', {
            command: `am start -n com.sengami.appium_test_helper_android/.${screenName}`
        }) as ShellCommandResult
        if (result.code !== 0) {
            throw new Error(`Failed to navigate to screen ${screenName}: ${result.stderr}`)
        }
    }

    /**
     * Get the current screen name
     * @returns Name of the current screen/activity
     */
    async getCurrentScreen() {
        const result = await browser.execute('mobile: shell', {
            command: 'dumpsys window windows | grep -E \'mCurrentFocus|mFocusedApp\''
        }) as ShellCommandResult
        return result.stdout
    }

    /**
     * Wait for an element with specific accessibility id
     * @param accessibilityId The accessibility id of the element
     * @param timeout Optional timeout in milliseconds
     */
    async waitForElement(accessibilityId: string, timeout: number = 10000) {
        await browser.waitUntil(
            async () => (await $(`accessibility id=${accessibilityId}`).isDisplayed()),
            {
                timeout,
                timeoutMsg: `Element with accessibility id ${accessibilityId} did not appear in ${timeout}ms`
            }
        )
    }

    /**
     * Scroll to an element with specific accessibility id
     * @param accessibilityId The accessibility id of the element to scroll to
     */
    async scrollToElement(accessibilityId: string) {
        const element = $(`accessibility id=${accessibilityId}`)
        await element.scrollIntoView()
    }

    /**
     * Get the current app version
     * @returns App version string
     */
    async getAppVersion() {
        const result = await browser.execute('mobile: shell', {
            command: 'pm dump com.sengami.appium_test_helper_android | grep versionName'
        }) as ShellCommandResult
        return result.stdout
    }
}

export default TestAppAndroidMainPage
