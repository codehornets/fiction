import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const template = cardTemplate({
  templateId: 'transaction',
  el: vue.defineAsyncComponent(async () => import('./CardWrapTransaction.vue')),
  getBaseConfig: () => {
    return { standard: { handling: { showOnSingle: true } } }
  },
  isPublic: false,
  isPageCard: true,
})
