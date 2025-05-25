import WebMainPage from '../pages/testApp/web/webMain.page'
import LoginPage from '../pages/testApp/web/login.page'
import SecurePage from '../pages/testApp/web/secure.page'
import TestAppAndroidMainPage from '../pages/testApp/android/testAppAndroidMain.page'
import TestAppAndroidHerokuPage from '../pages/testApp/android/testAppAndroidHeroku.page'
import TestAppHomePage from '../pages/testApp/android/testAppHome.page'

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
  get androidMainPage(): TestAppAndroidMainPage {
    return new TestAppAndroidMainPage()
  }
  get herokuHomePage(): TestAppAndroidHerokuPage {
    return new TestAppAndroidHerokuPage()
  }
  get testAppHomePage(): TestAppHomePage {
    return new TestAppHomePage()
  }
}

export const pageManager = new PageManager()
