import { $ } from '@wdio/globals'
import TestAppAndroidMainPage from './testAppAndroidMain.page'

class TestAppHomePage extends TestAppAndroidMainPage {
  get testModeSwitch() {
    return $('id=com.sengami.appium_test_helper_android:id/test_mode_switch')
  }

  async enableTestModeSwitch() {
    await this.testModeSwitch.waitForDisplayed({
      timeoutMsg: '"Test mode" switch did not appear'
    })
  
    const isCheckedBefore = await this.testModeSwitch.getAttribute('checked') === 'true'
    if (isCheckedBefore) {
      throw new Error('Switch is already ON — no need to tap')
    }
  
    await this.testModeSwitch.click()
  
    await browser.waitUntil(async () => {
      const checkedNow = await this.testModeSwitch.getAttribute('checked')
      return checkedNow === 'true'
    }, {
      timeoutMsg: 'Switch did not turn ON after tapping'
    })
  }

}

export default TestAppHomePage
