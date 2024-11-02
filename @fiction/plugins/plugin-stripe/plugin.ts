import type { FictionApp, FictionDb, FictionEnv, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import type * as StripeJS from '@stripe/stripe-js'

import type Stripe from 'stripe'

import type * as types from './types'
import { Endpoint, FictionPlugin, vue } from '@fiction/core'
import { QueryManageCustomer, QueryPortalSession } from './endpoints'
import { checkoutEndpointHandler, getCurrentCustomerDetails, getStripeBrowserClient, getStripeServerClient, setCustomerData } from './utils'
import './register'

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
    PortalSession: new QueryPortalSession({ fictionStripe: this, ...this.settings }),
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

  constructor(settings: StripePluginSettings) {
    super('FictionStripe', settings)

    const checkoutEndpoint = new Endpoint({
      requestHandler: async (...r) => checkoutEndpointHandler({ request: r[0], response: r[1], fictionStripe: this }),
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

        const { orgId, orgEmail, orgName } = o
        await this.queries.ManageCustomer.serve(
          { _action: 'update', orgId, fields: { email: orgEmail, name: orgName } },
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

  getCurrentCustomerDetails = async (): Promise<types.CustomerDetails | undefined> => {
    return getCurrentCustomerDetails({ fictionStripe: this })
  }

  getServerClient(): Stripe {
    if (!this.serverClient) {
      this.serverClient = getStripeServerClient({ fictionStripe: this })
    }

    return this.serverClient
  }

  getBrowserClient = async (): Promise<StripeJS.Stripe> => {
    if (!this.browserClient) {
      this.browserClient = await getStripeBrowserClient({ fictionStripe: this })
    }

    return this.browserClient
  }
}
