import type { EndpointMeta } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { describe, expect, it } from 'vitest'
import { FictionStripe } from '..'
import { QueryManageCustomer } from '../endpoints'
import { mockStripeMethods } from './stripeMocks'

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
    products: [],
  })

  // Set up stripe client mock
  // fictionStripe.getServerClient = vi.fn().mockReturnValue({
  //   ...mockStripeMethods,
  //   customers: {
  //     ...mockStripeMethods.customers,
  //     del: vi.fn().mockResolvedValue({ ...mockStripeCustomer, deleted: true }),
  //   },
  // })

  // Create query instance with real testUtils and mocked stripe
  const query = new QueryManageCustomer({ ...testUtils, fictionStripe })

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

      const result = await query.serve(params, { server: true } as EndpointMeta)

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

      const r = await query.serve(params, { server: true } as EndpointMeta)

      expect(r.status).toBe('error')
      expect(r.message).toBe('No orgId provided')
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
      await query.serve({
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

      const result = await query.serve(params, { server: true } as EndpointMeta)

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
      await query.serve({
        _action: 'create',
        orgId,
        fields: {
          email: 'retrieve@example.com',
          name: 'Retrieve Test',
        },
      }, { server: true } as EndpointMeta)

      const result = await query.serve({
        _action: 'retrieve',
        orgId,
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.customer?.email).toEqual('retrieve@example.com')
      expect(result.data?.subscriptions).toEqual([])
    })

    it('handles missing customer gracefully', async () => {
      mockStripeMethods.customers.retrieve.mockResolvedValueOnce(undefined)

      const params = {
        _action: 'retrieve' as const,
        where: { customerId: 'non-existent' },
        orgId: '',
      }

      const r = await query.serve(params, { server: true } as EndpointMeta)

      expect(r.status).toBe('error')
      expect(r.message).toMatchInlineSnapshot(`"Payment API Error"`)
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
      const r = await query.serve({
        _action: 'create',
        fields: {
          email: 'delete@example.com',
          name: 'Delete Test',
        },
        orgId,
      }, { server: true } as EndpointMeta)

      const result = await query.serve({
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
