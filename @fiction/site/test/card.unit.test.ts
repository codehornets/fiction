import { describe, expect, it } from 'vitest'
import { waitFor } from '@fiction/core'
import { standardCardTemplates } from '@fiction/cards'
import { Card, CardTemplate } from '../card'
import { Site } from '../site'
import { CardGeneration } from '../generation'
import { createSiteTestUtils } from './siteTestUtils'

describe('card', async () => {
  const testUtils = await createSiteTestUtils()
  const site = new Site({ fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' })
  const card = new Card({
    site,
    inlineTemplate: standardCardTemplates.find(t => t.settings.templateId === 'hero') as CardTemplate,
    title: 'Test Card',
  })

  const generation = new CardGeneration({ card })

  it('should have correct setup', () => {
    expect(site.pages.value.length).toMatchInlineSnapshot(`0`)
  })

  it('cardTemplate initializes with correct settings', () => {
    expect(card.tpl.value?.settings.templateId).toBe('hero')
    expect(card.tpl.value?.settings.title).toBe('Hero')
  })

  it('card initializes with correct settings and links to Site and Template', () => {
    expect(card.title.value).toBe('Test Card')
    expect(card.site).toBe(site)
  })

  it('cardTemplate toCard method generates a card with expected properties', () => {
    const newCard = standardCardTemplates.find(t => t.settings.templateId === 'hero')?.toCard({})
    expect(newCard?.settings.templateId).toBe('hero')
    expect(newCard?.settings.title).toBe('Hero')
  })

  it('card computes total estimated time correctly', async () => {
    generation.userPropConfig.value = { heading: { isEnabled: true }, subHeading: { isEnabled: true } }

    await waitFor(50)

    // Assuming options have been set up to produce a known total time
    const totalEstimatedTime = generation.totalEstimatedTime.value
    expect(totalEstimatedTime).toBe(8)
    // Update the expected time based on your options setup
    expect(totalEstimatedTime).toMatchInlineSnapshot(`8`)
  })

  it('card generates correct prompt for content creation', () => {
    const prompt = generation.prompt.value
    expect(prompt).toMatchInlineSnapshot(`"create content for the "Test Card" card on the "404" page"`)
    expect(prompt.toLowerCase()).toContain('test card')
    // Adjust based on actual prompt structure
  })

  it('updates to Card reflect in userConfig and other properties', () => {
    card.updateUserConfig({ path: 'heading', value: 'New Headline' })
    expect(card.userConfig.value.heading).toBe('New Headline')

    card.update({ title: 'Updated Card' })
    expect(card.title.value).toBe('Updated Card')
    const prompt = card.genUtil.prompt.value
    expect(prompt.toLowerCase()).toContain('updated card')
  })

  it('should compute total estimated time correctly', () => {
    card.genUtil.userPropConfig.value = { heading: { isEnabled: true }, subHeading: { isEnabled: true } }

    const totalEstimatedTime = card.genUtil.totalEstimatedTime.value

    expect(totalEstimatedTime).toMatchInlineSnapshot(`8`)
    expect(totalEstimatedTime).toBe(8)
  })

  it('should have correct generations settings', () => {
    const inputConfig = card.genUtil.jsonPropConfig.value

    expect(inputConfig).toEqual(expect.objectContaining({
      actions: expect.any(Object),
      heading: expect.any(Object),
      layout: expect.any(Object),
      subHeading: expect.any(Object),
      superHeading: expect.any(Object),
    }))

    expect(inputConfig.actions.label).toEqual('Actions')
    expect(inputConfig.subHeading.label).toEqual('Sub Heading')

    expect(inputConfig).toMatchInlineSnapshot(`
      {
        "actions": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "key": "actions",
          "label": "Actions",
          "prompt": "List of link buttons",
        },
        "heading": {
          "cumulativeTime": 4000,
          "estimatedMs": 4000,
          "isEnabled": true,
          "key": "heading",
          "label": "Heading",
          "prompt": "Primary hero headline, 3 to 13 words",
        },
        "layout": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "key": "layout",
          "label": "Layout",
          "prompt": "Alignment style of text and images",
        },
        "splash": {
          "cumulativeTime": 8000,
          "estimatedMs": 40000,
          "key": "splash",
          "label": "Splash",
          "prompt": "Splash picture for hero",
        },
        "subHeading": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "isEnabled": true,
          "key": "subHeading",
          "label": "Sub Heading",
          "prompt": "Secondary hero headline, 10 to 30 words",
        },
        "superHeading": {
          "cumulativeTime": 8000,
          "estimatedMs": 4000,
          "key": "superHeading",
          "label": "Super Heading",
          "prompt": "Shorter badge above headline, 2 to 5 words",
        },
      }
    `)
  })
})

describe('cardTemplate', async () => {
  const _testUtils = await createSiteTestUtils()
  it('initializes correctly with default settings', async () => {
    const site = new Site({ fictionSites: _testUtils.fictionSites, siteRouter: _testUtils.fictionRouterSites, themeId: 'test' })

    expect(site?.theme.value?.templates.map(t => t.settings.templateId)).toMatchInlineSnapshot(`
      [
        "wrap",
        "404",
        "quotes",
        "profile",
        "hero",
        "marquee",
        "area",
        "map",
        "magazine",
        "capture",
        "testWrap",
      ]
    `)
    const card = new Card({ templateId: 'hero', site })

    await waitFor(50)

    expect(card.templateId.value).toBe('hero')

    expect(card.tpl.value).toBeInstanceOf(CardTemplate)
  })
})
