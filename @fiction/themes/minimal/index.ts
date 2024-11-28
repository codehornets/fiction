import { getCardTemplates } from '@fiction/cards/index.js'
import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'

export const theme = new Theme({
  root: safeDirname(import.meta.url),
  themeId: 'minimal',
  title: 'Minimal',
  subTitle: 'Elegant simplicity that lets your content shine',
  description: 'A refined, distraction-free theme that puts your work center stage. Perfect for creatives, photographers, and professionals who want their content to make the strongest impact. Features thoughtfully crafted typography, intentional white space, and smooth transitions that guide visitors through your story.',
  icon: 'i-tabler-layout-grid',
  colorTheme: 'blue',
  category: ['portfolio', 'personal'],
  version: '1.0.0',
  screenshots: {
    light: {
      desktop: new URL('./img/light-desktop.png', import.meta.url).href,
    },
    dark: {
      desktop: new URL('./img/dark-desktop.png', import.meta.url).href,
    },
  },

  isPublic: true,
  getTemplates: () => getCardTemplates(),
  getBaseConfig: () => {
    return {
      styling: {
        fonts: {
          sans: { stack: 'sans' as const },
          title: { fontKey: 'Space Mono', stack: 'sans' as const, weight: '600' },
          body: { stack: 'sans' as const },
        },
        prefersColorScheme: 'dark',
      },
    }
  },
  getConfig: async (args) => {
    const configs = await Promise.all([
      import('./config/pages').then(m => m.getPages(args)),
      import('./config/header').then(m => m.getHeader(args)),
      import('./config/footer').then(m => m.getFooter(args)),
      import('./config/sections').then(m => m.getHidden(args)),
    ])

    const [pages, header, footer, hidden] = configs

    return {
      pages,
      sections: { header, footer, hidden },
    } as const
  },
})
