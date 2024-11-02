import type { Organization } from '@fiction/core'
import type { FictionStripe } from './plugin'
import type { CustomerData, CustomerDetails, StripeProductConfig } from './types'
import { dayjs, toLabel } from '@fiction/core'

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
  organization: Pick<Organization, 'orgId' | 'orgName' | 'specialPlan' | 'createdAt' | 'customerId'>
  products: StripeProductConfig[]
}

export function processCustomerData(args: ProcessCustomerDataArgs): CustomerDetails {
  const { customerData, organization, products } = args
  const { orgId, specialPlan, customerId, createdAt } = organization

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
  organization: Organization
  fictionStripe: FictionStripe
  products: StripeProductConfig[]
}): Promise<CustomerDetails> {
  const { organization, fictionStripe, products } = args

  if (!organization?.orgId) {
    throw new Error('No organization ID provided')
  }

  const fictionUser = fictionStripe.settings.fictionUser

  await fictionUser.userInitialized({ caller: 'setCustomerData' })

  const customerDataResponse = await fictionStripe.requests.ManageCustomer.projectRequest({
    _action: 'retrieve',
  })

  return processCustomerData({
    customerData: customerDataResponse.data,
    organization,
    products,
  })
}
