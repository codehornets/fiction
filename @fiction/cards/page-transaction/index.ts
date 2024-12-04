import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'pageTransaction'

export const template = cardTemplate({
  templateId,
  el: vue.defineAsyncComponent(async () => import('./CardWrapTransaction.vue')),
  getBaseConfig: () => {
    return { standard: { handling: { showOnSingle: true } } }
  },
  isPublic: false,
  isPageCard: true,
})
