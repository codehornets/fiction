import type { JsonSchema7ObjectType } from 'zod-to-json-schema'
import { getCardTemplates } from '@fiction/cards'
import { shortId } from '@fiction/core'
import { CardFactory } from '@fiction/site/cardFactory'
import { describe, expect, it, vi } from 'vitest'
import zodToJsonSchema from 'zod-to-json-schema'
import { Card } from '../../card'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'
import { calculateTotalEstimatedTimeSeconds, generateJsonPropConfig, generateOutputProps, type InputOptionGeneration, parseDescription, simulateProgress } from '../generation'

describe('generation utils', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await Site.create({ fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` })

  const templates = await getCardTemplates()
  const inlineTemplate = templates.find(t => t.settings.templateId === 'hero')
  const card = new Card({
    site,
    inlineTemplate,
    title: 'Test Card',
  })
  const conf = await card.tpl.value?.settings.getConfig?.({ site })
  const zodSchema = conf?.schema
  if (!zodSchema)
    throw new Error('No schema found')

  const jsonSchema = zodToJsonSchema(zodSchema) as JsonSchema7ObjectType

  it('gets default input config', () => {
    const inputConfig = generateJsonPropConfig({ jsonSchema, userPropConfig: {} })

    expect(Object.keys(inputConfig)).toMatchInlineSnapshot(`
      [
        "heading",
        "subHeading",
        "superHeading",
        "superIcon",
        "superColor",
        "splash",
        "overlays",
      ]
    `)

    const outputProps = generateOutputProps({ jsonSchema, jsonPropConfig: inputConfig })

    // empty because no isUserEnabled
    expect(outputProps).toStrictEqual({})

    const inputConfig2 = generateJsonPropConfig({ jsonSchema, userPropConfig: { heading: { isUserEnabled: true }, subHeading: { isUserEnabled: true } } })
    const outputProps2 = generateOutputProps({ jsonSchema, jsonPropConfig: inputConfig2 })

    expect(Object.values(inputConfig2).filter(c => c.isUserEnabled).length).toBe(2)
    expect(Object.values(outputProps2).filter(c => c.description).length).toBe(2)
  })

  it('parses description correctly', () => {
    const description = 'This is a test [ai seconds=4 type=image]'
    const result = parseDescription(description)
    expect(result).toEqual({
      description: 'This is a test',
      attributes: { seconds: 4, type: 'image' },
      hasTag: true,
    })
  })

  it('parses description with empty attributes correctly', () => {
    const description = 'Only description'
    const result = parseDescription(description)
    expect(result).toEqual({
      description: 'Only description',
      attributes: {},
      hasTag: false,
    })
  })

  it('generates output props correctly', () => {
    const jsonSchema = {
      properties: {
        heading: { type: 'string', description: 'Primary hero headline, 3 to 13 words' },
        subHeading: { type: 'string', description: 'Secondary hero headline, 10 to 30 words' },
      },
    } as unknown as JsonSchema7ObjectType

    const jsonPropConfig = {
      heading: { isUserEnabled: true, prompt: 'Custom heading' },
      subHeading: { isUserEnabled: false, prompt: 'Custom subheading' },
    }

    const result = generateOutputProps({ jsonSchema, jsonPropConfig })

    expect(result).toEqual({
      heading: { type: 'string', description: 'Custom heading' },
    })
  })

  it('handles missing descriptions in generateJsonPropConfig', () => {
    const jsonSchema = {
      properties: {
        heading: { type: 'string' },
      },
    } as unknown as JsonSchema7ObjectType

    const userPropConfig = {
      heading: { isUserEnabled: true, hasTag: true },
    }

    const result = generateJsonPropConfig({ jsonSchema, userPropConfig })

    expect(result).toEqual({ })
  })

  it('handles numeric meta correctly in parseDescription', () => {
    const description = 'This is a test [ai time=40 count=10]'
    const result = parseDescription(description)
    expect(result).toEqual({
      description: 'This is a test',
      attributes: { time: 40, count: 10 },
      hasTag: true,
    })
  })

  it('calculates total estimated time correctly', () => {
    const jsonPropConfig = {
      heading: { isUserEnabled: true, estimatedMs: 5000 },
      subHeading: { isUserEnabled: true, estimatedMs: 3000 },
      splash: { isUserEnabled: false, estimatedMs: 10000 },
    }

    const result = calculateTotalEstimatedTimeSeconds({ jsonPropConfig })

    expect(result).toBe(8) // (5000 + 3000) / 1000
  })

  it('returns zero for total estimated time with no enabled fields', () => {
    const jsonPropConfig = {
      heading: { isUserEnabled: false, estimatedMs: 5000 },
      subHeading: { isUserEnabled: false, estimatedMs: 3000 },
    }

    const result = calculateTotalEstimatedTimeSeconds({ jsonPropConfig })

    expect(result).toBe(0)
  })

  it('returns correct cumulative time in generateJsonPropConfig', () => {
    const jsonSchema = {
      properties: {
        heading: { type: 'string', description: 'Primary hero headline, 3 to 13 words' },
        subHeading: { type: 'string', description: 'Secondary hero headline, 10 to 30 words [ai]' },
      },
    } as unknown as JsonSchema7ObjectType

    const userPropConfig = {
      heading: { isUserEnabled: true },
      subHeading: { isUserEnabled: true },
    }

    const result = generateJsonPropConfig({ jsonSchema, userPropConfig })

    expect(result).toEqual({
      subHeading: {
        key: 'subHeading',
        label: 'Sub Heading',
        prompt: 'Secondary hero headline, 10 to 30 words',
        estimatedMs: 4000,
        cumulativeTime: 4000,
        isUserEnabled: true,
        hasTag: true,
      },
    })
  })
})

describe('simulateProgress', () => {
  it('simulates progress correctly', async () => {
    const jsonPropConfig: Record<string, InputOptionGeneration> = {
      heading: { isUserEnabled: true, label: 'heading', cumulativeTime: 5000 },
      subHeading: { isUserEnabled: true, label: 'subHeading', cumulativeTime: 10000 },
    }

    const totalEstimatedTime = 15 // 15 seconds
    const updateProgress = vi.fn()
    vi.useFakeTimers()

    const { complete } = simulateProgress({
      totalEstimatedTime,
      jsonPropConfig,
      updateProgress,
    })

    // Initial call to tick
    expect(updateProgress).toHaveBeenCalledWith({ percent: 3, status: 'Generating heading' })

    // Advance time by 5 seconds (1/3 of totalEstimatedTime)
    await vi.advanceTimersByTimeAsync(5000)
    expect(updateProgress).toHaveBeenCalledWith({ percent: 33, status: 'Generating heading' })

    // Advance time by another 5 seconds (2/3 of totalEstimatedTime)
    await vi.advanceTimersByTimeAsync(5000)
    expect(updateProgress).toHaveBeenCalledWith({ percent: 67, status: 'Generating subHeading' })

    // Advance time by another 5 seconds (3/3 of totalEstimatedTime)
    await vi.advanceTimersByTimeAsync(5000)
    expect(updateProgress).toHaveBeenCalledWith({ percent: 100, status: 'Wrapping up...' })

    complete()
    expect(updateProgress).toHaveBeenCalledWith({ percent: 100, status: 'Complete!' })

    vi.useRealTimers()
  })
})
