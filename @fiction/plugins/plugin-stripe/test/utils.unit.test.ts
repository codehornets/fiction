/**
 * @vitest-environment happy-dom
 */

import type { Stripe } from 'stripe'

import type { CustomerData, StripeProductConfig } from '../types'
import { dayjs, type Organization, vue } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { FictionStripe } from '..'
import { checkoutEndpointHandler, getCheckoutConfig, getCheckoutUrl, getCycleRange, getPortalUrl, processCustomerData } from '../utils'

describe('stripe Utils', async () => {
  // Create FictionStripe before test utils initialization
  const testUtils = await createSiteTestUtils()

  const fictionStripe = new FictionStripe({
    ...testUtils,
    secretKeyTest: testUtils.fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
    publicKeyTest: testUtils.fictionEnv.var('STRIPE_PUBLIC_KEY_TEST'),
    customerPortalUrl: 'https://test.portal.url',
    products: [{
      productId: 'prod_test',
      alias: 'standard',
      tier: 10,
      pricing: [{
        priceId: 'price_test',
        duration: 'month',
        cost: 10,
        costPerUnit: 10,
        credits: 1000,
        quantity: 1,
        group: 'standard',
      }],
    }],
  })

  // Initialize test utils after FictionStripe creation
  const initialized = await testUtils.init()
  const { orgId } = initialized

  // Reset functionality
  const resetStripeState = () => {
    // Clear any mocks
    vi.clearAllMocks()
    // Reset instance properties that might be modified during tests
    fictionStripe.browserClient = undefined
    fictionStripe.serverClient = undefined
  }

  beforeEach(() => {
    resetStripeState()
  })

  describe('getPortalUrl', () => {
    it('returns portal session URL when session creation succeeds', async () => {
      const mockSuccessUrl = 'https://portal.session.url'
      const returnUrl = 'https://return.url'

      vi.spyOn(fictionStripe.requests.PortalSession, 'projectRequest').mockResolvedValueOnce({
        status: 'success',
        data: { url: mockSuccessUrl } as Stripe.BillingPortal.Session,
      })

      const result = await getPortalUrl({
        fictionStripe,
        returnUrl,
      })

      expect(result).toBe(mockSuccessUrl)
    })

    it('returns default portal URL with prefilled email when session creation fails', async () => {
      const mockCustomerEmail = 'test@example.com'
      vi.spyOn(fictionStripe.requests.PortalSession, 'projectRequest').mockResolvedValueOnce({
        status: 'error',
      })

      vi.spyOn(fictionStripe.queries.ManageCustomer, 'serve').mockResolvedValueOnce({
        status: 'success',
        data: {
          customer: { email: mockCustomerEmail } as any,
        } as CustomerData,
      })

      const result = await getPortalUrl({ fictionStripe })

      expect(result).toBe(`https://test.portal.url?prefilled_email=${encodeURIComponent(mockCustomerEmail)}`)
    })
  })

  describe('getCheckoutUrl', () => {
    it('returns checkout initialization URL for authenticated user', async () => {
      const query = {
        priceId: 'price_test',
        trialPeriod: '14',
      }

      const result = await getCheckoutUrl({
        fictionStripe,
        query,
      })

      expect(result).toContain('/api/stripe-checkout/init')
      expect(result).toContain('priceId=price_test')
      expect(result).toContain('trialPeriod=14')
    })

    it('returns login redirect URL for unauthenticated user', async () => {
      // Mock user as not authenticated
      vi.spyOn(fictionStripe.settings.fictionUser, 'activeUser', 'get').mockReturnValue(vue.ref(undefined))

      const query = {
        priceId: 'price_test',
        loginPath: '/login',
      }

      // Mock window.location
      const mockLocation = new URL('https://test.com/checkout')
      vi.stubGlobal('location', mockLocation)

      const result = await getCheckoutUrl({
        fictionStripe,
        query,
      })

      expect(result).toBe(`/login?redirect=${encodeURIComponent(mockLocation.href)}`)

      // Clean up global stub
      vi.unstubAllGlobals()
    })
  })

  describe('checkoutEndpointHandler', () => {
    // Helper to create properly chained mock response
    const createMockResponse = () => {
      const res = {
        status: vi.fn(),
        send: vi.fn(),
        redirect: vi.fn(),
        end: vi.fn(),
      }
      res.status.mockReturnValue(res)
      res.send.mockReturnValue(res)
      return res
    }

    it('creates checkout session and redirects on successful initialization', async () => {
      const mockRequest = {
        params: { action: 'init' },
        query: {
          priceId: 'price_test',
          orgId,
        },
      }

      const mockResponse = createMockResponse()

      // Mock customer retrieval
      vi.spyOn(fictionStripe.queries.ManageCustomer, 'serve').mockResolvedValueOnce({
        status: 'success',
        data: {
          customer: { id: 'cus_test' },
        } as CustomerData,
      })

      // Mock stripe checkout session creation
      const mockSessionUrl = 'https://checkout.stripe.com/test'
      vi.spyOn(fictionStripe, 'getServerClient').mockReturnValue({
        checkout: {
          sessions: {
            create: vi.fn().mockResolvedValue({ url: mockSessionUrl }),
          },
        },
      } as any)

      await checkoutEndpointHandler({
        fictionStripe,
        request: mockRequest as any,
        response: mockResponse as any,
      })

      expect(mockResponse.redirect).toHaveBeenCalledWith(303, mockSessionUrl)
    })

    it('handles missing priceId error', async () => {
      const mockRequest = {
        params: { action: 'init' },
        query: { orgId },
      }

      const mockResponse = createMockResponse()

      await checkoutEndpointHandler({
        fictionStripe,
        request: mockRequest as any,
        response: mockResponse as any,
      })

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 'error',
        message: 'no priceId',
      })
      expect(mockResponse.end).toHaveBeenCalled()
    })

    it('handles invalid action parameter', async () => {
      const mockRequest = {
        params: { action: 'invalid' },
        query: {
          priceId: 'price_test',
          orgId,
        },
      }

      const mockResponse = createMockResponse()

      await checkoutEndpointHandler({
        fictionStripe,
        request: mockRequest as any,
        response: mockResponse as any,
      })

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 'error',
        message: 'invalid action',
      })
      expect(mockResponse.end).toHaveBeenCalled()
    })

    it('handles missing orgId error', async () => {
      const mockRequest = {
        params: { action: 'init' },
        query: {
          priceId: 'price_test',
        },
      }

      const mockResponse = createMockResponse()

      await checkoutEndpointHandler({
        fictionStripe,
        request: mockRequest as any,
        response: mockResponse as any,
      })

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 'error',
        message: 'no orgId',
      })
      expect(mockResponse.end).toHaveBeenCalled()
    })
  })

  describe('getCheckoutConfig', () => {
    it('returns default success and cancel URLs when no callbacks provided', () => {
      const result = getCheckoutConfig({
        orgId,
        fictionStripe,
      })

      const baseUrl = fictionStripe.settings.fictionApp.appUrl.value

      expect(result).toEqual({
        successUrl: `${baseUrl}/checkout-success`,
        cancelUrl: `${baseUrl}/checkout-cancel`,
      })
    })

    it('uses custom success and cancel paths when callbacks provided', () => {
      // Create temporary instance with custom callbacks
      const tempFictionStripe = new FictionStripe({
        ...fictionStripe.settings,
        checkoutSuccessPathname: () => '/custom-success',
        checkoutCancelPathname: () => '/custom-cancel',
      })

      const result = getCheckoutConfig({
        orgId,
        fictionStripe: tempFictionStripe,
      })

      const baseUrl = tempFictionStripe.settings.fictionApp.appUrl.value

      expect(result).toEqual({
        successUrl: `${baseUrl}/custom-success`,
        cancelUrl: `${baseUrl}/custom-cancel`,
      })
    })
  })
})

