import type { FictionEnv } from '@fiction/core'
import type { FictionStripe } from '@fiction/plugin-stripe/index.js'
import { getCardTemplates } from '@fiction/cards'
import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'

export async function setup(args: { fictionEnv: FictionEnv, fictionStripe?: FictionStripe }) {
  const { fictionEnv, fictionStripe } = args

  const templates = await getCardTemplates()

  const domain = fictionEnv.meta.app?.domain || 'fiction.com'
  return new Theme({
    fictionEnv,
    root: safeDirname(import.meta.url),
    themeId: 'fiction',
    title: 'Fiction',
    description: 'Fiction\'s actual website',
    version: '1.0.0',
    templates,
    isPublic: false,
    userConfig: {},
    getConfig: async (args) => {
      const { getConfig } = await import('./config')

      return await getConfig({ ...args, domain, fictionStripe, fictionEnv })
    },

  })
}
