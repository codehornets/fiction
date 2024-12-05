import type { template as heroTemplate } from '@fiction/cards/content-hero/index.js'
import type { template as pageWrapTemplate } from '@fiction/cards/page-wrap/index.js'
import type { CardTemplate, Site } from '@fiction/site'
import { toKebab } from '@fiction/core/index.js'
import { CardFactory } from '../cardFactory.js'

export async function createDemoPage(args: { site: Site, template: CardTemplate<any> }) {
  const { template, site } = args
  const { templateId, title, category, colorTheme, subTitle, description, icon } = template.settings

  const config = await template.getConfig(args)
  const card = config.demoPage || { cards: [] }

  const slug = card.slug || `demo-${toKebab(templateId)}`
  const cards = card.cards || []

  const templates = await site.theme.value.templates

  const factory = new CardFactory({ templates, site, caller: 'createDemoPage' })

  const pg = await factory.fromTemplate<typeof pageWrapTemplate>({
    slug,
    templateId: 'pageWrap',
    baseConfig: { site: { seo: { title: `${title} - Web Element Demo` } } },
    userConfig: {
      // fixedHeader: true,
    },
    cards: [
      await factory.fromTemplate<typeof heroTemplate>({
        templateId: 'contentHero',
        userConfig: {
          superTitle: {
            text: category?.join(', ').toUpperCase(),
            icon: { format: 'iconClass', class: icon },
            theme: colorTheme,
          },
          title,
          subTitle: subTitle || description?.slice(0, 100),
          action: { buttons: [] },
        },
      }),
      ...cards,
    ],
  })

  return pg
}
