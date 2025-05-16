import { $ } from '@wdio/globals'
import WebMainPage from './webMain.page'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends WebMainPage {
    get inputUsername () {
        return $('#username')
    }

    get inputPassword () {
        return $('#password')
    }

    get btnSubmit () {
        return $('button[type="submit"]')
    }

    async login (username: string, password: string) {
        await this.inputUsername.setValue(username)
        await this.inputPassword.setValue(password)
        await this.btnSubmit.click()
    }

    open () {
        return super.open('/login')
    }
}

export default LoginPage
