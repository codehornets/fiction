import type { EndpointMeta, EndpointResponse, FictionDb, FictionEnv, FictionUser, Organization } from '@fiction/core'
import type Stripe from 'stripe'
import type { FictionStripe } from '.'
import type { CustomerData } from './types'
import { abort, Query, standardTable } from '@fiction/core'

// Type to identify a customer either by orgId or customerId
type WhereCustomer = { customerId?: string }

// Union type for all possible action parameters
type ManageCustomerRequestParams =
  | { _action: 'create', fields: { email?: string, name?: string } }
  | { _action: 'update', where?: WhereCustomer, fields: { email?: string, name?: string } }
  | { _action: 'retrieve', where?: WhereCustomer }
  | { _action: 'delete', where?: WhereCustomer }

type ManageCustomerParams = ManageCustomerRequestParams & { orgId: string, userId?: string }

export class QueryManageCustomer extends Query<{
  fictionUser: FictionUser
  fictionDb: FictionDb
  fictionEnv: FictionEnv
  fictionStripe: FictionStripe
}> {
  async run(params: ManageCustomerParams, meta: EndpointMeta): Promise<EndpointResponse<CustomerData>> {
    switch (params._action) {
      case 'create':
        return this.createCustomer(params, meta)
      case 'update':
        return this.updateCustomer(params, meta)
      case 'retrieve':
        return this.retrieveCustomer(params, meta)
      case 'delete':
        return this.deleteCustomer(params, meta)
      default:
        throw abort('Invalid action')
    }
  }

  private async createCustomer(
    params: ManageCustomerParams & { _action: 'create' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    const { fields: { email = '', name = '' }, orgId } = params
    const stripe = this.settings.fictionStripe.getServerClient()

    if (!orgId)
      throw abort('No orgId provided')

    const customer = await stripe.customers.create({
      email,
      name,
      description: orgId,
      metadata: {
        orgId,
        stripeMode: this.settings.fictionStripe.stripeMode.value,
        deployMode: this.settings.fictionStripe.settings.fictionEnv.mode.value || 'unknown',
      },
    })

    await this.saveCustomerInfo({
      orgId,
      customerId: customer.id,
      data: { customerId: customer.id },
    })

    const customerData = await this.getCustomerData({ orgId })
    return { status: 'success', data: customerData, message: 'Customer created successfully' }
  }

  private async updateCustomer(
    params: ManageCustomerParams & { _action: 'update' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    const { where, fields: { email, name }, orgId } = params
    const stripe = this.settings.fictionStripe.getServerClient()
    const { data: customer } = await this.getCustomer({ where, orgId })

    if (!customer || customer.deleted) {
      throw abort('Customer not found')
    }

    await stripe.customers.update(customer.id, { email, name })

    const customerData = await this.getCustomerData({ orgId })

    return { status: 'success', data: customerData, message: 'Customer updated successfully' }
  }

  private async retrieveCustomer(
    params: ManageCustomerParams & { _action: 'retrieve' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    const { where, orgId } = params

    const r = await this.getCustomer({ where, orgId })

    if (r.status === 'error') {
      throw abort(r.message || 'Payment API Error')
    }

    const customerData = await this.getCustomerData({ orgId })
    return { status: 'success', data: customerData, message: 'Customer retrieved successfully' }
  }

  private async deleteCustomer(
    params: ManageCustomerParams & { _action: 'delete' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    const { where, orgId } = params

    const { data: customer } = await this.getCustomer({ where, orgId })

    if (!customer || customer.deleted) {
      throw abort('Customer not found')
    }

    const stripe = this.settings.fictionStripe.getServerClient()
    const deletedCustomer = await stripe.customers.del(customer.id)

    return {
      status: 'success',
      data: { customer: deletedCustomer as Stripe.Customer & { deleted: true } },
      message: 'Customer deleted successfully',
    }
  }

  private async saveCustomerInfo(args: {
    orgId: string
    customerId?: string | null
    customerAuthorized?: 'authorized' | 'invalid' | null
    data?: Record<string, any>
  }): Promise<void> {
    const { orgId, customerId, customerAuthorized, data } = args
    const db = this.settings.fictionDb.client()
    const liveStripe = this.settings.fictionStripe.stripeMode.value === 'live'

    const save: Record<string, string | null> = {}
    if (customerId) {
      save[liveStripe ? 'customerId' : 'customerIdTest'] = customerId
    }
    if (customerAuthorized) {
      save.customerAuthorized = customerAuthorized
    }

    await db.update(save).from(standardTable.org).where({ orgId })

    if (data) {
      const customerField = liveStripe ? 'customer' : 'customer_test'
      const customerMerge = db.raw(
        `coalesce(${customerField}::jsonb, '{}'::jsonb) || ?::jsonb`,
        JSON.stringify(data),
      )

      const saveMeta = liveStripe
        ? { customer: customerMerge }
        : { customerTest: customerMerge }

      await db
        .update(saveMeta)
        .from(standardTable.org)
        .where({ orgId })
    }
  }

  private async getCustomer(args: { where?: WhereCustomer, orgId: string }): Promise<EndpointResponse<Stripe.Customer & { deleted?: boolean } >> {
    const { where, orgId } = args
    const db = this.settings.fictionDb.client()
    const stripe = this.settings.fictionStripe.getServerClient()
    const liveStripe = this.settings.fictionStripe.stripeMode.value === 'live'
    const customerField = liveStripe ? 'customer' : 'customerTest'

    let org: Organization | undefined
    let customerId: string | undefined

    if (orgId) {
      org = await db
        .select('*')
        .from(standardTable.org)
        .where({ orgId })
        .first<Organization>()

      customerId = org?.[customerField]?.customerId
    }
    else {
      customerId = where?.customerId
    }

    if (!customerId) {
      return { status: 'error', message: 'Customer not found' }
    }

    let customer: (Stripe.Customer & { deleted?: boolean }) | undefined

    try {
      customer = await stripe.customers.retrieve(customerId) as Stripe.Customer & { deleted?: boolean }

      if (customer.deleted || !customer) {
        if (org?.orgId) {
          this.log.warn('Customer not found on org', { orgId: org.orgId })
          await this.saveCustomerInfo({
            orgId: org.orgId,
            customerId: null,
            data: { customerId: undefined },
            customerAuthorized: null,
          })
        }
        customer = undefined
      }
    }
    catch (error) {
      this.log.error('Payment API Error: Failed to retrieve customer', { error })
      return { status: 'error', message: 'Payment API Error' }
    }

    return { status: 'success', data: customer }
  }

  private async getCustomerData(args: { orgId: string }): Promise<CustomerData> {
    const { orgId } = args

    const { data: customer } = await this.getCustomer({ orgId })

    const stripe = this.settings.fictionStripe.getServerClient()

    let subscriptions: Stripe.Subscription[] = []
    if (customer && !customer?.deleted) {
      const response = await stripe.subscriptions.list({ customer: customer?.id })
      subscriptions = response.data
    }

    return {
      customer,
      subscriptions,
    }
  }
}
