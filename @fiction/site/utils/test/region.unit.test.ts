/**
 * @vitest-environment happy-dom
 */
import type { CardConfigPortable, TableCardConfig } from '../../tables'
import { shortId, waitFor } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { Card } from '../../card'
import { requestManageSite } from '../../load'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'
import { addNewCard, removeCard, requestManagePage, updatePage } from '../region'

describe('removeCard', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }

  it('should successfully remove a card from a region', async () => {
    const site = await Site.create({ ...common, isProd: false, themeId: 'test', siteId: `test-${shortId()}` })

    // First, add a card to ensure there's something to remove
    const cardId = 'cardToRemove'
    await addNewCard({ site, templateId: 'cardPageAreaV1', addToRegion: 'header', cardId })

    // Ensure the card was added
    expect(site.availableCards.value.some(c => c.cardId === cardId)).toBe(true)

    // Now, remove the card
    removeCard({ site, cardId })

    // Verify the card has been removed
    expect(site.availableCards.value.some(c => c.cardId === cardId)).toBe(false)
  })

  it('should successfully remove a nested card', async () => {
    const site = await Site.create({ ...common, isProd: false, themeId: 'test', siteId: `test-${shortId()}` })

    // Add a parent and a nested card
    const parentCardId = 'parentCard'
    const nestedCardId = 'nestedCard'
    await addNewCard({ site, templateId: 'cardPageAreaV1', addToRegion: 'footer', cardId: parentCardId })
    await addNewCard({ site, templateId: 'cardPageAreaV1', addToCardId: parentCardId, cardId: nestedCardId })

    // Ensure the nested card was added
    const parentCard = site.availableCards.value.find(c => c.cardId === parentCardId)
    expect(parentCard?.cards?.value.some(c => c.cardId === nestedCardId)).toBe(true)

    // Now, remove the nested card
    removeCard({ site, cardId: nestedCardId })

    // Verify the nested card has been removed
    expect(parentCard?.cards?.value.some(c => c.cardId === nestedCardId)).toBe(false)
  })

  it('should throw an error if attempting to remove a card that does not exist', async () => {
    const site = await Site.create({ ...common, isProd: false, themeId: 'test', siteId: `test-${shortId()}` })

    // Attempt to remove a non-existent card
    const nonExistentCardId = 'nonExistentCard'
    expect(() => removeCard({ site, cardId: nonExistentCardId })).toThrow(`Card with ID ${nonExistentCardId} not found.`)
  })

  it('should call onRemove callback when a card is successfully removed', async () => {
    const site = await Site.create({ ...common, isProd: false, themeId: 'test', siteId: `test-${shortId()}` })
    const cardId = 'cardWithCallback'
    await addNewCard({ site, templateId: 'cardPageAreaV1', addToRegion: 'main', cardId })

    let callbackCalled = false
    removeCard({ site, cardId, onRemove: (removedCardId) => {
      expect(removedCardId).toMatchObject({ cardId })
      callbackCalled = true
    } })

    expect(callbackCalled).toBe(true)
  })
})

describe('addNewCard', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }

  it('should throw an error if template is not found', async () => {
    const site = await Site.create({ ...common, isProd: false, themeId: 'test', siteId: `test-${shortId()}` })

    await expect(addNewCard({ site, templateId: 'noExist' })).rejects.toThrow(`Could not find template with key noExist`)
  })

  it('should add a new card to a region if addToCardId is not provided', async () => {
    const site = await Site.create({ ...common, isProd: false, themeId: 'test', siteId: `test-${shortId()}` }, { loadThemePages: true })

    expect(site.viewMap.value.example).toBeTruthy()
    expect(site.viewMap.value._home).toBeTruthy()
    expect(Object.keys(site.viewMap.value)).toMatchInlineSnapshot(`
      [
        "_home",
        "_",
        "example",
        "__transaction",
      ]
    `)
    expect(site.activePageId.value).toBeTruthy()
    expect(site.currentPage.value.templateId.value).toBe('cardPageWrapV1')
    expect(Object.keys(site.layout.value)).toContain('header')

    const cardId = 'card1'
    let r1: CardConfigPortable | undefined
    const r2 = await addNewCard({ site, templateId: 'cardPageAreaV1', addToRegion: 'header', cardId, onAdd: (config) => { r1 = config } })

    expect(r1?.cardId, 'callback is correct').toBe(cardId)
    expect(r2?.cardId, 'return is correct when not delayed').toBe(cardId)

    expect(site.availableCards.value.filter(_ => _.cardId === cardId)).toHaveLength(1)

    expect(site.availableCards.value.find(_ => _.cardId === cardId)?.regionId).toBe('header')
  })

  it('should add a new card to an existing card if addToCardId is provided', async () => {
    const site = await Site.create({ ...common, isProd: false, themeId: 'test', siteId: `test-${shortId()}` })

    await addNewCard({ site, templateId: 'cardPageAreaV1', addToRegion: 'footer', cardId: 'firstCard' })
    await addNewCard({ site, templateId: 'cardPageAreaV1', addToCardId: 'firstCard', cardId: 'nestedCard' })

    const setCard = site.availableCards.value.find(c => c.cardId === 'firstCard')?.cards.value[0]
    expect(setCard?.cardId).toBe('nestedCard')
  })

  it('should delay the addCard action if delay is provided and greater than 0', async () => {
    const site = await Site.create({ ...common, isProd: false, themeId: 'test', siteId: `test-${shortId()}` })

    const delay = 100
    let r1: CardConfigPortable | undefined
    await addNewCard({ site, templateId: 'cardPageAreaV1', addToRegion: 'footer', cardId: 'firstCard', delay, onAdd: (config) => { r1 = config } })

    expect(r1).toBeUndefined()

    await waitFor(110)

    expect(r1?.cardId).toBeDefined()
  })
})

