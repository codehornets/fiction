import type { FictionEnv } from '@fiction/core'
import { getCardTemplates } from '@fiction/cards/index.js'
import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'

// Export minimal theme metadata for theme selector/admin
export const meta = {
  root: safeDirname(import.meta.url),
  name: 'Minimal',
  themeId: 'minimal',
  description: 'A basic, clean theme with a focus on typography and whitespace.',
  version: '1.0.0',
  screenshot: new URL('./img/screenshot.jpg', import.meta.url).href,
  isPublic: true,
} as const

export async function setup(args: { fictionEnv: FictionEnv }) {
  const { fictionEnv } = args

  const templates = await getCardTemplates()

  return new Theme({
    ...meta,
    fictionEnv,
    templates,
    getConfig: async (args) => {
      // Load config sections dynamically
      const [{ getPages }, { getHeader }, { getFooter }] = await Promise.all([
        import('./config/pages'),
        import('./config/header'),
        import('./config/footer'),
      ])

      const [pages, header, footer] = await Promise.all([
        getPages(args),
        getHeader(args),
        getFooter(args),
      ])

      return {
        pages,
        sections: { header, footer },
        userConfig: {},
      }
    },

  })
}
