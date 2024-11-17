import type { Card } from '../card'
import { InputOption } from '@fiction/ui'
import { standardCardOptions } from '../cardStandard'

export async function getCardOptionConfig(args: { card?: Card }) {
  const { card } = args
  if (!card)
    return []
  const site = card.site

  const tpl = card?.tpl.value
  const config = await tpl?.getConfig?.({ site })
  const out = []
  if (config?.options) {
    out.push(new InputOption({ key: 'specific', label: 'Element Options', input: 'group', options: config?.options }))
  }

  out.push(standardCardOptions({ card }))

  return out as InputOption[]
}
