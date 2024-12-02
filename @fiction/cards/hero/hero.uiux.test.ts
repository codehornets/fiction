import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { collectKeysFromOptions } from '@fiction/site/utils/schema.js'
import { afterAll, describe, expect, it } from 'vitest'
import { template } from './index.js'

const headless = true

describe('hero: card', async () => {
  const kit = await createSiteUiTestingKit({ headless })

  afterAll(async () => kit?.close())

  it('hero: displays correctly', async () => {
    await kit.performActions({
      caller: 'hero',
      path: '/demo-hero',
      actions: [
        { type: 'count', selector: '[data-card-type="hero"]' },
      ],
    })
  })
})

describe('validate option keys', async () => {
  const config = await template.getConfig({})
  it('hero: validate option keys', async () => {
    const optionKeys = config.options || []
    const keys = collectKeysFromOptions(optionKeys)

    expect(keys).toMatchInlineSnapshot(`
      [
        "title",
        "subTitle",
        "superHeading",
        "layout",
        "superColor",
        "superIcon",
        "superIcon.url",
        "superIcon.format",
        "superIcon.html",
        "superIcon.iconId",
        "superIcon.el",
        "superIcon.class",
        "superIcon.props",
        "splash",
        "splash.*",
        "caption",
        "actions",
        "actions.0.testId",
        "actions.0.design",
        "actions.0.href",
        "actions.0.icon",
        "actions.0.iconAfter",
        "actions.0.name",
        "actions.0.size",
        "actions.0.target",
        "actions.0.theme",
        "actions.0.rounding",
        "actions.0.disabled",
        "actions.0.format",
        "actions.0.loading",
      ]
    `)
  })
})
