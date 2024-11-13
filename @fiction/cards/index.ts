import type { FictionEnv } from '@fiction/core'
import type { CardConfigPortable } from '@fiction/site'
import type { CardTemplate } from '@fiction/site/card'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { Site } from '@fiction/site/site.js'
import { envConfig, safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'
import { z } from 'zod'

// Register path for tailwindcss to scan for styles
envConfig.register({
  name: 'CARD_UI_ROOT',
  onLoad: ({ fictionEnv }) => fictionEnv.addUiRoot(safeDirname(import.meta.url)),
})

// Template imports organized by category
const templates = {
  layout: {
    wrap: () => import('./wrap'),
    area: () => import('./area'),
    nav: () => import('./nav'),
    footer: () => import('./footer'),
  },
  content: {
    hero: () => import('./hero'),
    story: () => import('./story'),
    quote: () => import('./quote'),
    profile: () => import('./profile'),
    features: () => import('./features'),
    faq: () => import('./faq'),
    statement: () => import('./statement'),
    testimonials: () => import('./testimonials'),
    metrics: () => import('./metrics'),
    people: () => import('./people'),
    logos: () => import('./logos'),
    hitlist: () => import('./hitlist'),
    bento: () => import('./bento'),
  },
  media: {
    cinema: () => import('./cinema'),
    gallery: () => import('./gallery'),
    magazine: () => import('./magazine'),
    mediaGrid: () => import('./media-grid'),
    mediaPop: () => import('./mediaPop'),
    showcase: () => import('./showcase'),
  },
  interactive: {
    capture: () => import('./capture'),
    contact: () => import('./contact'),
    map: () => import('./map'),
    pricing: () => import('./pricing'),
    tour: () => import('./tour'),
  },
  effects: {
    effectShape: () => import('./effect-shape'),
    fitText: () => import('./fitText'),
    marquee: () => import('./marquee'),
    overSlide: () => import('./overSlide'),
    textEffects: () => import('./textEffects'),
    ticker: () => import('./ticker'),
    trek: () => import('./trek'),
  },
  special: {
    four04: () => import('./404'),
    transaction: () => import('./transactions'),
  },
} as const

// Export test templates (if needed for testing)
export const testCardTemplates = [
  (await templates.layout.nav()).template,
] as const

// Type utilities for template configuration
type TemplateModule = { template: CardTemplate<any> }

async function getTemplateModules() {
  const loadedTemplates: Record<string, TemplateModule> = {}
  const loadErrors: Record<string, Error> = {}

  // Flatten the nested template structure for parallel loading
  const templateEntries = Object.values(templates).flatMap(category =>
    Object.entries(category).map(([key, importFn]) => ({ key, importFn })),
  )

  // Load all templates in parallel with error handling
  const results = await Promise.allSettled(
    templateEntries.map(async ({ key, importFn }) => {
      try {
        const module = await importFn()
        return { key, module }
      }
      catch (error) {
        loadErrors[key] = error instanceof Error ? error : new Error('Unknown error loading template')
        throw error
      }
    }),
  )

  // Process results and populate loadedTemplates
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { key, module } = result.value
      loadedTemplates[key] = module
    }
  })

  // Log any errors that occurred during loading
  if (Object.keys(loadErrors).length > 0) {
    console.error('Template loading errors:', loadErrors)
  }

  return loadedTemplates
}

// Main template getter
export async function getCardTemplates(): Promise<CardTemplate<any>[]> {
  const modules = await getTemplateModules()

  return [
    ...Object.values(modules).map(m => m.template),
  ]
}

// Demo templates for UI components
const demoTemplates = {
  buttons: {
    templateId: 'xbutton',
    title: 'Buttons',
    description: 'Standard button styles',
    icon: 'i-tabler-square-rounded-chevron-right-filled',
    component: () => import('@fiction/ui/buttons/test/TestButtonsAll.vue'),
  },
  inputs: {
    templateId: 'xinput',
    title: 'Inputs',
    description: 'Standard input styles',
    icon: 'i-tabler-input-check',
    component: () => import('@fiction/ui/inputs/test/TestInputsAll.vue'),
  },
  logo: {
    templateId: 'xlogo',
    title: 'Logo Component',
    description: 'Standard logo handling',
    icon: 'i-tabler-brand-apple',
    component: () => import('@fiction/ui/test/TestLogoHandling.vue'),
  },
  media: {
    templateId: 'xmedia',
    title: 'Media Component',
    description: 'Standard media handling',
    icon: 'i-tabler-photo-hexagon',
    component: () => import('@fiction/ui/test/TestMediaHandling.vue'),
  },
}

// Create demo templates
function createDemoTemplate(config: typeof demoTemplates[keyof typeof demoTemplates]) {
  return cardTemplate({
    ...config,
    category: ['advanced'],
    el: vue.defineAsyncComponent(config.component),
    schema: z.object({}),
    isPublic: false,
    demoPage: async () => ({
      cards: [{ templateId: config.templateId }],
    }),
  })
}

// Get demo pages
export async function getDemoPages(args: {
  site: Site
  templates: CardTemplate<any>[] | readonly CardTemplate<any>[]
  fictionEnv?: FictionEnv
  factory: CardFactory
}) {
  const { createDemoPage } = await import('./utils/demo')
  const demoTemplatesList = Object.values(demoTemplates).map(createDemoTemplate)
  const allTemplates = [...demoTemplatesList, ...args.templates]

  const demoPages = await Promise.all(
    allTemplates
      .filter(t => t.settings.demoPage)
      .map(async (template) => {
        const card = await template.settings.demoPage?.(args) as CardConfigPortable
        return createDemoPage({ site: args.site, template, card })
      }),
  )

  return demoPages
}
