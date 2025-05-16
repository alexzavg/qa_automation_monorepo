import { step, test } from "../../../utils/envName"
import { BrowserContext, Page } from "@playwright/test"
import { PageManager } from '../../../utils/pageManager'
import { ChannelData, SupportData, ClientData } from '../../../TestData/chat.data'

test.describe('E2E Tests - Chat App', () => {
  let channelName = ChannelData.channelName
  let supportContext: BrowserContext, clientContext: BrowserContext
  let supportPageManager: PageManager, clientPageManager: PageManager

  test.beforeAll(async ({ browser }) => {
    // Create separate contexts for support and client
    supportContext = await browser.newContext()
    clientContext = await browser.newContext()

    // Create pages for each context
    const supportPage: Page = await supportContext.newPage()
    const clientPage: Page = await clientContext.newPage()

    // Initialize PageManager for each page
    supportPageManager = new PageManager(supportPage)
    clientPageManager = new PageManager(clientPage)
  })

  test('Support and Client chat communication', async () => {

    await step(`Support creates channel`, async () => {
      await supportPageManager.chatPage.createChannel(channelName)
    })

    await step(`Support joins channel`, async () => {
      await supportPageManager.chatPage.joinChannel(channelName, SupportData.userName)
    })

    await step(`Client joins channel`, async () => {
      await clientPageManager.chatPage.joinChannel(channelName, ClientData.userName)
    })

    await step(`Support sends message`, async () => {
      await supportPageManager.chatPage.sendMessage(SupportData.message)
    })

    await step(`Client sends message`, async () => {
      await clientPageManager.chatPage.sendMessage(ClientData.message)
    })

    await step(`Support checks Client message`, async () => {
      await supportPageManager.chatPage.checkMessageInChat(ClientData.message, ClientData.userName)
    })

    await step(`Client checks Support message`, async () => {
      await clientPageManager.chatPage.checkMessageInChat(SupportData.message, `${SupportData.userName}fail`)
    })
  })
})