describe('updatePage', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` }
  const cardCommon = { regionId: 'main', templateId: 'cardPageAreaV1' } as const
  it('should add a new card if it does not exist', async () => {
    const site = await Site.create({ ...common, isProd: false })
    const cardConfig: Partial<TableCardConfig> = { cardId: 'card1', ...cardCommon }
    const initialLength = site.pages.value.length

    updatePage({ site, cardConfig })

    expect(site.pages.value).toHaveLength(initialLength + 1)
    expect(site.pages.value[0]).toBeInstanceOf(Card)
  })

  it('should update the existing card if it already exists', async () => {
    const site = await Site.create({ ...common, isProd: false })

    const id = 'existingCard'
    site.pages.value.push(new Card({ cardId: id, userConfig: { val: 'bravo' }, site }))

    const cardConfig: Partial<TableCardConfig> = { cardId: id, userConfig: { val: 'alpha' }, ...cardCommon }
    updatePage({ site, cardConfig })

    const reg = site.pages.value.filter(c => c.cardId === id)
    expect(reg).toHaveLength(1)
    expect(reg[0].userConfig.value.val).toEqual('alpha')
  })
})

describe('requestManagePage', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteMode: 'standard' } as const
  const result = await requestManageSite(
    {
      _action: 'create',
      fields: { title: 'test', themeId: 'test' },
      caller: 'iframeEditingTest',
      ...common,
    },
  )
  if (!result.site || !result.response?.data)
    throw new Error('problem creating site')

  const site = result.site
  it('should throw an error if no action is provided', async () => {
    const regionCard: Partial<TableCardConfig> = { cardId: 'card1' }

    // @ts-expect-error test
    await expect(requestManagePage({
      site,
      regionCard,
      delay: 0,
    })).rejects.toThrow('Action is required.')
  })

  it('should process the upsert action correctly', async () => {
    const regionCard: Partial<TableCardConfig> = { cardId: 'card2', templateId: 'template1' }
    const { cardConfig: cc1 } = await requestManagePage({
      site,
      _action: 'upsert',
      regionCard,
      delay: 0,
      caller: 'upsert1',
    })

    expect(cc1?.cardId).toBe('card2')
    expect(cc1?.templateId).toBe('template1')
    expect(cc1?.regionId).toBe('main')
    expect(cc1?.siteId).toBe(site.siteId)

    const { cardConfig: cc2 } = await requestManagePage({
      site,
      _action: 'upsert',
      regionCard: { templateId: 'template2', cardId: cc1?.cardId },
      delay: 0,
      caller: 'upsert2',
    })
    expect(cc2?.cardId).toBe(cc1?.cardId)
    expect(cc2?.templateId).toBe('template2')
    expect(cc2?.regionId).toBe(cc1?.regionId)
    expect(cc2?.siteId).toBe(cc1?.siteId)
    expect(cc2?.updatedAt).not.toBe(cc1?.updatedAt)

    const { response } = await requestManagePage({
      site,
      _action: 'delete',
      regionCard,
      delay: 0,
    })

    expect(response?.status).toBe('success')

    const r = await site.fictionSites.requests.ManagePage.projectRequest({
      siteId: site.siteId,
      _action: 'retrieve',
      where: [{ cardId: cc1?.cardId || '' }],
      caller: 'retrieveAttemptAfterDelete',
      scope: 'publish',
    })

    expect(r.status).toBe('error')

    expect(r).toMatchInlineSnapshot(`
      {
        "data": [],
        "indexMeta": {
          "count": 2,
          "limit": 40,
          "offset": 0,
        },
        "status": "error",
      }
    `)
  })
})
