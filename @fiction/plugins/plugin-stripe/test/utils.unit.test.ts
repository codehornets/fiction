/**
 * @vitest-environment happy-dom
 */
import type { CustomerData, StripeProductConfig } from '../types'
import { dayjs, type Organization } from '@fiction/core'
import { beforeAll, describe, expect, it } from 'vitest'
import { getCycleRange, processCustomerData } from '../utils'

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
      organization: baseOrg,
      products: baseProducts,
      customerData: undefined,
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
    }

    const result = processCustomerData({
      organization: baseOrg,
      products: baseProducts,
      customerData,
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
    }

    const result = processCustomerData({
      organization: baseOrg,
      products: baseProducts,
      customerData,
    })

    expect(result.isTrial).toBe(true)
  })

  it('handles special plans correctly', () => {
    const result = processCustomerData({
      organization: { ...baseOrg, specialPlan: 'vip' },
      products: baseProducts,
      customerData: undefined,
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
    }

    const result = processCustomerData({
      organization: baseOrg,
      products: baseProducts,
      customerData,
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
    }

    const result = processCustomerData({
      organization: baseOrg,
      products: baseProducts,
      customerData,
    })

    // Should use the valid subscription
    expect(result.plan).toBe('standard')
    expect(result.subscriptionId).toBe('sub_123')
    expect(result.priceId).toBe('price_123')
  })
})
