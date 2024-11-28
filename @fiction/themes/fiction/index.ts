import { getCardTemplates } from '@fiction/cards'
import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'

export const theme = new Theme({
  root: safeDirname(import.meta.url),
  themeId: 'fiction',
  title: 'Fiction',
  subTitle: 'The theme for fiction.com',
  description: 'Fiction website',
  category: [],
  version: '1.0.0',
  isPublic: false,
  getTemplates: () => getCardTemplates(),
  getBaseConfig: () => ({}),
  getConfig: async (args) => {
    const { site } = args
    const { getConfig } = await import('./config')
    const fictionEnv = site.fictionSites.fictionEnv
    const domain = fictionEnv.meta.app?.domain || 'fiction.com'

    return await getConfig({ ...args, domain })
  },

})
