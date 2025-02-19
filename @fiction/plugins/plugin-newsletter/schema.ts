import type { ColType } from '@fiction/core'
import type { TablePostConfig } from '@fiction/posts'

import { ActionButtonSchema, AndDataFilterSchema, Col, FictionDbTable, MediaDisplaySchema, ProgressStatusSchema, standardTable } from '@fiction/core'
import { t as postTableNames } from '@fiction/posts'
import { z } from 'zod'

export const t = {
  ...standardTable,
  ...postTableNames,
  campaign: 'fiction_campaign',
} as const

const EmailAnalyticsSchema = z.object({ sent: z.number(), delivered: z.number(), opened: z.number(), clicked: z.number(), bounced: z.number(), unsubscribed: z.number(), complaints: z.number() }).partial()

export type EmailAnalyticsCounts = z.infer<typeof EmailAnalyticsSchema>

export type TableEmailCampaign = ColType<typeof sendColumns>

export type EmailCampaignConfig = Partial<TableEmailCampaign> & { post?: TablePostConfig, subscriberCount?: number }

const EmailUserConfigSchema = z.object({
  actions: z.array(ActionButtonSchema).optional(),
  isTestSent: z.boolean().optional(),
  testEmails: z.string().optional(),
})

export const sendColumns = [
  new Col({ key: 'campaignId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('eml')`)).index() }),
  new Col({ key: 'userId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k).references(`${t.user}.user_id`).onUpdate('CASCADE').index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.org}.orgId`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'postId', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`${t.posts}.postId`).onUpdate('CASCADE').onDelete('CASCADE').notNullable().index() }),
  new Col({ key: 'status', sch: () => ProgressStatusSchema, make: ({ s, col }) => s.string(col.k, 50).defaultTo('pending') }),
  new Col({ key: 'title', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k), sec: 'setting' }),
  new Col({ key: 'sentAt', sch: ({ z }) => z.string(), make: ({ s, col }) => s.timestamp(col.k).defaultTo(null) }),
  new Col({ key: 'subject', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'preview', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'from', sch: ({ z }) => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'avatar', sch: () => MediaDisplaySchema, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  new Col({ key: 'scheduleMode', sch: ({ z }) => z.enum(['now', 'schedule']), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'scheduledAt', sch: ({ z }) => z.string(), make: ({ s, col }) => s.timestamp(col.k).defaultTo(null) }),
  new Col({ key: 'filters', sch: ({ z }) => z.array(AndDataFilterSchema), make: ({ s, col }) => s.jsonb(col.k).defaultTo([]) }),
  new Col({ key: 'counts', sch: () => EmailAnalyticsSchema, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  new Col({ key: 'draft', sch: ({ z }) => z.record(z.string(), z.any()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  new Col({ key: 'userConfig', sch: () => EmailUserConfigSchema, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
] as const

export const settingsKeys = sendColumns.filter(c => c.sec === 'setting').map(c => c.key)

export const sendTable = new FictionDbTable({ tableKey: t.campaign, timestamps: true, cols: sendColumns })
