import type { FictionEnv } from '@fiction/core'
import type { CardConfigPortable } from '@fiction/site'
import type { CardTemplate } from '@fiction/site/card'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { Site } from '@fiction/site/site.js'
import { envConfig, safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'
import { z } from 'zod'
import * as four04 from './404'
import * as area from './area'
import * as capture from './capture/index.js'
import * as cinema from './cinema/index.js'
import * as contact from './contact/index.js'
import * as effectShape from './effect-shape/index.js'
import * as faq from './faq'
import * as features from './features'
import * as fitText from './fitText/index.js'
import * as footer from './footer/index.js'
import * as gallery from './gallery/index.js'
import * as hero from './hero'
import * as hitlist from './hitlist/index.js'
import * as logos from './logos'
import * as magazine from './magazine/index.js'
import * as map from './map'
import * as marquee from './marquee/index.js'
import * as mediaGrid from './media-grid'
import * as mediaPop from './mediaPop'
import * as metrics from './metrics'
import * as nav from './nav/index.js'
import * as overSlide from './overSlide/index.js'
import * as people from './people'
import * as pricing from './pricing/index.js'
import * as profile from './profile'
import * as quote from './quote'
import * as showcase from './showcase/index.js'
import * as statement from './statement/index.js'
import * as story from './story/index.js'
import * as testimonials from './testimonials/index.js'
import * as textEffects from './textEffects'
import * as ticker from './ticker/index.js'
import * as tour from './tour'
import * as transaction from './transactions/index.js'
import * as trek from './trek/index.js'
import * as wrap from './wrap/index.js'
/**
 * Add path for tailwindcss to scan for styles
 */
envConfig.register({ name: 'CARD_UI_ROOT', onLoad: ({ fictionEnv }) => { fictionEnv.addUiRoot(safeDirname(import.meta.url)) } })

export const testCardTemplates = [
  nav.template,
] as const

type CreateTuple<T extends readonly CardTemplate[]> = {
  [P in keyof T]: T[P] extends CardTemplate<infer S> ? [S['templateId'], S['userConfig'] ] : never
}[number]

type TupleToObject<T extends [string, any]> = {
  [P in T[0]]: T extends [P, infer B] ? B : never
}

export type TemplateUserConfigMap<T extends readonly CardTemplate[]> = TupleToObject<CreateTuple<T>>

export async function getCardTemplates() {
  return [
    wrap.template,
    transaction.template,
    four04.template,
    nav.template,
    footer.template,
    quote.template,
    profile.template,
    hero.template,
    marquee.template,
    area.template,
    map.template,
    magazine.template,
    capture.template,
    showcase.template,
    cinema.template,
    story.template,
    ticker.template,
    people.template,
    pricing.template,
    logos.template,
    mediaGrid.template,
    tour.template,
    features.template,
    metrics.template,
    faq.template,
    mediaPop.template,
    textEffects.template,
    trek.template,
    fitText.template,
    overSlide.template,
    statement.template,
    testimonials.template,
    effectShape.template,
    gallery.template,
    contact.template,
    hitlist.template,
  ] as const
}

export async function getDemoPages(args: {
  site: Site
  templates: CardTemplate<any>[] | readonly CardTemplate<any>[]
  fictionEnv?: FictionEnv
  factory: CardFactory
}) {
  const { templates, site } = args

  const buttonsTemplate = cardTemplate({
    templateId: 'xbutton',
    title: 'Buttons',
    description: 'Standard button styles',
    icon: 'i-tabler-square-rounded-chevron-right-filled',
    category: ['advanced'],
    el: vue.defineAsyncComponent(async () => import('@fiction/ui/buttons/test/TestButtonsAll.vue')),
    schema: z.object({}),
    isPublic: false,
    demoPage: async () => {
      return {
        cards: [{ templateId: 'xbutton' }],
      }
    },
  })
  const inputsTemplate = cardTemplate({
    templateId: 'xinput',
    title: 'Inputs',
    description: 'Standard input styles',
    icon: 'i-tabler-input-check',
    category: ['advanced'],
    el: vue.defineAsyncComponent(async () => import('@fiction/ui/inputs/test/TestInputsAll.vue')),
    schema: z.object({}),
    isPublic: false,
    demoPage: async () => {
      return {
        cards: [{ templateId: 'xinput' }],
      }
    },
  })

  const logoTemplate = cardTemplate({
    templateId: 'xlogo',
    title: 'Logo Component',
    description: 'Standard logo handling',
    icon: 'i-tabler-brand-apple',
    category: ['advanced'],
    el: vue.defineAsyncComponent(async () => import('@fiction/ui/test/TestLogoHandling.vue')),
    schema: z.object({}),
    isPublic: false,
    demoPage: async () => {
      return {
        cards: [{ templateId: 'xlogo' }],
      }
    },
  })

  const mediaTemplate = cardTemplate({
    templateId: 'xmedia',
    title: 'Media Component',
    description: 'Standard media handling',
    icon: 'i-tabler-photo-hexagon',
    category: ['advanced'],
    el: vue.defineAsyncComponent(async () => import('@fiction/ui/test/TestMediaHandling.vue')),
    schema: z.object({}),
    isPublic: false,
    demoPage: async () => {
      return {
        cards: [{ templateId: 'xmedia' }],
      }
    },
  })

  const tpls = [buttonsTemplate, inputsTemplate, logoTemplate, mediaTemplate, ...templates]

  const { createDemoPage } = await import('./utils/demo')
  const promises = tpls.filter(t => t.settings.demoPage).map(async (t) => {
    const card = await t.settings.demoPage?.(args) as CardConfigPortable
    const pg = await createDemoPage({ site, template: t, card })

    return pg
  })

  const inlineDemos = await Promise.all(promises)

  return inlineDemos
}