describe('getCycleRange', () => {
  beforeAll(() => {
    // Ensure consistent timezone for tests
    process.env.TZ = 'UTC'
  })

  it('calculates correct cycle range when anchor date exists in current month', () => {
    // Fixed timestamp for January 15, 2024 10:00 UTC
    const timestamp = 1705312800
    // Fixed "now" time for January 20, 2024 10:00 UTC
    const now = dayjs.utc('2024-01-20T10:00:00Z')

    const result = getCycleRange({ timestamp, now })

    expect(result.anchorDateUtc).toBe(15)
    // Convert results to UTC for comparison
    expect(result.timeStart.utc().format('YYYY-MM-DD HH:mm')).toBe('2023-12-15 10:00')
    expect(result.timeEnd.utc().format('YYYY-MM-DD HH:mm')).toBe('2024-01-15 10:00')
  })

  it('adjusts cycle range when anchor date exceeds days in month', () => {
    // Fixed timestamp for January 31, 2024 10:00 UTC
    const timestamp = 1706695200
    // Fixed "now" time for February 20, 2024 10:00 UTC
    const now = dayjs.utc('2024-02-20T10:00:00Z')

    const result = getCycleRange({ timestamp, now })

    expect(result.anchorDateUtc).toBe(31)
    // February only has 29 days in 2024 (leap year)
    expect(result.timeEnd.utc().format('YYYY-MM-DD HH:mm')).toBe('2024-02-29 10:00')
    expect(result.timeStart.utc().format('YYYY-MM-DD HH:mm')).toBe('2024-01-31 10:00')
  })

  it('maintains hour value across month boundaries', () => {
    // Fixed timestamp for January 15, 2024 23:30 UTC
    const timestamp = 1705362600
    // Fixed "now" time for February 1, 2024 12:00 UTC
    const now = dayjs.utc('2024-02-01T12:00:00Z')

    const result = getCycleRange({ timestamp, now })

    // Convert hours to UTC for comparison
    expect(result.timeStart.utc().hour()).toBe(23)
    expect(result.timeEnd.utc().hour()).toBe(23)
  })

  it('handles timezone conversions correctly', () => {
    // Test with a specific non-UTC timezone
    const timestamp = 1705312800 // January 15, 2024 10:00 UTC
    const now = dayjs.utc('2024-01-20T10:00:00Z')

    const result = getCycleRange({ timestamp, now })

    // Verify UTC time components
    expect(result.timeStart.utc().hour()).toBe(10)
    expect(result.timeEnd.utc().hour()).toBe(10)
    expect(result.timeStart.utc().date()).toBe(15)
    expect(result.timeEnd.utc().date()).toBe(15)
  })
})

