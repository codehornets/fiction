import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { z } from 'zod'

export const template = cardTemplate({
  templateId: 'transaction',
  el: vue.defineAsyncComponent(async () => import('./CardWrapTransaction.vue')),
  schema: z.object({}),
  getBaseConfig: () => {
    return { standard: { handling: { showOnSingle: true } } }
  },
  isPublic: false,
  isPageCard: true,
})
