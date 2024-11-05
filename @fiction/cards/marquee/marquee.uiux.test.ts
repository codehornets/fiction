import { isCi } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { collectKeysFromOptions } from '@fiction/site/utils/schema'
import { afterAll, describe, expect, it } from 'vitest'
import { template } from './index.js'

const headless = true

describe('marquee card', async () => {
  const kit = await createSiteUiTestingKit({ headless })

  afterAll(async () => kit?.close())

  it('marquee: displays correctly', { retry: isCi() ? 3 : 1 }, async () => {
    await kit.performActions({
      caller: 'marquee',
      path: '/demo-marquee',
      actions: [
        { type: 'exists', selector: '[data-display-items]' },
        { type: 'exists', selector: '.marquee-track.reverse' },
      ],
    })
  })
})

describe('validate option keys', async () => {
  it('marquee: validate option keys', async () => {
    const optionKeys = template.settings.options || []
    const keys = collectKeysFromOptions(optionKeys)

    expect(keys).toMatchInlineSnapshot(`
      [
        "items",
        "items.0.title",
        "items.0.subTitle",
        "items.0.media",
        "items.0.media.url",
        "items.0.media.format",
        "items.0.media.html",
        "items.0.media.el",
        "items.0.media.modify.*",
        "items.0.href",
        "direction",
        "stagger",
      ]
    `)

    const expectedKeys = [
      'items',
      'items.0.title',
      'items.0.subTitle',
      'items.0.media',
      'items.0.media.url',
      'items.0.media.format',
      'items.0.media.html',
      'items.0.media.el',
      'items.0.media.modify.*',
      'items.0.href',
      'direction',
      'stagger',
    ]

    expect(new Set(keys)).toEqual(new Set(expectedKeys))
  })
})
