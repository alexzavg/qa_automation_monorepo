import WebMainPage from '../pages/web/webMain.page'
import LoginPage from '../pages/web/login.page'
import SecurePage from '../pages/web/secure.page'
import AndroidMainPage from '../pages/android/androidMain.page'
import HerokuHomePage from '../pages/android/androidHeroku.page'

export class PageManager {
  get webMainPage(): WebMainPage {
    return new WebMainPage()
  }
  get loginPage(): LoginPage {
    return new LoginPage()
  }
  get securePage(): SecurePage {
    return new SecurePage()
  }
  get androidMainPage(): AndroidMainPage {
    return new AndroidMainPage()
  }
  get herokuHomePage(): HerokuHomePage {
    return new HerokuHomePage()
  }
}

// Export a singleton instance for convenience
export const pageManager = new PageManager()

