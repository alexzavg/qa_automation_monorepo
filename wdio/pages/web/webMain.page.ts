import { browser } from '@wdio/globals'

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
class WebMainPage {
    open (path: string) {
        return browser.url(`${process.env.TESTAPP_WEB_BASE_URL}${path}`)
    }
}

export default WebMainPage