import type * as StripeJS from '@stripe/stripe-js'
import type express from 'express'
import type { FictionStripe } from './plugin'
import type { CheckoutQueryParams, CustomerData, CustomerDetails, StripeProductConfig } from './types'
import { abort, dayjs, toLabel } from '@fiction/core'
import Stripe from 'stripe'

export async function getPortalUrl(args: { fictionStripe: FictionStripe, returnUrl?: string }): Promise<string> {
  const { fictionStripe, returnUrl } = args

  const portalSession = await fictionStripe.requests.PortalSession.projectRequest({ returnUrl })

  if (portalSession.status === 'success' && portalSession.data?.url) {
    return portalSession.data?.url
  }

  const customerDetails = await getCurrentCustomerDetails({ fictionStripe })
  const stripeCustomer = customerDetails?.customer

  let prefilledEmail = ''
  if (stripeCustomer && 'email' in stripeCustomer)
    prefilledEmail = `?prefilled_email=${encodeURIComponent(stripeCustomer.email || '')}`

  return `${fictionStripe.settings.customerPortalUrl}${prefilledEmail}`
}

export async function getCheckoutUrl(args: { fictionStripe: FictionStripe, query: CheckoutQueryParams }): Promise<string> {
  const { query, fictionStripe } = args

  const { loginPath } = query

  if (fictionStripe.fictionEnv?.isNode)
    return '#'

  await fictionStripe.settings.fictionUser.userInitialized({ caller: 'getCheckoutUrl' })

  const u = fictionStripe.settings.fictionUser.activeUser.value

  let link

  if (u) {
    const baseUrl = fictionStripe.settings.fictionServer.serverUrl.value
    const url = new URL(`${baseUrl}/api/stripe-checkout/init`)

    query.orgId = fictionStripe.settings.fictionUser.activeOrgId.value || ':orgId'

    if (args)
      url.search = new URLSearchParams(query as Record<string, string>).toString()

    link = url.toString()
  }
  else if (typeof location !== 'undefined') {
    const redirect = encodeURIComponent(location.href)
    link = `${loginPath}?redirect=${redirect}`
  }

  return link || ''
}

export function getStripeServerClient(args: { fictionStripe: FictionStripe }): Stripe {
  const { fictionStripe } = args
  const key = fictionStripe.secretKey.value

  if (!key)
    throw new Error(`stripe getServerClient: secretKey not found (${fictionStripe.stripeMode.value})`)

  return new Stripe(key, { apiVersion: fictionStripe.apiVersion })
}

export async function getStripeBrowserClient(args: { fictionStripe: FictionStripe }): Promise<StripeJS.Stripe> {
  const { fictionStripe } = args

  const StripeJS = await import('@stripe/stripe-js')

  const publicKey = fictionStripe.publicKey.value
  if (!publicKey)
    throw new Error(`Stripe getBrowserClient: publicKey not found (${fictionStripe.stripeMode.value})`)

  const createdClient = await StripeJS.loadStripe(publicKey)

  if (!createdClient)
    throw new Error('no stripe client created')

  return createdClient
}

