import { CardFactory } from '@fiction/site/cardFactory'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { refineOptions } from '@fiction/site/utils/schema'
import { describe, expect, it } from 'vitest'
import { getCardTemplates, getDemoPages } from '..'

describe('verify template settings config', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await testUtils.createSite()

  const templates = await getCardTemplates()

  it('has template options set correctly', async () => {
    const factory = new CardFactory({ site, templates })
    const demoPages = await getDemoPages({ templates, site, factory })

    const templatesOptionConfigPromises = templates.map(async (_) => {
      const config = await _.getConfig({ site })
      const { schema, options = [] } = config
      const conf = await refineOptions({ options, schema, templateId: _.settings.templateId })
      return {
        templateId: _.settings.templateId,
        unusedSchema: conf.unusedSchema,
        isPublic: _.settings.isPublic,
        hasDemo: !!(_.settings.demoPage || demoPages.some(d => d.slug === `card-${_.settings.templateId}`)),
      }
    })

    const templatesOptionConfig = await Promise.all(templatesOptionConfigPromises)

    expect(templatesOptionConfig, 'snapshot').toMatchInlineSnapshot(`
      [
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "wrap",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "area",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "nav",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": true,
          "templateId": "footerPro",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": true,
          "templateId": "footerOmega",
          "unusedSchema": {
            "additional": "object",
            "additional.list1": "array",
            "additional.list1.0.authState": "string",
            "additional.list1.0.desc": "string",
            "additional.list1.0.href": "string",
            "additional.list1.0.items": "array",
            "additional.list1.0.itemsTitle": "string",
            "additional.list1.0.media": "object",
            "additional.list1.0.media.class": "string, tabler iconify class i-tabler-[icon-name]",
            "additional.list1.0.media.el": "unknown",
            "additional.list1.0.media.format": "string",
            "additional.list1.0.media.html": "string",
            "additional.list1.0.media.iconId": "string, iconId is common icon name (e.g. user, check, lock)",
            "additional.list1.0.media.url": "string",
            "additional.list1.0.name": "string",
            "additional.list1.0.priority": "number",
            "additional.list1.0.target": "string",
            "additional.list1.0.testId": "string",
            "additional.list1.0.title": "string",
            "additional.list2": "array",
            "additional.list2.0.authState": "string",
            "additional.list2.0.desc": "string",
            "additional.list2.0.href": "string",
            "additional.list2.0.items": "array",
            "additional.list2.0.itemsTitle": "string",
            "additional.list2.0.media": "object",
            "additional.list2.0.media.class": "string, tabler iconify class i-tabler-[icon-name]",
            "additional.list2.0.media.el": "unknown",
            "additional.list2.0.media.format": "string",
            "additional.list2.0.media.html": "string",
            "additional.list2.0.media.iconId": "string, iconId is common icon name (e.g. user, check, lock)",
            "additional.list2.0.media.url": "string",
            "additional.list2.0.name": "string",
            "additional.list2.0.priority": "number",
            "additional.list2.0.target": "string",
            "additional.list2.0.testId": "string",
            "additional.list2.0.title": "string",
            "menus.0.authState": "string",
            "menus.0.desc": "string",
            "menus.0.href": "string",
            "menus.0.media": "object",
            "menus.0.media.class": "string, tabler iconify class i-tabler-[icon-name]",
            "menus.0.media.el": "unknown",
            "menus.0.media.format": "string",
            "menus.0.media.html": "string",
            "menus.0.media.iconId": "string, iconId is common icon name (e.g. user, check, lock)",
            "menus.0.media.url": "string",
            "menus.0.name": "string",
            "menus.0.priority": "number",
            "menus.0.target": "string",
            "menus.0.testId": "string",
            "menus.0.title": "string",
          },
        },
        {
          "hasDemo": false,
          "isPublic": true,
          "templateId": "hero",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "story",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "quotes",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "profile",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "features",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "faq",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "statement",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "testimonials",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "metrics",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "people",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "logos",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "hitlist",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "bento",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "cinema",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "gallery",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "magazine",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "mediaGrid",
          "unusedSchema": undefined,
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "mediaPop",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "showcase",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "capture",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "contact",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "maps",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "pricing",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "tour",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": true,
          "templateId": "ctaAlpha",
          "unusedSchema": {
            "action": "object",
            "action.href": "string",
            "action.icon": "string",
            "action.isNewsletter": "boolean",
            "action.label": "string",
            "action.theme": "string",
            "media": "object",
            "media.alt": "string",
            "media.url": "string",
            "newsletterConfig": "object",
            "newsletterConfig.buttonText": "string",
            "newsletterConfig.placeholder": "string",
            "newsletterConfig.successMessage": "string",
          },
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "effectShape",
          "unusedSchema": {
            "shapes.0.blendMode": "string",
            "shapes.0.color": "string",
            "shapes.0.opacity": "number",
            "shapes.0.position": "object",
            "shapes.0.position.offsetX": "number",
            "shapes.0.position.offsetY": "number",
            "shapes.0.position.origin": "string",
            "shapes.0.rotation": "string",
            "shapes.0.scale": "number",
            "shapes.0.shape": "string",
          },
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "fitText",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "marquee",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "overSlide",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "textEffects",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "ticker",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "trek",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "404",
          "unusedSchema": {
            "actions.0.disabled": "boolean",
            "actions.0.format": "string",
            "actions.0.loading": "boolean",
            "actions.0.rounding": "string",
            "actions.0.testId": "string",
          },
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "transaction",
          "unusedSchema": {},
        },
      ]
    `)

    const undefinedSchema = templatesOptionConfig.filter(_ => typeof _.unusedSchema === 'undefined' && _.isPublic).map(_ => _.templateId)

    expect(undefinedSchema, 'undefined schema').toStrictEqual([])

    const incompleteSchema = templatesOptionConfig.filter(_ => (Object.keys(_.unusedSchema || {}).length > 0 && _.isPublic)).map(_ => _.templateId)

    expect(incompleteSchema, 'no unused schema in public cards').toStrictEqual([])

    const incompletePublic = templatesOptionConfig.filter(_ => typeof _.isPublic === 'undefined' || (_.isPublic === true && _.hasDemo === false ? _.templateId : undefined)).map(_ => _.templateId)

    expect(incompletePublic, 'incomplete public cards').toMatchInlineSnapshot(`[]`)
    expect(incompletePublic).toStrictEqual([])
  })
})
