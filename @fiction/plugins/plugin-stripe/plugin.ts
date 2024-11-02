import type { FictionApp, FictionDb, FictionEnv, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import type * as StripeJS from '@stripe/stripe-js'
import type express from 'express'
import type * as types from './types'

import { abort, Endpoint, FictionPlugin, isActualBrowser, vue } from '@fiction/core'
import Stripe from 'stripe'
import { QueryManageCustomer } from './endpoints'
import { setCustomerData } from './utils'
import './register'

interface CheckoutQueryParams {
  priceId?: string
  loginPath?: string
  customerId?: string
  orgId?: string
  trialPeriod?: string
  customerEmail?: string
}

export type StripePluginSettings = {
  fictionEnv: FictionEnv
  fictionApp: FictionApp
  fictionServer: FictionServer
  fictionUser: FictionUser
  fictionRouter: FictionRouter
  fictionDb: FictionDb
  publicKeyLive?: string
  publicKeyTest?: string
  secretKeyLive?: string
  secretKeyTest?: string
  webhookSecret?: string
  isLive?: vue.Ref<boolean> | boolean
  products: types.StripeProductConfig[]
  checkoutSuccessPathname?: (args: { orgId: string }) => string
  checkoutCancelPathname?: (args: { orgId: string }) => string
  customerPortalUrl: string
  useCustomerManager?: boolean
} & FictionPluginSettings

export class FictionStripe extends FictionPlugin<StripePluginSettings> {
  apiVersion = '2024-09-30.acacia' as const

  queries = {
    ManageCustomer: new QueryManageCustomer({ fictionStripe: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  browserClient?: StripeJS.Stripe
  serverClient?: Stripe
  isLive = this.settings.isLive ?? this.settings.fictionEnv.isProd.value
  stripeMode = vue.computed(() => {
    const isLive = this.settings.isLive
    const v = vue.isRef(isLive) ? isLive?.value : isLive
    return v ? 'live' : 'test'
  })

  secretKey = vue.computed(() => this.stripeMode.value === 'live' ? this.settings.secretKeyLive : this.settings.secretKeyTest)
  publicKey = vue.computed(() => this.stripeMode.value === 'live' ? this.settings.publicKeyLive : this.settings.publicKeyTest)

  initialized?: Promise<boolean>

  // customerPortalUrl = vue.computed(() => {
  //   const activeCustomer = this.activeCustomer.value
  //   const stripeCustomer = activeCustomer?.customer

  //   let prefilledEmail = ''
  //   if (stripeCustomer && 'email' in stripeCustomer)
  //     prefilledEmail = `?prefilled_email=${encodeURIComponent(stripeCustomer.email || '')}`

  //   return `${this.settings.customerPortalUrl}${prefilledEmail}`
  // })

  constructor(settings: StripePluginSettings) {
    super('FictionStripe', settings)

    const checkoutEndpoint = new Endpoint({
      requestHandler: async (...r) => this.checkoutEndpointHandler(...r),
      key: 'oAuthEndpoint',
      basePath: '/stripe-checkout/:action',
      serverUrl: this.settings.fictionServer.serverUrl.value,
      fictionUser: this.settings.fictionUser,
      fictionEnv: this.settings.fictionEnv,
      useNaked: true,
    })

    this.settings.fictionServer.addEndpoints([checkoutEndpoint])

    /**
     * Update customer email information when corresponding org is updated
     */
    this.settings.fictionEnv?.addHook({
      hook: 'updateOrganization',
      caller: 'FictionStripe',
      context: 'server',
      callback: async (o) => {
        if (!o.orgId)
          throw new Error('updateOrganization hook missing orgId')

        const { orgId, orgEmail, orgName, customerId } = o
        await this.queries.ManageCustomer.serve(
          { _action: 'update', orgId, fields: { email: orgEmail, name: orgName }, where: { customerId } },
          { server: true },
        )
      },
    })

    if (!this.settings.fictionEnv.isApp.value) {
      this.log.info('initializing stripe', {
        data: { secretKeyExists: !!this.secretKey.value, publicKeyExists: !!this.publicKey.value, stripeMode: this.stripeMode.value },
      })

      if (!this.secretKey.value)
        this.log.warn(`stripe secretKey key not set: ${this.stripeMode.value}`)

      if (!this.publicKey.value)
        this.log.warn(`stripe publicKey key not set: ${this.stripeMode.value}`)
    }
  }

  getCurrentCustomer = async (): Promise<types.CustomerDetails | undefined> => {
    await this.settings.fictionUser.userInitialized({ caller: 'setCustomerData' })

    const org = this.settings.fictionUser.activeOrganization.value

    if (!org)
      throw new Error('No active organization')

    const currentCustomer = await setCustomerData({
      organization: org,
      fictionStripe: this,
      products: this.settings.products,
    })

    return currentCustomer
  }

  getServerClient(): Stripe {
    if (this.settings.fictionEnv.isApp.value)
      throw new Error('Stripe is server only')

    if (!this.serverClient) {
      const key = this.secretKey.value

      if (!key)
        throw new Error(`stripe getServerClient: secretKey not found (${this.stripeMode.value})`)

      this.serverClient = new Stripe(key, { apiVersion: this.apiVersion })
    }

    return this.serverClient
  }

  getBrowserClient = async (): Promise<StripeJS.Stripe> => {
    const StripeJS = await import('@stripe/stripe-js')

    if (!this.browserClient) {
      const publicKey = this.publicKey.value
      if (!publicKey)
        throw new Error(`Stripe getBrowserClient: publicKey not found (${this.stripeMode.value})`)

      const createdClient = await StripeJS.loadStripe(publicKey)
      this.browserClient = createdClient ?? undefined
    }

    if (!this.browserClient)
      throw new Error('no stripe client created')

    return this.browserClient
  }

  async getCheckoutUrl(args: CheckoutQueryParams): Promise<string> {
    const { loginPath } = args

    if (this.fictionEnv?.isNode)
      return '#'

    await this.settings.fictionUser.userInitialized({ caller: 'getCheckoutUrl' })

    const u = this.settings.fictionUser.activeUser.value

    let link

    if (u) {
      const baseUrl = this.settings.fictionServer.serverUrl.value
      const url = new URL(`${baseUrl}/api/stripe-checkout/init`)

      args.orgId = this.settings.fictionUser.activeOrgId.value || ':orgId'

      if (args)
        url.search = new URLSearchParams(args as Record<string, string>).toString()

      link = url.toString()
    }
    else if (typeof location !== 'undefined') {
      const redirect = encodeURIComponent(location.href)
      link = `${loginPath}?redirect=${redirect}`
    }

    return link || ''
  }

  getCheckoutConfig(args: { orgId: string }) {
    const base = this.settings.fictionApp.appUrl.value
    const successPathCallback = this.settings.checkoutSuccessPathname
    const cancelPathCallback = this.settings.checkoutCancelPathname

    const successPath = successPathCallback ? successPathCallback(args) : '/checkout-success'
    const cancelPath = cancelPathCallback ? cancelPathCallback(args) : '/checkout-cancel'

    const config = {
      successUrl: `${base}${successPath}`,
      cancelUrl: `${base}${cancelPath}`,
    }

    this.log.info('checkout config', { data: config })

    return config
  }

  async checkoutEndpointHandler(
    request: express.Request,
    response: express.Response,
  ): Promise<void> {
    const query = request.query as Record<string, string>
    const params = request.params as { action?: 'init' }

    const { action } = params

    if (!action) {
      this.log.error('Invalid request', { action })
      response.status(400).send('Invalid request')
      return
    }

    try {
      if (action === 'init') {
        const { priceId, trialPeriod, orgId } = query as CheckoutQueryParams

        if (!priceId)
          throw abort('no priceId')

        if (!orgId)
          throw abort('no orgId')

        const r = await this.queries.ManageCustomer.serve({ orgId, _action: 'retrieve' }, { server: true })

        const customerId = r.data?.customer?.id

        if (!customerId)
          throw abort('no customerId')

        const stripe = this.getServerClient()

        const { successUrl, cancelUrl } = this.getCheckoutConfig({
          orgId,
        })

        const trialPeriodNum = trialPeriod ? +trialPeriod : 0

        if (+trialPeriodNum > 14)
          throw new Error('trial error')

        const subscription_data = trialPeriodNum
          ? { description: `${trialPeriodNum} Days Free`, trial_period_days: +trialPeriodNum }
          : {}

        const details: Stripe.Checkout.SessionCreateParams = {
          line_items: [{ price: priceId, quantity: 1 }],
          customer: customerId,
          subscription_data,
          mode: 'subscription',
          success_url: successUrl,
          cancel_url: cancelUrl,
          allow_promotion_codes: true,
        }

        const session = await stripe.checkout.sessions.create(details)

        this.log.info('creating checkout session', {
          data: {
            details,
            stripeMode: this.stripeMode.value,
            publicKey: this.publicKey.value,
            stripeRedirectUrl: session.url,
          },
        })

        if (session.url)
          response?.redirect(303, session.url)
      }
      else {
        throw abort('invalid action')
      }
    }
    catch (error) {
      const e = error as Error
      this.log.error('endpoint threw an error', { error })
      response.status(400).send({ status: 'error', message: e.message }).end()
    }
  }
}
