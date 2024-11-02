/**
 * @vitest-environment happy-dom
 */
import type { CustomerData, CustomerDetails, StripeProductConfig } from '../types'
import { dayjs, type Organization, waitFor } from '@fiction/core'
import { testEnvFile } from '@fiction/core/test-utils'

import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { FictionStripe } from '..'
import { getCycleRange, processCustomerData } from '../utils'

describe('stripe plugin', async () => {
  const testUtils = await createSiteTestUtils()

  const baseProducts: StripeProductConfig[] = [{
    productId: 'prod_123',
    alias: 'standard',
    tier: 10,
    pricing: [{
      priceId: 'price_123',
      duration: 'month',
      cost: 10,
      costPerUnit: 10,
      credits: 1000,
      quantity: 1,
      group: 'standard',
      planName: 'Standard Monthly',
    }],
  }]

  const initialized = await testUtils.init()
  const { user, orgId } = initialized

  const fictionStripe = new FictionStripe({
    ...testUtils,
    products: baseProducts,
    customerPortalUrl: '#',
    useCustomerManager: true,
    secretKeyTest: testUtils.fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
    publicKeyTest: testUtils.fictionEnv.var('STRIPE_PUBLIC_KEY_TEST'),
  })

  describe('customer initialization', () => {

  })
})
