import type { CardConfigPortable, CardTemplate, Site } from '@fiction/site'
import type { template as heroTemplate } from '../hero/index.js'
import { CardFactory } from '@fiction/site/cardFactory.js'
import { getCardTemplates } from '../index.js'

export async function createDemoPage(args: { site: Site, template: CardTemplate<any>, card: CardConfigPortable }) {
  const { template, card = {}, site } = args
  const slug = card.slug || `demo-${template.settings.templateId}`
  const cards = card.cards || []

  const templates = await getCardTemplates()

  const factory = new CardFactory({ templates, site, caller: 'createDemoPage' })

  // replace the template with the inline template to allow for templates not in main list
  const crds = cards.map((c) => {
    return (c.templateId === template.settings.templateId) ? { inlineTemplate: template, ...c } : c
  })

  const pg = await factory.fromTemplate({
    slug,
    templateId: 'wrap',
    baseConfig: { seo: { title: `${template.settings.title} - Web Element Demo` } },
    userConfig: {
      // fixedHeader: true,
    },
    cards: [
      await factory.fromTemplate<typeof heroTemplate>({
        templateId: 'hero',
        userConfig: {
          superTitle: {
            text: template.settings.category?.join(', ').toUpperCase(),
            icon: { format: 'iconClass', class: template.settings.icon },
            theme: template.settings.colorTheme,
          },
          title: template.settings.title,
          subTitle: template.settings.subTitle || template.settings.description?.slice(0, 100),
          action: { buttons: [] },
        },
      }),
      ...crds,
    ],
  })

  return pg
}
