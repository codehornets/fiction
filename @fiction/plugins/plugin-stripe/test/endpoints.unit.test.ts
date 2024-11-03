import type { EndpointMeta } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { query } from 'express'
import { describe, expect, it } from 'vitest'
import { FictionStripe } from '..'
import { mockStripeMethods } from '../.ref/stripeMocks'
import { QueryManageCustomer } from '../endpoints'

describe('queryManageCustomer', async () => {
  // Set up test utilities and initial state
  const testUtils = await createSiteTestUtils()
  const initialized = await testUtils.init()
  const { user, orgId } = initialized

  const userId = user.userId

  if (!userId) {
    throw new Error('No user ID provided')
  }

  // Initialize FictionStripe with mocked Stripe client
  const fictionStripe = new FictionStripe({
    ...testUtils,
    secretKeyTest: testUtils.fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
    publicKeyTest: testUtils.fictionEnv.var('STRIPE_PUBLIC_KEY_TEST'),
    customerPortalUrl: '#',
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

  describe('create action', () => {
    it('creates a new customer successfully', async () => {
      // Create a fresh organization for this test
      const newOrg = await testUtils.fictionUser.queries.ManageOrganization.serve({
        _action: 'create',
        userId,
        fields: {
          orgName: 'Test Create Org',
          orgEmail: 'test@create.com',
        },
      }, { server: true })

      const orgId = newOrg.data?.orgId

      if (!orgId) {
        throw new Error('No orgId provided')
      }

      const params = {
        _action: 'create' as const,
        orgId,
        fields: {
          orgId,
          email: 'test@example.com',
          name: 'Test Customer',
        },
      }

      const result = await fictionStripe.queries.ManageCustomer.serve(params, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.customer?.email).toBe('test@example.com')
      expect(result.data?.subscriptions).toEqual([])
    })

    it('throws error when orgId is missing', async () => {
      const params = {
        _action: 'create' as const,
        fields: {
          email: 'test@example.com',
          name: 'Test Customer',
        } as any,
        orgId: '',
      }

      const r = await fictionStripe.queries.ManageCustomer.serve(params, { server: true, expectError: true } as EndpointMeta)

      expect(r.status).toBe('error')
      expect(r.message).toMatchInlineSnapshot(`"Missing orgId"`)
    })
  })

  describe('update action', () => {
    it('updates customer details successfully', async () => {
      const newOrg = await testUtils.fictionUser.queries.ManageOrganization.serve({
        _action: 'create',
        userId,
        fields: {
          orgName: 'Test Update Org',
          orgEmail: 'test@update.com',
        },
      }, { server: true })

      const orgId = newOrg.data?.orgId

      if (!orgId) {
        throw new Error('No orgId provided')
      }

      // First create a customer
      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        fields: {
          email: 'initial@example.com',
          name: 'Initial Name',
        },
        orgId,
      }, { server: true } as EndpointMeta)

      // Then update it
      const params = {
        _action: 'update' as const,
        orgId,
        fields: {
          email: 'updated@example.com',
          name: 'Updated Name',
        },
      }

      const result = await fictionStripe.queries.ManageCustomer.serve(params, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.customer).toMatchObject({
        email: 'updated@example.com',
        name: 'Updated Name',
      })
      // expect(mockStripeMethods.customers.update).toHaveBeenCalledWith(
      //   mockStripeCustomer.id,
      //   expect.objectContaining({
      //     email: 'updated@example.com',
      //     name: 'Updated Name',
      //   }),
      // )
    })
  })

  describe('retrieve action', () => {
    it('retrieves customer by orgId successfully', async () => {
      const newOrg = await testUtils.fictionUser.queries.ManageOrganization.serve({
        _action: 'create',
        userId,
        fields: {
          orgName: 'Test Retrieve Org',
          orgEmail: 'test@retrieve.com',
        },
      }, { server: true })

      const orgId = newOrg.data?.orgId

      if (!orgId) {
        throw new Error('No orgId provided')
      }

      // First create a customer
      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
        fields: {
          email: 'retrieve@example.com',
          name: 'Retrieve Test',
        },
      }, { server: true } as EndpointMeta)

      const result = await fictionStripe.queries.ManageCustomer.serve({
        _action: 'retrieve',
        orgId,
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.customer?.email).toEqual('retrieve@example.com')
      expect(result.data?.subscriptions).toEqual([])
    })

    it('handles missing org gracefully', async () => {
      mockStripeMethods.customers.retrieve.mockResolvedValueOnce(undefined)

      const params = {
        _action: 'retrieve' as const,
        orgId: '',
      }

      const r = await fictionStripe.queries.ManageCustomer.serve(params, { server: true, expectError: true } as EndpointMeta)

      expect(r.status).toBe('error')
      expect(r.message).toMatchInlineSnapshot(`"Missing orgId"`)
    })
  })

  describe('delete action', () => {
    it('deletes customer successfully', async () => {
      const newOrg = await testUtils.fictionUser.queries.ManageOrganization.serve({
        _action: 'create',
        userId,
        fields: {
          orgName: 'Test Delete Org',
          orgEmail: 'test@delete.com',
        },
      }, { server: true })

      const orgId = newOrg.data?.orgId

      if (!orgId) {
        throw new Error('No orgId provided')
      }

      // First create a customer
      const r = await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        fields: {
          email: 'delete@example.com',
          name: 'Delete Test',
        },
        orgId,
      }, { server: true } as EndpointMeta)

      const result = await fictionStripe.queries.ManageCustomer.serve({
        _action: 'delete',
        orgId,
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.customer).toMatchObject({
        id: r.data?.customer?.id,
        deleted: true,
      })
    })
  })
})