export async function checkoutEndpointHandler(args: {
  fictionStripe: FictionStripe
  request: express.Request
  response: express.Response
}): Promise<void> {
  const { fictionStripe, request, response } = args
  const query = request.query as Record<string, string>
  const params = request.params as { action?: 'init' }

  const { action } = params

  if (!action) {
    fictionStripe.log.error('Invalid request', { action })
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

      const r = await fictionStripe.queries.ManageCustomer.serve({ orgId, _action: 'retrieve' }, { server: true })

      const customerId = r.data?.customer?.id

      if (!customerId)
        throw abort('no customerId')

      const stripe = fictionStripe.getServerClient()

      const { successUrl, cancelUrl } = getCheckoutConfig({
        orgId,
        fictionStripe,
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

      fictionStripe.log.info('creating checkout session', {
        data: {
          details,
          stripeMode: fictionStripe.stripeMode.value,
          publicKey: fictionStripe.publicKey.value,
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
    fictionStripe.log.error('endpoint threw an error', { error })
    response.status(400).send({ status: 'error', message: e.message }).end()
  }
}

export function getCheckoutConfig(args: { orgId: string, fictionStripe: FictionStripe }) {
  const { fictionStripe } = args
  const base = fictionStripe.settings.fictionApp.appUrl.value
  const successPathCallback = fictionStripe.settings.checkoutSuccessPathname
  const cancelPathCallback = fictionStripe.settings.checkoutCancelPathname

  const successPath = successPathCallback ? successPathCallback(args) : '/checkout-success'
  const cancelPath = cancelPathCallback ? cancelPathCallback(args) : '/checkout-cancel'

  const config = {
    successUrl: `${base}${successPath}`,
    cancelUrl: `${base}${cancelPath}`,
  }

  fictionStripe.log.info('checkout config', { data: config })

  return config
}

export function getCycleRange(args: {
  timestamp: number
  now?: dayjs.Dayjs
}) {
  const { timestamp, now = dayjs.utc() } = args

  // Ensure UTC handling throughout
  const timestampDate = dayjs.unix(timestamp).utc()
  const hour = timestampDate.hour()
  const anchorDateUtc = timestampDate.date()

  const daysInCurrentMonth = now.clone().utc().daysInMonth()
  const daysInLastMonth = now.clone().utc().subtract(1, 'month').daysInMonth()

  const endDay = daysInCurrentMonth < anchorDateUtc ? daysInCurrentMonth : anchorDateUtc
  const startDay = daysInLastMonth < anchorDateUtc ? daysInLastMonth : anchorDateUtc

  // Create times in UTC
  const timeEnd = now.clone().utc().date(endDay).hour(hour)
  const timeStart = now.clone().utc().subtract(1, 'month').date(startDay).hour(hour)

  return { anchorDateUtc, timeEnd, timeStart }
}

type ProcessCustomerDataArgs = {
  customerData?: CustomerData
  products: StripeProductConfig[]
}

export function processCustomerData(args: ProcessCustomerDataArgs): CustomerDetails {
  const { customerData, products } = args
  const org = customerData?.org
  const { orgId, specialPlan, customerId, createdAt } = org || {}

  const basics = {
    specialPlan: specialPlan as CustomerDetails['specialPlan'],
    customerId,
    orgId,
    customer: customerData?.customer,
  }

  // Get all possible pricing configurations
  const pricing = products.flatMap(product =>
    product.pricing.map(price => ({
      ...product,
      ...price,
      planName: price.planName || toLabel(price.alias || ''),
    })),
  )

  // Try to find active subscription details
  const activeSubscription = customerData?.subscriptions?.find((sub) => {
    // First verify subscription has valid items data
    if (!sub.items?.data?.[0]?.price?.id)
      return false

    // Then check if price exists and subscription is active/trialing
    const price = pricing.find(p => p.priceId === sub.items.data[0].price.id)
    return price && (sub.status === 'trialing' || sub.status === 'active')
  })

  // If we have an active subscription with valid pricing, process its details
  if (activeSubscription) {
    const price = pricing.find(p => p.priceId === activeSubscription.items.data[0].price.id)
    // This should never happen due to the find condition above
    if (!price) {
      return createFreeTierDetails({ basics, createdAt })
    }

    const { timeEnd, timeStart, anchorDateUtc } = getCycleRange({
      timestamp: activeSubscription.billing_cycle_anchor,
    })

    return {
      ...basics,
      ...price,
      plan: price.alias || 'unknown',
      quantity: price.quantity || 0,
      credits: price.credits || 0,
      link: '',
      icon: 'i-carbon-star',
      subscriptionId: activeSubscription.id,
      isTrial: activeSubscription.status === 'trialing',
      anchorDateUtc,
      cyclePeriod: 'month',
      cycleEndAtIso: timeEnd.toISOString(),
      cycleStartAtIso: timeStart.toISOString(),
      isCanceled: !!activeSubscription.canceled_at,
      tier: price.tier || 0,
    }
  }

  return createFreeTierDetails({ basics, createdAt })
}

// Helper function to create free tier details
function createFreeTierDetails(args: {
  basics: Pick<CustomerDetails, 'specialPlan' | 'customerId' | 'orgId' | 'customer'>
  createdAt?: string
}): CustomerDetails {
  const { basics, createdAt } = args
  const now = dayjs()
  const cycleStartAt = dayjs(createdAt)
    .year(now.year())
    .month(now.month())

  const adjustedCycleStartAt = cycleStartAt.isAfter(now)
    ? cycleStartAt.subtract(1, 'month')
    : cycleStartAt

  const cycleEndAt = adjustedCycleStartAt.add(1, 'month')

  return {
    ...basics,
    plan: 'free',
    planName: basics.specialPlan ? `Free (${basics.specialPlan})` : 'Free',
    tier: 0,
    quantity: 0,
    credits: 0,
    link: '',
    icon: 'i-carbon-star-half',
    isTrial: false,
    priceId: '',
    cost: 0,
    group: 'free',
    costPerUnit: 0,
    duration: 'month',
    cycleStartAtIso: adjustedCycleStartAt.toISOString(),
    cycleEndAtIso: cycleEndAt.toISOString(),
    isCanceled: false,
  }
}

export async function setCustomerData(args: {
  orgId: string
  fictionStripe: FictionStripe
}): Promise<CustomerDetails> {
  const { fictionStripe } = args

  const products = fictionStripe.settings.products

  const fictionUser = fictionStripe.settings.fictionUser

  await fictionUser.userInitialized({ caller: 'setCustomerData' })

  const customerDataResponse = await fictionStripe.requests.ManageCustomer.projectRequest({
    _action: 'retrieve',
  })

  return processCustomerData({
    customerData: customerDataResponse.data,
    products,
  })
}

export async function getCurrentCustomerDetails(args: { fictionStripe: FictionStripe }): Promise<CustomerDetails | undefined> {
  const { fictionStripe } = args

  await fictionStripe.settings.fictionUser.userInitialized({ caller: 'setCustomerData' })

  const orgId = fictionStripe.settings.fictionUser.activeOrgId.value

  if (!orgId)
    throw new Error('No active organization')

  const currentCustomerDetails = await setCustomerData({ orgId, fictionStripe })

  return currentCustomerDetails
}
