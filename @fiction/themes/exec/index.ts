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
    userConfig: {
      styling: {
        fonts: {
          sans: { stack: 'sans' as const },
          title: { fontKey: 'Space Mono', stack: 'sans' as const, weight: '600' },
          body: { stack: 'sans' as const },
        },
        prefersColorScheme: 'dark',
      },
    },
    getConfig: async (args) => {
      const configs = await Promise.all([
        import('./config/pages').then(m => m.getPages(args)),
        import('./config/header').then(m => m.getHeader(args)),
        import('./config/footer').then(m => m.getFooter(args)),
      ])

      const [pages, header, footer] = configs

      return {
        pages,
        sections: { header, footer },
      }
    },

  })
}
