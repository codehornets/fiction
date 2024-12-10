// index.ts
import type { SiteUserConfig } from '@fiction/site/schema'
import { getCardTemplates } from '@fiction/cards/index.js'
import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'

export const theme = new Theme({
  root: safeDirname(import.meta.url),
  themeId: 'prestige',
  title: 'Prestige',
  subTitle: 'Showcase your professional legacy with confidence',
  description: 'A sophisticated portfolio theme designed for professionals who want to make a lasting impression. Features a stunning visual narrative structure, elegant project showcases, and strategic credibility builders. Perfect for creative professionals, executives, consultants, and thought leaders who need to establish authority and drive engagement through their digital presence.',
  icon: 'i-tabler-award',
  colorTheme: 'indigo',
  category: ['portfolio', 'personal'],
  version: '1.0.0',
  screenshots: {
    light: { desktop: new URL('../minimal/mg/light-desktop.png', import.meta.url).href },
    dark: { desktop: new URL('../minimal/img/dark-desktop.png', import.meta.url).href },
  },

  isPublic: true,
  getTemplates: () => getCardTemplates(),
  getBaseConfig: () => {
    return {
      site: {
        fonts: {
          title: { family: 'DM+Serif+Text', stack: 'sans' },
          body: { family: 'Inter', stack: 'sans' },
        },
        prefersColorScheme: 'dark',
        primaryColor: 'rose',
      },
    } satisfies SiteUserConfig
  },
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig(args)
  },
})
