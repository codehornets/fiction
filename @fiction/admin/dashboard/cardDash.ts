import { cardTemplate } from '@fiction/site'
import FictionLogo from '@fiction/ui/brand/FictionLogo.vue'
import { z } from 'zod'
import DashWrap from './DashWrap.vue'

export const schema = z.object({
  isNavItem: z.boolean().optional(),
  navIcon: z.string().optional(),
  navIconAlt: z.string().optional(),
  priority: z.number().optional(),
  layoutFormat: z.union([z.literal('container'), z.literal('full')]).optional(),
  navTitle: z.string().optional(),
  authRedirect: z.string().optional(),
  parentNavItemSlug: z.string().optional(),
})

export type UserConfig = z.infer<typeof schema>

export const template = cardTemplate({
  templateId: 'dash',
  el: DashWrap,
  isPageCard: true,
  getBaseConfig: () => ({
    homeIcon: { format: 'component' as const, el: FictionLogo },
    authRedirect: '/auth/login',
    standard: { spacing: { verticalSpacing: 'none' } },
  }),
  getConfig: async () => ({ schema }),
})
