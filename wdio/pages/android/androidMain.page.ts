import { browser } from '@wdio/globals'

/**
 * Main page object containing methods and functionality
 * shared across all android page objects.
 */
class AndroidMainPage {
    async open(path: string) {
        console.log(`Opening URL: ${path}`)
        return browser.url(path) // Directly open the URL in the mobile browser
    }
}

export default AndroidMainPage