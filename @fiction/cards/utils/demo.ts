import type { CardConfigPortable, CardTemplate, Site } from '@fiction/site'
import type { template as heroTemplate } from '../content-hero/index.js'
import type { template as pageWrapTemplate } from '../page-wrap/index.js'
import { toKebab } from '@fiction/core/index.js'
import { CardFactory } from '@fiction/site/cardFactory.js'
import { getCardTemplates } from '../index.js'

export async function createDemoPage(args: { site: Site, template: CardTemplate<any>, card: CardConfigPortable }) {
  const { template, card = {}, site } = args
  const { templateId, title, category, colorTheme, subTitle, description, icon } = template.settings
  const slug = card.slug || `demo-${toKebab(templateId)}`
  const cards = card.cards || []

  const templates = await getCardTemplates()

  const factory = new CardFactory({ templates, site, caller: 'createDemoPage' })

  // replace the template with the inline template to allow for templates not in main list
  const crds = cards.map((c) => {
    return (c.templateId === templateId) ? { inlineTemplate: template, ...c } : c
  })

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
      ...crds,
    ],
  })

  return pg
}
