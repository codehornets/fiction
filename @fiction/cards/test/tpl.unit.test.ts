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
    const factory = new CardFactory({ site, templates, caller: 'verifyTemplateSettings' })
    const demoPages = await getDemoPages({ templates, site, factory })

    const templatesOptionConfigPromises = templates.map(async (_) => {
      const config = await _.getConfig({ site })
      const { schema, options = [] } = config
      const conf = await refineOptions({ options, schema, templateId: _.settings.templateId })
      return {
        templateId: _.settings.templateId,
        unusedSchema: conf.unusedSchema,
        isPublic: _.settings.isPublic,
        hasDemo: !!(config.demoPage || demoPages.some(d => d.slug === `card-${_.settings.templateId}`)),
      }
    })

    const templatesOptionConfig = await Promise.all(templatesOptionConfigPromises)

    expect(templatesOptionConfig, 'snapshot').toMatchInlineSnapshot(`
      [
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "contentHero",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "contentProfile",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "contentStory",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "contentFeatures",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "sliderStatement",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "contentBento",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "contentPeople",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "proofTestimonials",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "proofQuotes",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "proofMetrics",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "proofLogos",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "galleryShowcase",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "postsList",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "postsMagazine",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "socialInsta",
          "unusedSchema": {
            "account.isGridView": "boolean",
            "header.showBio": "boolean",
            "header.showFollowers": "boolean",
            "header.showPostCount": "boolean",
          },
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "contentNumberedList",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "contentFaq",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "contentTimeline",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "sliderCinema",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "galleryMasonry",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "modalMedia",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "contentTour",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "convertCta",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "convertCapture",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "convertContact",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "convertPricing",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "locationMaps",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "pageWrap",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "pageArea",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "pageNav",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "pageFooterPro",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "pageFooterPersonal",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "mediaMarquee",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "sliderOverlay",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "typographyTicker",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "galleryParallaxScroll",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "typographyFitText",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "effectShape",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "effectText",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "page404",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "pageTransaction",
          "unusedSchema": undefined,
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
