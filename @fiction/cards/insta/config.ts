import type { CardFactory } from '@fiction/site/cardFactory'
import type { InputOption } from '@fiction/ui'
import { z } from 'zod'

const schema = z.object({ })

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
]

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  return {

  }
}
