import type { CardFactory } from '@fiction/site/cardFactory'
import type { UserConfig } from './index'

const defaultConfig: UserConfig = {
  items: [{
    text: 'Non nobis solum nati sumus.',
    rotateX: 5,
    rotateY: 5,
    rotateZ: -2,
    speed: 30,
  }, {
    text: 'Non nobis solum nati sumus.',
    rotateX: 5,
    rotateY: -5,
    rotateZ: 2,
    direction: 'right',
    outline: true,
    speed: 50,
  }],
}

const demoCard2: UserConfig = {
  fontSize: 6,
  items: [
    {
      text: 'Non nobis solum nati sumus.',
      direction: 'left',
      backgroundColor: '#000',
      backgroundColorDark: '#FFF',
    },
    {
      text: 'Non nobis solum nati sumus.',
      direction: 'right',
      font: 'highlight',
      backgroundColor: '#586cb2',
      backgroundColorDark: '#1e2f69',
    },
  ],
}

export async function getUserConfig(args: { templateId: string, factory: CardFactory }) {
  return defaultConfig
}

export async function getDemo(args: { templateId: string, factory: CardFactory }) {
  const { templateId } = args
  return { cards: [
    { templateId, userConfig: { ...defaultConfig } },
    { templateId, userConfig: { ...demoCard2 } },
  ] }
}
