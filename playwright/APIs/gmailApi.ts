import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

interface GmailData {
  senderEmail: string
  receiverEmail: string
  subject: string
  text: string
}

export class GmailApi {
  private oAuth2Client
  private gmail
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly redirectUri: string
  private readonly refreshToken: string

  constructor() {
    this.clientId = process.env.GMAIL_CLIENT_ID!
    this.clientSecret = process.env.GMAIL_CLIENT_SECRET!
    this.redirectUri = process.env.GMAIL_REDIRECT_URI!
    this.refreshToken = process.env.GMAIL_REFRESH_TOKEN!

    this.oAuth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    )

    this.oAuth2Client.setCredentials({ refresh_token: this.refreshToken })

    this.gmail = google.gmail({
      version: 'v1',
      auth: this.oAuth2Client,
    })
  }

  async sendEmail(data: GmailData): Promise<void> {
    const accessToken = await this.oAuth2Client.getAccessToken()

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: data.senderEmail,
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        refreshToken: this.refreshToken,
        accessToken: accessToken.token || '',
      },
    })

    const result = await transport.sendMail({
      from: data.senderEmail,
      to: data.receiverEmail,
      subject: data.subject,
      text: data.text,
    })

    console.log(`📤 Sent email with subject "${data.subject}", messageId: ${result.messageId}`)
  }

  async waitForUnreadEmailWithSubjectFragment(subjectFragment: string, expectedBodyText?: string): Promise<string | null> {
    console.log(`⏳ Waiting for unread email with subject containing: "${subjectFragment}"`)

    while (true) {
      const res = await this.gmail.users.messages.list({
        userId: 'me',
        q: `is:unread label:inbox`,
        maxResults: 5,
      })

      const messages = res.data.messages
      if (!messages || messages.length === 0) {
        console.log('📭 No unread messages found, retrying...')
        await this.delay(5000)
        continue
      }

      for (const msg of messages) {
        const full = await this.gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
          format: 'full',
        })

        const headers = full.data.payload?.headers || []
        const subjectHeader = headers.find(h => h.name === 'Subject')
        const subject = subjectHeader?.value || ''

        if (!subject.toLowerCase().includes(subjectFragment.toLowerCase())) {
          continue
        }

        // Try to get email body (plain text first)
        let body = ''
        if (full.data.payload?.parts) {
          for (const part of full.data.payload.parts) {
            if ((part.mimeType === 'text/plain' || part.mimeType === 'text/html') && part.body?.data) {
              body = Buffer.from(part.body.data, 'base64').toString('utf-8')
              break
            }
          }
        } else if (full.data.payload?.body?.data) {
          body = Buffer.from(full.data.payload.body.data, 'base64').toString('utf-8')
        }

        console.log(`📨 Email Found.`)
        console.log(`📬 Subject: ${subject}`)
        console.log(`📝 Body:`)
        console.log(`----------------------------------------`)
        console.log(body.trim())
        console.log(`----------------------------------------`)

        if (expectedBodyText && !body.toLowerCase().includes(expectedBodyText.toLowerCase())) {
          console.log('❌ Email body does not contain expected text. Retrying...')
          await this.delay(5000)
          continue
        }

        console.log('✅ Email subject and body match.')
        return subject
      }

      console.log(`🔁 No matching subject/body yet, retrying in 5s...`)
      await this.delay(5000)
    }
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
