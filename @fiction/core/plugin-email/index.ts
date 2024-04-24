import type { Transporter } from 'nodemailer'
import nodeMailer from 'nodemailer'
import nodeMailerHtmlToText from 'nodemailer-html-to-text'
import type { FictionEnv } from '../plugin-env'
import { EnvVar, vars } from '../plugin-env'
import { FictionPlugin, type FictionPluginSettings } from '../plugin'
import { renderMarkdown } from '../utils/markdown'
import { isActualBrowser, isTest, safeDirname } from '../utils'
import type * as types from './types'

const verify: EnvVar<string>['verify'] = ({ fictionEnv, value }) => {
  return !(!value && fictionEnv.isProd.value && !fictionEnv.isApp.value)
}

vars.register(() => [
  new EnvVar({ name: 'SMTP_HOST', verify }),
  new EnvVar({ name: 'SMTP_USER', verify }),
  new EnvVar({ name: 'SMTP_PASSWORD', verify }),
])

type FictionEmailSettings = {
  smtpPort?: number
  fictionEnv: FictionEnv
  smtpHost?: string
  smtpUser?: string
  smtpPassword?: string
} & FictionPluginSettings

export class FictionEmail extends FictionPlugin<FictionEmailSettings> {
  client?: Transporter
  smtpHost = this.settings.smtpHost
  smtpUser = this.settings.smtpUser
  smtpPassword = this.settings.smtpPassword
  smtpPort = this.settings.smtpPort || 587
  isTest = isTest()
  isInitialized = false
  constructor(settings: FictionEmailSettings) {
    super('email', { root: safeDirname(import.meta.url), ...settings })
  }

  init() {
    if (isActualBrowser())
      return

    if (this.fictionEnv?.isApp.value)
      return

    if (this.isInitialized) {
      this.log.info('email initialized already')
      return
    }

    this.isInitialized = true

    const options = {
      host: this.smtpHost,
      port: this.smtpPort,
      secure: false, // true for 587, false for other ports
      auth: {
        user: this.smtpUser,
        pass: this.smtpPassword,
      },
    }

    const req = {
      SMTP_HOST: this.smtpHost,
      SMTP_USER: this.smtpUser,
      SMTP_PASSWORD: this.smtpPassword,
    }

    const missing = Object.entries(req)
      .map(([v, value]) => (value ? undefined : v))
      .filter(Boolean)

    if (missing.length > 0) {
      this.log.warn('no email service', {
        data: { vars: `missing: ${missing.join(', ')}` },
      })
    }

    if (!this.isTest && !this.fictionEnv?.isApp.value && missing.length === 0) {
      const emailServiceClient = nodeMailer.createTransport(options)

      // https://github.com/andris9/nodemailer-html-to-text
      emailServiceClient.use('compile', nodeMailerHtmlToText.htmlToText())

      this.client = emailServiceClient
    }
  }

  getFromAddress = (): string => {
    const app = this.fictionEnv?.meta.app || {}
    return `${app.name ?? ''} <${app.email}>`
  }

  async sendEmail(params: types.EmailTransactionalConfig): Promise<types.EmailTransactionalConfig> {
    const {
      emailId = 'none',
      subject,
      to,
      text,
      linkText,
      linkUrl,
      textFooter,
    } = params

    let { from } = params

    if (!from)
      from = this.getFromAddress()

    const lines = []

    if (text) {
      const md = await renderMarkdown(text)
      lines.push(`${md}\n`)
    }

    if (linkText && linkUrl)
      lines.push(`<p><a href="${linkUrl}">${linkText}</a></p>`)

    if (textFooter)
      lines.push(`<p>—\n${textFooter}</p>`)

    const contentHtml = lines.join('')
    const html = `<div style="width: 500px;font-size: 1.1em;">${contentHtml}</div>`

    const { convert } = await import('html-to-text')

    const plainText = convert(html)

    const theEmail = {
      ...params,
      emailId,
      from,
      to,
      subject,
      html,
      text: plainText,
    }

    this.log.info('send transactional email', { data: theEmail })

    const emailServiceClient = this.client

    if (emailServiceClient)
      await emailServiceClient.sendMail(theEmail)
    else
      this.log.warn('smtp email is not configured', { data: theEmail })

    return theEmail
  }
}
