import type express from 'express'
import type { ErrorCode } from '../utils/error.js'
import type { UserRoles } from './roles.js'
import { z } from 'zod'

export const AndDataFilterSchema = z.object({
  field: z.string(),
  value: z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]),
  operator: z.enum(['=', '!=', '>', '<', '>=', '<=', 'like', 'not like', 'in', 'not in']),
})

export const OrFilterGroupSchema = z.array(AndDataFilterSchema)

// sql where operators.value
export type DataFilter = z.infer<typeof AndDataFilterSchema>
export type ComplexDataFilter = z.infer<typeof OrFilterGroupSchema>

export type IndexQuery = {
  offset?: number
  limit?: number
  order?: 'asc' | 'desc'
  orderBy?: string
  filters?: ComplexDataFilter[]
  taxonomy?: { taxonomyId: string } | { type: 'tag' | 'category', slug: string }
}

export type IndexMeta = {
  count?: number
  changedCount?: number
} & IndexQuery

export type ResponseStatus = 'success' | 'error' | 'fail' | 'loading' | 'unknown'

export type ValidationReason = 'long' | 'invalid' | 'reserved' | 'taken' | 'short' | 'success' | 'error' | 'loading' | 'unknown' | 'current'

export interface EndpointResponse<
  T = unknown,
  U = ResponseStatus,
> {
  status: U
  data?: T
  message?: string
  more?: string
  reason?: string
  meta?: Record<string, any>
  error?: Error | unknown
  code?: ErrorCode
  expose?: boolean
  context?: string
  internal?: unknown
  loading?: any | Promise<any>
  indexMeta?: IndexMeta
  [key: string]: any
}

export interface EndpointConfig {
  route: string | RegExp | Array<string | RegExp>
  auth?: UserRoles
  handler: (ctx: express.Request) => Promise<EndpointResponse>
  availableActions?: string[]
}
