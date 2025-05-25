import { $ } from '@wdio/globals'
import TestAppAndroidMainPage from './testAppAndroidMain.page'

/**
 * Home page object for the mobile application.
 */
class TestAppAndroidHerokuPage extends TestAppAndroidMainPage {
    // Define selectors
    get header() {
        return $('h1') // Replace with the actual header selector if needed
    }

    // Define methods for assertions or interactions
    async assertHeaderText(expectedText: string) {
        const actualText = await this.header.getText()
        if (actualText !== expectedText) {
            throw new Error(`Expected header text "${expectedText}", but got "${actualText}"`)
        }
    }
}

export default TestAppAndroidHerokuPage
