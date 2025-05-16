import { $ } from '@wdio/globals'
import AndroidMainPage from './androidMain.page'

/**
 * Home page object for the mobile application.
 */
class HerokuHomePage extends AndroidMainPage {
    // Define selectors
    get header() {
        return $('h1') // Replace with the actual header selector if needed
    }

    // Define methods for assertions or interactions
    async assertHeaderText(expectedText) {
        const actualText = await this.header.getText()
        if (actualText !== expectedText) {
            throw new Error(`Expected header text "${expectedText}", but got "${actualText}"`)
        }
    }
}

export default HerokuHomePage
