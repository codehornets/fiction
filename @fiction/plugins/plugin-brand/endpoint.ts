import type { ComplexDataFilter, EndpointMeta, EndpointResponse, IndexQuery } from '@fiction/core'
import type { FictionBrand, FictionBrandSettings } from './index'
import type { TableBrand } from './schema'
import { abort, applyComplexFilters, Query } from '@fiction/core'
import { t } from './schema'

type BrandQuerySettings = {
  fictionBrand: FictionBrand
} & FictionBrandSettings

abstract class BrandGuideEndpoint extends Query<BrandQuerySettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: BrandQuerySettings) {
    super(settings)
  }
}

export type WhereBrandGuide = {
  brandId?: string
}

export type ManageBrandGuideRequest =
  | { _action: 'create', fields: Partial<TableBrand> }
  | { _action: 'retrieve', where: WhereBrandGuide }
  | { _action: 'list', orgId: string, where?: Partial<TableBrand>, limit?: number, offset?: number, page?: number }
  | { _action: 'count', orgId: string, filters?: ComplexDataFilter[] }
  | { _action: 'update', where: WhereBrandGuide, fields: Partial<TableBrand> }
  | { _action: 'delete', where: WhereBrandGuide }

export type ManageBrandGuideParams = ManageBrandGuideRequest & IndexQuery & { orgId: string }

export type ManageBrandGuideResponse = EndpointResponse<TableBrand[]>

export class ManageBrandGuideQuery extends BrandGuideEndpoint {
  limit = 20
  offset = 0

  async run(params: ManageBrandGuideParams, meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { _action } = params

    let r: ManageBrandGuideResponse | undefined

    switch (_action) {
      case 'create':
        r = await this.create(params, meta)
        break
      case 'retrieve':
        r = await this.retrieve(params, meta)
        break
      case 'list':
        r = await this.list(params, meta)
        break
      case 'update':
        r = await this.update(params, meta)
        break
      case 'count':
        r = { status: 'success', data: [] } // Added in indexMeta
        break
      case 'delete':
        r = await this.delete(params, meta)
        break
      default:
        r = { status: 'error', message: 'Invalid action' }
    }

    if (!r) {
      return { status: 'error', message: 'Invalid action' }
    }

    return this.addIndexMeta(params, r, meta)
  }

  private async addIndexMeta(params: ManageBrandGuideParams, r: ManageBrandGuideResponse, _meta?: EndpointMeta): Promise<ManageBrandGuideResponse> {
    if (params._action === 'retrieve')
      return r

    const { orgId } = 'orgId' in params ? params : { orgId: '' }
    if (!orgId)
      return r

    const { limit = this.limit, offset = this.offset, filters = [] } = params

    let baseQuery = this.db().table(t.brand).where({ orgId }).count().first<{ count: string }>()
    baseQuery = applyComplexFilters(baseQuery, filters)
    const { count } = await baseQuery

    r.indexMeta = { limit, offset, count: +count, ...r.indexMeta }
    return r
  }

  private async create(params: ManageBrandGuideParams & { _action: 'create' }, meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { fields, orgId } = params
    const { fictionDb } = this.settings

    if (!orgId) {
      throw abort('orgId is required to create brand guide')
    }

    if (!fields.title) {
      throw abort('title is required to create brand guide')
    }

    const insertData = fictionDb.prep({ type: 'insert', fields, meta, table: t.brand })

    this.log.info('createBrandGuide', { data: insertData, caller: meta.caller })

    const result = await this.db()
      .table(t.brand)
      .insert({ orgId, ...insertData })
      .returning('*')

    return { status: 'success', data: result, indexMeta: { changedCount: 1 } }
  }

  private async retrieve(params: ManageBrandGuideParams & { _action: 'retrieve' }, _meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { where, orgId } = params

    const result = await this.db()
      .table(t.brand)
      .where({ orgId, ...where })
      .first()

    if (!result) {
      return { status: 'error', message: 'Brand guide not found', data: [] }
    }

    return { status: 'success', data: [result] }
  }

  private async list(params: ManageBrandGuideParams & { _action: 'list' }, _meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { where, orgId } = params
    let { limit = this.limit, offset = this.offset, page } = params

    if (page && page > 0) {
      offset = (page - 1) * limit
    }

    const results = await this.db()
      .select('*')
      .from(t.brand)
      .where({ orgId, ...where })
      .limit(limit)
      .offset(offset)
      .orderBy('updated_at', 'desc')

    return { status: 'success', data: results }
  }

  private async update(params: ManageBrandGuideParams & { _action: 'update' }, meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { where, fields, orgId } = params
    const { fictionDb } = this.settings

    const prepped = fictionDb.prep({ type: 'update', fields, meta, table: t.brand })
    const updatedAt = new Date().toISOString()

    const result = await this.db()
      .table(t.brand)
      .where({ orgId, ...where })
      .update({ ...prepped, updatedAt })
      .returning('*')

    if (!result.length) {
      return { status: 'error', message: 'Brand guide not found', data: [] }
    }

    return { status: 'success', data: result, indexMeta: { changedCount: result.length } }
  }

  private async delete(params: ManageBrandGuideParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<ManageBrandGuideResponse> {
    const { where, orgId } = params

    const result = await this.db()
      .table(t.brand)
      .where({ orgId, ...where })
      .delete()
      .returning('*')

    if (!result.length) {
      return { status: 'error', message: 'Brand guide not found', data: [] }
    }

    return { status: 'success', data: result, indexMeta: { changedCount: result.length } }
  }
}
