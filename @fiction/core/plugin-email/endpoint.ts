import type { Transporter } from 'nodemailer'
import type { FictionPluginSettings } from '../plugin.js'
import type { EndpointResponse } from '../types/index.js'
import type { FictionEmail, TransactionalEmailConfig } from './index.js'
import nodeMailer from 'nodemailer'
import nodeMailerHtmlToText from 'nodemailer-html-to-text'
import { Query } from '../query.js'
import { abort } from '../utils/index.js'
import { type EndpointMeta, isActualBrowser } from '../utils/index.js'
import { isCi } from '../utils/vars.js'
import { replaceEmailDomain } from './util.js'

export type EmailQuerySettings = FictionPluginSettings & {
  fictionEmail: FictionEmail
}
export abstract class EmailQuery extends Query<EmailQuerySettings> {
  client?: Transporter
  smtpHost = this.settings.fictionEmail.settings.smtpHost
  smtpUser = this.settings.fictionEmail.settings.smtpUser
  smtpPassword = this.settings.fictionEmail.settings.smtpPassword
  smtpPort = this.settings.fictionEmail.settings.smtpPort || 587
  constructor(settings: EmailQuerySettings) {
    super(settings)
    this.settings.fictionEnv.serverOnlyImports['@vue-email/compiler'] = true
  }

  shouldSendEmail(meta: EndpointMeta) {
    const { emailMode = 'standard' } = meta

    const isProd = this.settings.fictionEnv.isProd.value
    const isTest = meta.isTest ?? this.settings.fictionEnv.isTest.value
    const ci = isCi()

    let disabledMessage = ''
    if (emailMode === 'sendInCI' && !ci && isTest) {
      disabledMessage = 'in test, but not in CI'
    }
    else if (emailMode === 'standard' && isTest) {
      disabledMessage = 'in test'
    }
    else if (emailMode === 'sendInProd' && (!isProd || isTest)) {
      disabledMessage = 'in dev/test but set to prod only'
    }

    if (disabledMessage)
      this.log.info(`real email sending disabled ${emailMode}: ${disabledMessage}`, { data: { emailMode, ci, isTest } })

    return !disabledMessage
  }

  getClient() {
    if (isActualBrowser() || this.settings.fictionEnv?.isApp.value)
      return this.log.warn('email client is not available in the browser')

    if (this.client)
      return this.client

    const options = {
      host: this.smtpHost,
      port: this.smtpPort,
      secure: false, // true for 587, false for other ports
      auth: { user: this.smtpUser, pass: this.smtpPassword },
    }

    const req = { SMTP_HOST: this.smtpHost, SMTP_USER: this.smtpUser, SMTP_PASSWORD: this.smtpPassword }

    const missing = Object.entries(req).map(([v, value]) => (value ? undefined : v)).filter(Boolean)

    if (missing.length > 0) {
      this.log.error('EMAIL: missing SMTP credentials', { data: { vars: `missing: ${missing.join(', ')}` } })
    }

    else {
      const emailServiceClient = nodeMailer.createTransport(options)

      // https://github.com/andris9/nodemailer-html-to-text
      emailServiceClient.use('compile', nodeMailerHtmlToText.htmlToText())

      this.client = emailServiceClient
    }

    return this.client
  }
}

export type TransactionalEmailParams =
  | {
    _action: 'send'
    fields: TransactionalEmailConfig
  }
  | {
    _action: 'unsubscribe'
    fields: { email: string }
  }

export type EmailResponse = {
  isSent: boolean
  html: string
  text: string
} & TransactionalEmailConfig

export class QueryTransactionalEmail extends EmailQuery {
  async run(params: TransactionalEmailParams, meta: EndpointMeta): Promise<EndpointResponse<EmailResponse>> {
    let emailResponse: EmailResponse | undefined
    const message = ''
    const { fields, _action } = params

    switch (_action) {
      case 'send':
        emailResponse = await this.sendSmtp(fields, meta)
        break
      default:
        return { status: 'error', message: 'Invalid action' }
    }

    return { status: 'success', data: emailResponse, message }
  }

  fromAppEmail() {
    const appMeta = this.settings.fictionEnv.meta.app || {}

    const { name, email = 'no-reply@fiction.com' } = appMeta

    const from = name ? `${name} <${email}>` : email

    return from
  }

  async sendSmtp(fields: TransactionalEmailConfig, meta: EndpointMeta): Promise<EmailResponse> {
    const shouldSend = this.shouldSendEmail(meta)

    const html = fields.bodyHtml || ''
    const text = fields.bodyMarkdown || ''
    const sendingDomain = this.settings.fictionEmail.settings.sendingDomain

    if (!html && !text)
      throw abort('missing bodyHtml or bodyMarkdown')

    const { fromName, fromEmail, to, subject } = fields

    const replyTo = (fromName ? `${fromName} <${fromEmail}>` : fromEmail) || this.fromAppEmail()

    const from = replaceEmailDomain(replyTo, sendingDomain)

    const theEmail = { from, to, subject, html, text, replyTo }

    const client = this.getClient()

    const isReal = shouldSend && client
    this.log.info(`sending email (${isReal ? 'REAL' : 'LOG_ONLY'})`, { data: { from, to, subject, htmlChars: html.length } })

    let isSent = false
    if (isReal) {
      isSent = true
      await this.client?.sendMail(theEmail)
    }

    return { ...fields, ...theEmail, isSent }
  }
}
