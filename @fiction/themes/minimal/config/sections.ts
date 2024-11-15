import type { template as captureTemplate } from '@fiction/cards/capture'
import type { template as mediaPopTemplate } from '@fiction/cards/mediaPop'
import type { template as textEffectsTemplate } from '@fiction/cards/textEffects'
import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'

export async function getHidden(args: { factory: CardFactory, site: Site, userConfig: SiteUserConfig }) {
  const { factory, userConfig } = args

  return await factory.fromTemplate({
    cards: [
      await factory.fromTemplate<typeof mediaPopTemplate>({ templateId: 'mediaPop', userConfig: { } }),
      await factory.fromTemplate<typeof textEffectsTemplate>({ templateId: 'textEffects', userConfig: { } }),
      await factory.fromTemplate<typeof captureTemplate>({ templateId: 'capture', userConfig: { } }),
    ],
  })
}
