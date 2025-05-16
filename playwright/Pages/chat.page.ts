// Documentation https://playwright.dev/docs/api/class-apirequestcontext
import { Locator, Page } from '@playwright/test'
import { PageActions } from './PageActions'
import { step } from '../utils/envName'

export class ChatPage extends PageActions {
  readonly baseUrl: string
  readonly channelName: string
  readonly channelNameInput: Locator
  readonly joinChannelButton: Locator
  readonly channelHeader: Locator
  readonly nameInput: Locator
  readonly participantsContainer: Locator
  readonly messageInput: Locator
  readonly messagesContainer: Locator
  
  constructor(page: Page) {
    super(page)
    this.baseUrl = process.env.BASE_URL!
    this.channelNameInput = page.locator('[name="chat[permalink]"]')
    this.joinChannelButton = page.locator('#join_button')
    this.channelHeader = page.locator('[class="header-channel"]')
    this.nameInput = page.locator('#participant_nickname')
    this.participantsContainer = page.locator('#online-participants')
    this.messageInput = page.locator('#message_body')
    this.messagesContainer = page.locator('#live')
  }

  getMessageContainer(userName: string): Locator {
    return this.page.locator(`[data-user-nickname="${userName}"]`).locator('.post-message')
  }

  async createChannel(channelName: string) {
    await step(`Creates a channel: ${channelName}`, async () => {
      await this.openUrl(this.baseUrl)
      await this.waitForUrl(this.baseUrl)
      await this.fillElement(this.channelNameInput, channelName)
      await this.clickElement(this.joinChannelButton)
    })
  }

  async joinChannel(channelName: string, userName: string) {
    await step(`Joins a channel: ${channelName}`, async () => {
      await this.openUrl(`${this.baseUrl}/${channelName}`)
      await this.waitForUrl(`${this.baseUrl}/${channelName}`)
      await this.waitForElementExactText(this.channelHeader, channelName)
      await this.fillElement(this.nameInput, userName)
      await this.pressKey('Enter')
      await this.waitForElementPartialText(this.participantsContainer, userName)
    })
  }

  async sendMessage(message: string) {
    await step(`Sends message: ${message}`, async () => {
      await this.fillElement(this.messageInput, message)
      await this.pressKey('Enter')
    })
  }

  async checkMessageInChat(message: string, userName: string) {
    await step(`Checks message: ${message} in chat for user: ${userName}`, async () => {
      await this.waitForElementPartialText(this.getMessageContainer(userName), message)
    })
  }

}
