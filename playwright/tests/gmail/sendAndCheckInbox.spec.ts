import { test, step } from "../../utils/envName"
import { gmailData } from "../../TestData/gmail.data"

test.describe('E2E Tests - Gmail', () => {

  test(`Valid Gmail Email Send and Inbox Check`, async ({ pageManager }) => {

    await step(`sends email`, async () => {
      await pageManager.gmailApi.sendEmail(gmailData)
    })

    await step(`checks email subject & body`, async () => {
      await pageManager.gmailApi.waitForUnreadEmailWithSubjectFragment(gmailData.subject)
    })
    
  })

})