describe('processCustomerData', () => {
  const baseOrg = {
    orgId: 'org123',
    orgName: 'Test Org',
    customerId: 'cus_123',
    createdAt: '2024-01-01T00:00:00Z',
  } as Organization

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

  it('returns free tier details when no subscription exists', () => {
    const result = processCustomerData({
      products: baseProducts,
      customerDataResponse: { status: 'success', data: { org: baseOrg } },
    })

    expect(result).toMatchObject({
      plan: 'free',
      planName: 'Free',
      tier: 0,
      quantity: 0,
      credits: 0,
      isTrial: false,
      isCanceled: false,
    })
    expect(result.cycleStartAtIso).toBeTruthy()
    expect(result.cycleEndAtIso).toBeTruthy()
  })

  it('processes active subscription data correctly', () => {
    const customerData: CustomerData = {
      customer: { id: 'cus_123' } as any,
      subscriptions: [{
        id: 'sub_123',
        status: 'active',
        billing_cycle_anchor: dayjs('2024-01-15T10:00:00Z').unix(),
        items: {
          data: [{
            price: { id: 'price_123' },
          }],
        },
      } as any],
      org: baseOrg,
    }

    const customerDataResponse = { status: 'success' as const, data: customerData }

    const result = processCustomerData({
      products: baseProducts,
      customerDataResponse,
    })

    expect(result).toMatchObject({
      plan: 'standard',
      planName: 'Standard Monthly',
      tier: 10,
      quantity: 1,
      credits: 1000,
      subscriptionId: 'sub_123',
      isTrial: false,
      isCanceled: false,
    })
  })

  it('handles trial subscriptions correctly', () => {
    const customerData: CustomerData = {
      customer: { id: 'cus_123' } as any,
      subscriptions: [{
        id: 'sub_123',
        status: 'trialing',
        billing_cycle_anchor: dayjs('2024-01-15T10:00:00Z').unix(),
        items: {
          data: [{
            price: { id: 'price_123' },
          }],
        },
      } as any],
      org: baseOrg,
    }

    const customerDataResponse = { status: 'success' as const, data: customerData }

    const result = processCustomerData({
      products: baseProducts,
      customerDataResponse,
    })

    expect(result.isTrial).toBe(true)
  })

  it('handles special plans correctly', () => {
    const customerDataResponse = { status: 'success' as const, data: { org: { ...baseOrg, specialPlan: 'vip' as const } } }
    const result = processCustomerData({
      products: baseProducts,
      customerDataResponse,
    })

    expect(result.planName).toBe('Free (vip)')
    expect(result.specialPlan).toBe('vip')
  })

  it('falls back to free tier when subscription price is not found', () => {
    const customerData: CustomerData = {
      subscriptions: [{
        id: 'sub_123',
        status: 'active',
        billing_cycle_anchor: dayjs('2024-01-15T10:00:00Z').unix(),
        items: {
          data: [{
            price: { id: 'invalid_price' },
          }],
        },
      } as any],
      org: baseOrg,
    }

    const customerDataResponse = { status: 'success' as const, data: customerData }

    const result = processCustomerData({
      products: baseProducts,
      customerDataResponse,
    })

    // Should fall back to free tier
    expect(result.plan).toBe('free')
    expect(result.tier).toBe(0)
    expect(result.planName).toBe('Free')
  })

  it('processes active subscription even when some subscriptions have invalid prices', () => {
    const customerData: CustomerData = {
      subscriptions: [
        // Invalid subscription first
        {
          id: 'sub_invalid',
          status: 'active',
          billing_cycle_anchor: dayjs('2024-01-15T10:00:00Z').unix(),
          items: {
            data: [{
              price: { id: 'invalid_price' },
            }],
          },
        } as any,
        // Valid subscription second
        {
          id: 'sub_123',
          status: 'active',
          billing_cycle_anchor: dayjs('2024-01-15T10:00:00Z').unix(),
          items: {
            data: [{
              price: { id: 'price_123' },
            }],
          },
        } as any,
      ],
      org: baseOrg,
    }

    const customerDataResponse = { status: 'success' as const, data: customerData }

    const result = processCustomerData({
      products: baseProducts,
      customerDataResponse,
    })

    // Should use the valid subscription
    expect(result.plan).toBe('standard')
    expect(result.subscriptionId).toBe('sub_123')
    expect(result.priceId).toBe('price_123')
  })
})
