import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { describe, expect, it } from 'vitest'
import { getDemoPages, standardCardTemplates } from '..'

describe('verify template settings config', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await testUtils.createSite()

  it('has template options set correctly', async () => {
    const demoPages = await getDemoPages({ templates: standardCardTemplates, site })
    const templatesOptionConfig = standardCardTemplates.map((_) => {
      return {
        templateId: _.settings.templateId,
        unusedSchema: _.optionConfig.unusedSchema,
        isPublic: _.settings.isPublic,
        hasDemo: !!(_.settings.demoPage || demoPages.some(d => d.slug === `card-${_.settings.templateId}`)),
      }
    })

    expect(templatesOptionConfig, 'snapshot').toMatchInlineSnapshot(`
      [
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "wrap",
          "unusedSchema": {
            "fixedHeader": "boolean",
          },
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "transaction",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "404",
          "unusedSchema": {
            "actions.0.btn": "string",
          },
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "nav",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "footer",
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
          "templateId": "hero",
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
          "templateId": "area",
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
          "isPublic": false,
          "templateId": "magazine",
          "unusedSchema": {
            "posts": "object",
            "posts.items": "array",
            "posts.items.0.authors": "array",
            "posts.items.0.authors.0.avatar": "object",
            "posts.items.0.authors.0.avatar.alt": "string",
            "posts.items.0.authors.0.avatar.bgColor": "string",
            "posts.items.0.authors.0.avatar.bgGradient": "object",
            "posts.items.0.authors.0.avatar.bgGradient.angle": "number",
            "posts.items.0.authors.0.avatar.bgGradient.css": "string",
            "posts.items.0.authors.0.avatar.bgGradient.stops": "array",
            "posts.items.0.authors.0.avatar.bgGradient.stops.0.color": "string",
            "posts.items.0.authors.0.avatar.bgGradient.stops.0.opacity": "number",
            "posts.items.0.authors.0.avatar.bgGradient.stops.0.percent": "number",
            "posts.items.0.authors.0.avatar.bgGradient.stops.0.scale": "number",
            "posts.items.0.authors.0.avatar.bgGradient.stops.0.theme": "string",
            "posts.items.0.authors.0.avatar.bgPosition": "string",
            "posts.items.0.authors.0.avatar.bgRepeat": "string",
            "posts.items.0.authors.0.avatar.bgSize": "string",
            "posts.items.0.authors.0.avatar.blurhash": "string",
            "posts.items.0.authors.0.avatar.caption": "string",
            "posts.items.0.authors.0.avatar.class": "string",
            "posts.items.0.authors.0.avatar.el": "unknown",
            "posts.items.0.authors.0.avatar.filters": "array",
            "posts.items.0.authors.0.avatar.filters.0.filter": "string",
            "posts.items.0.authors.0.avatar.filters.0.percent": "number",
            "posts.items.0.authors.0.avatar.filters.0.value": "string",
            "posts.items.0.authors.0.avatar.format": "string",
            "posts.items.0.authors.0.avatar.height": "number",
            "posts.items.0.authors.0.avatar.html": "string",
            "posts.items.0.authors.0.avatar.iconId": "string",
            "posts.items.0.authors.0.avatar.mime": "string",
            "posts.items.0.authors.0.avatar.modify": "object",
            "posts.items.0.authors.0.avatar.modify.flip": "string",
            "posts.items.0.authors.0.avatar.overlay": "object",
            "posts.items.0.authors.0.avatar.overlay.blendMode": "string",
            "posts.items.0.authors.0.avatar.overlay.color": "string",
            "posts.items.0.authors.0.avatar.overlay.gradient": "object",
            "posts.items.0.authors.0.avatar.overlay.gradient.angle": "number",
            "posts.items.0.authors.0.avatar.overlay.gradient.css": "string",
            "posts.items.0.authors.0.avatar.overlay.gradient.stops": "array",
            "posts.items.0.authors.0.avatar.overlay.gradient.stops.0.color": "string",
            "posts.items.0.authors.0.avatar.overlay.gradient.stops.0.opacity": "number",
            "posts.items.0.authors.0.avatar.overlay.gradient.stops.0.percent": "number",
            "posts.items.0.authors.0.avatar.overlay.gradient.stops.0.scale": "number",
            "posts.items.0.authors.0.avatar.overlay.gradient.stops.0.theme": "string",
            "posts.items.0.authors.0.avatar.overlay.opacity": "number",
            "posts.items.0.authors.0.avatar.thumbUrl": "string",
            "posts.items.0.authors.0.avatar.url": "string",
            "posts.items.0.authors.0.avatar.width": "number",
            "posts.items.0.authors.0.email": "string",
            "posts.items.0.authors.0.fullName": "string",
            "posts.items.0.authors.0.title": "string",
            "posts.items.0.authors.0.websiteUrl": "string",
            "posts.items.0.categories": "array",
            "posts.items.0.categories.0.slug": "string",
            "posts.items.0.categories.0.title": "string",
            "posts.items.0.categories.0.type": "string",
            "posts.items.0.content": "string",
            "posts.items.0.media": "object",
            "posts.items.0.media.alt": "string",
            "posts.items.0.media.bgColor": "string",
            "posts.items.0.media.bgGradient": "object",
            "posts.items.0.media.bgGradient.angle": "number",
            "posts.items.0.media.bgGradient.css": "string",
            "posts.items.0.media.bgGradient.stops": "array",
            "posts.items.0.media.bgGradient.stops.0.color": "string",
            "posts.items.0.media.bgGradient.stops.0.opacity": "number",
            "posts.items.0.media.bgGradient.stops.0.percent": "number",
            "posts.items.0.media.bgGradient.stops.0.scale": "number",
            "posts.items.0.media.bgGradient.stops.0.theme": "string",
            "posts.items.0.media.bgPosition": "string",
            "posts.items.0.media.bgRepeat": "string",
            "posts.items.0.media.bgSize": "string",
            "posts.items.0.media.blurhash": "string",
            "posts.items.0.media.caption": "string",
            "posts.items.0.media.class": "string",
            "posts.items.0.media.el": "unknown",
            "posts.items.0.media.filters": "array",
            "posts.items.0.media.filters.0.filter": "string",
            "posts.items.0.media.filters.0.percent": "number",
            "posts.items.0.media.filters.0.value": "string",
            "posts.items.0.media.format": "string",
            "posts.items.0.media.height": "number",
            "posts.items.0.media.html": "string",
            "posts.items.0.media.iconId": "string",
            "posts.items.0.media.mime": "string",
            "posts.items.0.media.modify": "object",
            "posts.items.0.media.modify.flip": "string",
            "posts.items.0.media.overlay": "object",
            "posts.items.0.media.overlay.blendMode": "string",
            "posts.items.0.media.overlay.color": "string",
            "posts.items.0.media.overlay.gradient": "object",
            "posts.items.0.media.overlay.gradient.angle": "number",
            "posts.items.0.media.overlay.gradient.css": "string",
            "posts.items.0.media.overlay.gradient.stops": "array",
            "posts.items.0.media.overlay.gradient.stops.0.color": "string",
            "posts.items.0.media.overlay.gradient.stops.0.opacity": "number",
            "posts.items.0.media.overlay.gradient.stops.0.percent": "number",
            "posts.items.0.media.overlay.gradient.stops.0.scale": "number",
            "posts.items.0.media.overlay.gradient.stops.0.theme": "string",
            "posts.items.0.media.overlay.opacity": "number",
            "posts.items.0.media.thumbUrl": "string",
            "posts.items.0.media.url": "string",
            "posts.items.0.media.width": "number",
            "posts.items.0.slug": "string",
            "posts.items.0.status": "string",
            "posts.items.0.subTitle": "string",
            "posts.items.0.tags": "array",
            "posts.items.0.tags.0.slug": "string",
            "posts.items.0.tags.0.title": "string",
            "posts.items.0.tags.0.type": "string",
            "posts.items.0.taxonomy": "array",
            "posts.items.0.taxonomy.0.slug": "string",
            "posts.items.0.taxonomy.0.title": "string",
            "posts.items.0.taxonomy.0.type": "string",
            "posts.items.0.title": "string",
            "posts.limit": "number",
            "posts.mode": "string",
          },
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "demoProse",
          "unusedSchema": undefined,
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
          "templateId": "showcase",
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
          "isPublic": false,
          "templateId": "story",
          "unusedSchema": {
            "items.0.actions": "array",
            "items.0.actions.0.href": "string",
            "items.0.actions.0.name": "string",
            "items.0.content": "string",
            "items.0.media": "object",
            "items.0.media.format": "string",
            "items.0.media.html": "string",
            "items.0.media.url": "string",
            "items.0.title": "string",
          },
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
          "templateId": "people",
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
          "templateId": "logos",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "mediaGrid",
          "unusedSchema": undefined,
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "tour",
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
          "templateId": "metrics",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "faq",
          "unusedSchema": {},
        },
        {
          "hasDemo": false,
          "isPublic": false,
          "templateId": "mediaPop",
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
          "isPublic": false,
          "templateId": "trek",
          "unusedSchema": {
            "items.0.actions": "array",
            "items.0.actions.0.href": "string",
            "items.0.actions.0.name": "string",
            "items.0.actions.0.theme": "string",
            "items.0.media.video": "string",
          },
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "fitText",
          "unusedSchema": {
            "font": "string",
            "lines": "number",
            "maxFontSize": "number",
            "minFontSize": "number",
            "text": "string",
          },
        },
        {
          "hasDemo": true,
          "isPublic": true,
          "templateId": "overSlide",
          "unusedSchema": {},
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "statement",
          "unusedSchema": {
            "items.0.actions": "array",
            "items.0.actions.0.design": "string",
            "items.0.actions.0.disabled": "boolean",
            "items.0.actions.0.format": "string",
            "items.0.actions.0.href": "string",
            "items.0.actions.0.icon": "string",
            "items.0.actions.0.iconAfter": "string",
            "items.0.actions.0.loading": "boolean",
            "items.0.actions.0.name": "string",
            "items.0.actions.0.size": "string",
            "items.0.actions.0.theme": "string",
            "items.0.title": "string",
          },
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "testimonials",
          "unusedSchema": {
            "items.0.action": "object",
            "items.0.action.href": "string",
            "items.0.action.name": "string",
            "items.0.href": "string",
            "items.0.media": "object",
            "items.0.media.format": "string",
            "items.0.media.url": "string",
            "items.0.title": "string",
            "items.0.user": "object",
            "items.0.user.avatar": "object",
            "items.0.user.avatar.format": "string",
            "items.0.user.avatar.url": "string",
            "items.0.user.fullName": "string",
            "items.0.user.title": "string",
            "layout": "string",
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
          "isPublic": false,
          "templateId": "gallery",
          "unusedSchema": {
            "items.0.columns": "string",
            "items.0.href": "string",
            "items.0.media": "object",
            "items.0.media.format": "string",
            "items.0.media.url": "string",
            "items.0.rows": "string",
            "items.0.title": "string",
          },
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "contact",
          "unusedSchema": {
            "form": "object",
            "form.notifyEmails": "array",
            "items": "array, List of contact details",
            "items.0.items": "array, List of details with contact details, location, etc.",
            "items.0.items.0.content": "string",
            "items.0.items.0.href": "string",
            "items.0.items.0.icon": "string",
            "items.0.items.0.title": "string",
            "items.0.title": "string, Title for list of details",
            "layout": "string, Layout of the card, image on left or right",
            "socials": "array, List of social media links",
            "socials.0.href": "string, Full link for href",
            "socials.0.icon": "string, icon reference associated with the social media platform (x, youtube, facebook, etc)",
            "socials.0.name": "string, @handle on (platform)",
            "subTitle": "string, Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs",
            "superTitle": "string, Shorter badge above headline, 2 to 5 words",
            "title": "string, Primary headline for profile 3 to 8 words",
          },
        },
        {
          "hasDemo": true,
          "isPublic": false,
          "templateId": "hitlist",
          "unusedSchema": {
            "content": "string",
            "items.0.subTitle": "string",
            "items.0.title": "string",
            "media": "object",
            "media.format": "string",
            "media.url": "string",
            "title": "string",
          },
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