describe('queryPortalSession', async () => {
  // Set up test utilities and initial state
  const testUtils = await createSiteTestUtils()
  const initialized = await testUtils.init()
  const { user, orgId } = initialized

  const userId = user.userId

  if (!userId) {
    throw new Error('No user ID provided')
  }

  // Initialize FictionStripe with test configuration
  const fictionStripe = new FictionStripe({
    ...testUtils,
    secretKeyTest: testUtils.fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
    publicKeyTest: testUtils.fictionEnv.var('STRIPE_PUBLIC_KEY_TEST'),
    customerPortalUrl: '#',
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

  describe('portal session creation', () => {
    it('creates portal session successfully with valid customer', async () => {
      // First create a test customer
      const customer = await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
        fields: {
          email: 'portal-test@example.com',
          name: 'Portal Test Customer',
        },
      }, { server: true } as EndpointMeta)

      // Attempt to create portal session
      const result = await fictionStripe.queries.PortalSession.serve({
        orgId,
        returnUrl: 'http://localhost:3000/return',
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data).toBeDefined()
      expect(result.data?.url).toBeDefined()
      expect(result.data?.customer).toBe(customer.data?.customer?.id)
    })

    it('handles missing orgId gracefully', async () => {
      const result = await fictionStripe.queries.PortalSession.serve({
        orgId: '',
        returnUrl: 'http://localhost:3000/return',
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toMatchInlineSnapshot(`"customerId not found"`)
    })

    it('handles non-existent customer gracefully', async () => {
      // Create a fresh organization without a customer
      const newOrg = await testUtils.fictionUser.queries.ManageOrganization.serve({
        _action: 'create',
        userId,
        fields: {
          orgName: 'Test No Customer Org',
          orgEmail: 'no-customer@test.com',
        },
      }, { server: true })

      const result = await fictionStripe.queries.PortalSession.serve({
        orgId: newOrg.data?.orgId || '',
        returnUrl: 'http://localhost:3000/return',
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toMatchInlineSnapshot(`"customerId not found"`)
    })

    it('creates session with custom return URL', async () => {
      // First create a test customer
      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
        fields: {
          email: 'return-url@example.com',
          name: 'Return URL Test',
        },
      }, { server: true } as EndpointMeta)

      const customUrl = 'https://custom-domain.com/return'
      const result = await fictionStripe.queries.PortalSession.serve({
        orgId,
        returnUrl: customUrl,
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.return_url).toBe(customUrl)
    })

    it('handles deleted customers appropriately', async () => {
      // Create and then delete a customer
      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
        fields: {
          email: 'deleted@example.com',
          name: 'To Be Deleted',
        },
      }, { server: true } as EndpointMeta)

      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'delete',
        orgId,
      }, { server: true } as EndpointMeta)

      const result = await fictionStripe.queries.PortalSession.serve({
        orgId,
        returnUrl: 'http://localhost:3000/return',
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toMatchInlineSnapshot(`"customerId not found"`)
    })

    it('handles stripe API errors gracefully', async () => {
      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
        fields: {
          email: 'api-err@example.com',
          name: 'API Error Test',
        },
      }, { server: true } as EndpointMeta)

      // Mock a stripe API error
      const originalClient = fictionStripe.getServerClient
      fictionStripe.getServerClient = () => ({
        ...mockStripeMethods,
        billingPortal: {
          sessions: {
            create: () => {
              throw new Error('Stripe API Error')
            },
          },
        },
      }) as any

      const result = await fictionStripe.queries.PortalSession.serve({
        orgId,
        returnUrl: 'http://localhost:3000/return',
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toContain('Payment API Error')

      // Restore original client
      fictionStripe.getServerClient = originalClient
    })
  })
})
