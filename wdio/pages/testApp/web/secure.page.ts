import { $ } from '@wdio/globals'
import WebMainPage from './webMain.page'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SecurePage extends WebMainPage {
    get flashAlert () {
        return $('#flash')
    }
}

export default SecurePage
