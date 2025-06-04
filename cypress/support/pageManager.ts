// cypress/support/pageManager.ts
import TestPage from '../pages/testApp/test.page'

class PageManager {
  testApp = {
    testPage: new TestPage()
  }

  // Add other apps here when needed
  // anotherApp = {
  //   loginPage: new loginPage(),
  //   dashboardPage: new dashboardPage()
  // }
}

// Create and export the instance
const pageManager = new PageManager()
export default pageManager