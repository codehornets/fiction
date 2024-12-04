import type { InitializedTestUtils } from '@fiction/core/test-utils'
import type { TableSiteConfig } from '../tables'
import type { SiteTestUtils } from './testUtils'
import { objectId, type Organization } from '@fiction/core'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createSiteTestUtils } from './testUtils'

describe('manageSite query', () => {
  let testUtils: SiteTestUtils
  let r: InitializedTestUtils
  let userId: string
  let orgId: string
  let org: Organization

  beforeEach(async () => {
    testUtils = await createSiteTestUtils()
    r = await testUtils.init()
    userId = r?.user?.userId ?? ''
    orgId = r?.user?.orgs?.[0]?.orgId ?? ''
    org = r?.org
  })

  afterEach(async () => {
    await testUtils.close()
  })

  const createSiteFields = (title: string) => ({
    title,
    themeId: 'test',
    subDomain: `test-${objectId({ prefix: 'sub' })}`,
  })

  describe('site deletion', () => {
    let siteId: string
    let cardId: string

    beforeEach(async () => {
      // Create a test site with pages
      const fields = createSiteFields('Deletion Test Site')
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )
      siteId = response.data?.siteId as string
      cardId = objectId({ prefix: 'card' })

      // Add some pages to the site
      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'upsert',
          siteId,
          fields: [
            { cardId, templateId: 'pageWrap', title: 'Test Page', slug: 'test-page' },
            { cardId: objectId({ prefix: 'card' }), templateId: 'pageWrap', title: 'Another Page', slug: 'another-page' },
          ],
          orgId,
          userId,
          caller: 'test',
          scope: 'publish',
        },
        { server: true },
      )
    })

    it('should successfully delete a site and its associated pages', async () => {
      // Delete the site
      const deleteResponse = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'delete', where: { siteId }, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(deleteResponse.status).toBe('success')
      expect(deleteResponse.message).toBe('site deleted')

      // Verify site is deleted
      const siteResponse = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test' },
        { server: true },
      )
      expect(siteResponse.status).toBe('error')
      expect(siteResponse.message).toContain('Site not found')

      // Verify pages are deleted
      const pageResponse = await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'retrieve',
          where: [{ cardId }],
          siteId,
          orgId,
          caller: 'test',
          scope: 'publish',
        },
        { server: true },
      )
      expect(pageResponse.status).toBe('error')
      expect(pageResponse.data).toHaveLength(0)
    })

    it('should handle deletion of site with no pages', async () => {
      // Create a site without pages
      const emptyFields = createSiteFields('Empty Site For Deletion')
      const emptyResponse = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'create', fields: emptyFields, orgId, userId, caller: 'test' },
        { server: true },
      )
      const emptySiteId = emptyResponse.data?.siteId as string

      // Delete the empty site
      const deleteResponse = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'delete', where: { siteId: emptySiteId }, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(deleteResponse.status).toBe('success')
      expect(deleteResponse.message).toBe('site deleted')
    })

    it('should fail gracefully when deleting non-existent site', async () => {
      const nonExistentSiteId = objectId({ prefix: 'sit' })
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'delete', where: { siteId: nonExistentSiteId }, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('error')
      expect(response.message).toContain('site not found')
    })

    it('should delete all associated resources', async () => {
      // First verify site has associated resources
      const initialSite = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test' },
        { server: true },
      )
      expect(initialSite.data?.pages?.length).toBeGreaterThan(0)

      // Delete the site
      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'delete', where: { siteId }, orgId, userId, caller: 'test' },
        { server: true },
      )

      // Check that pages were deleted using direct DB query
      const remainingPages = await testUtils.fictionDb.client()
        .select('*')
        .from('fiction_site_pages')
        .where({ site_id: siteId })

      expect(remainingPages).toHaveLength(0)
    })
  })

  describe('site creation', () => {
    it('should create a new site', async () => {
      const fields = createSiteFields('Test Site')
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.title).toBe('Test Site')
      expect(response.data?.siteId).toBeTruthy()
      expect(response.data?.orgId).toBe(orgId)
    })

    it('should create a site with default pages', async () => {
      const fields = createSiteFields('Site with Pages')
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.pages).toBeTruthy()
      expect(response.data?.pages?.length).toBeGreaterThan(0)
    })
  })

  describe('site retrieval', () => {
    let siteId: string
    let testingDomain: string

    beforeEach(async () => {
      testingDomain = `test-${objectId({ prefix: 'dom' })}.fiction.com`

      // Create test site with pages
      const fields = {
        ...createSiteFields('Retrieval Test Site'),
        pages: [
          {
            cardId: objectId({ prefix: 'crd' }),
            templateId: 'pageWrap',
            title: 'Test Page',
            slug: 'test-page',
          },
        ],
        customDomains: [
          {
            hostname: testingDomain,
            isPrimary: true,
          },
        ],
      }

      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'create', fields, orgId, userId, caller: 'test', isPublishingDomains: true },
        { server: true },
      )
      siteId = response.data?.siteId as string
    })

    describe('basic retrieval', () => {
      it('should retrieve a complete site by siteId', async () => {
        const response = await testUtils.fictionSites.queries.ManageSite.serve(
          { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test' },
          { server: true },
        )

        expect(response.status).toBe('success')
        expect(response.data).toMatchObject({
          siteId,
          title: 'Retrieval Test Site',
          orgId,
          org,
          pages: expect.arrayContaining([
            expect.objectContaining({
              title: 'Test Page',
              slug: 'test-page',
            }),
          ]),
          customDomains: expect.arrayContaining([
            expect.objectContaining({
              hostname: testingDomain,
              isPrimary: true,
            }),
          ]),
        })
      })

      it('should return an error for non-existent site', async () => {
        const nonExistentSiteId = objectId({ prefix: 'sit' })
        const response = await testUtils.fictionSites.queries.ManageSite.serve(
          { _action: 'retrieve', where: { siteId: nonExistentSiteId }, orgId, userId, caller: 'test' },
          { server: true },
        )

        expect(response.status).toBe('error')
        expect(response.message).toContain('Site not found')
      })

      it('should retrieve site by custom domain hostname', async () => {
        const response = await testUtils.fictionSites.queries.ManageSite.serve(
          { _action: 'retrieve', where: { hostname: testingDomain }, orgId, caller: 'test' },
          { server: true },
        )

        expect(response.status).toBe('success')
        expect(response.data?.siteId).toBe(siteId)
      })
    })

    describe('draft handling', () => {
      beforeEach(async () => {
        // Create drafts for site and page
        await testUtils.fictionSites.queries.ManageSite.serve(
          {
            _action: 'saveDraft',
            where: { siteId },
            fields: {
              title: 'Draft Site Title',
              userConfig: {
                seo: { description: 'Draft description' },
              },
            },
            orgId,
            userId,
            caller: 'test',
          },
          { server: true },
        )
      })

      it('should return published version by default', async () => {
        const response = await testUtils.fictionSites.queries.ManageSite.serve(
          { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test' },
          { server: true },
        )

        expect(response.status).toBe('success')
        expect(response.data?.title).toBe('Retrieval Test Site')
        expect(response.data?.draft).toBeUndefined()
      })

      it('should return draft version when requested', async () => {
        const response = await testUtils.fictionSites.queries.ManageSite.serve(
          { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
          { server: true },
        )

        expect(response.status).toBe('success')
        expect(response.data?.title).toBe('Draft Site Title')
        expect(response.data?.userConfig.site?.seo?.description).toBe('Draft description')
        expect(response.data?.draft).toBeUndefined() // Draft content should be merged but draft field removed
      })
    })

    describe('organization details', () => {
      it('should include complete organization data', async () => {
        const response = await testUtils.fictionSites.queries.ManageSite.serve(
          { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test' },
          { server: true },
        )

        expect(response.status).toBe('success')
        expect(response.data?.org).toEqual(org)
        expect(response.data?.org).toEqual(expect.objectContaining({
          orgId,
          orgName: expect.any(String),
          orgEmail: expect.any(String),
        }))
      })

      it('should handle nonexistent organization gracefully', async () => {
        // Create site with non-existent orgId
        const nonExistentOrgId = objectId({ prefix: 'org' })
        const fields = createSiteFields('No Org Site')

        const createResponse = await testUtils.fictionSites.queries.ManageSite.serve(
          { _action: 'create', fields, orgId: nonExistentOrgId, userId, caller: 'test' },
          { server: true, expectError: true },
        )

        expect(createResponse.status).toBe('error')
      })
    })

    describe('pages and domains', () => {
      it('should return all pages with site', async () => {
        const response = await testUtils.fictionSites.queries.ManageSite.serve(
          { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test' },
          { server: true },
        )

        expect(response.status).toBe('success')
        expect(response.data?.pages).toHaveLength(3)
        expect(response.data?.pages.find(p => p.slug === 'test-page')).toMatchObject({
          title: 'Test Page',
          slug: 'test-page',
          templateId: 'pageWrap',
        })
      })

      it('should return all domains with site', async () => {
        const response = await testUtils.fictionSites.queries.ManageSite.serve(
          { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test' },
          { server: true },
        )

        expect(response.status).toBe('success')
        expect(response.data?.customDomains).toHaveLength(1)
        expect(response.data?.customDomains[0]).toMatchObject({
          hostname: testingDomain,
          isPrimary: true,
        })
      })
    })
  })

  describe('site update', () => {
    let siteId: string

    beforeEach(async () => {
      const fields = createSiteFields('Update Test Site')
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )
      siteId = response.data?.siteId as string
    })

    it('should update an existing site', async () => {
      const updateFields = { title: 'Updated Site Title' }
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'update', where: { siteId }, fields: updateFields, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.title).toBe('Updated Site Title')
    })

    it('should update site pages', async () => {
      const newPage = {
        templateId: 'pageWrap',
        title: 'New Page',
        slug: 'new-page',
      }
      const updateFields = { pages: [newPage] }
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'update', where: { siteId }, fields: updateFields, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.pages).toContainEqual(expect.objectContaining(newPage))
    })
  })

  describe('site draft handling', () => {
    let siteId: string
    let cardId: string
    let cardId2: string

    beforeEach(async () => {
      const fields = createSiteFields('Draft Test Site')
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )
      siteId = response.data?.siteId as string

      cardId = objectId({ prefix: 'card' })
      cardId2 = objectId({ prefix: 'card' })

      // Add a published page to the site
      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'upsert',
          siteId,
          fields: [
            { cardId, templateId: 'pageWrap', title: 'Published Page', slug: 'published-page' },
            { cardId: cardId2, templateId: 'pageWrap', title: 'Published Page 2', slug: 'published-page-2' },
          ],
          orgId,
          userId,
          caller: 'test',
          scope: 'publish',
        },
        { server: true },
      )
    })

    it('should save a draft for an existing site', async () => {
      const draftFields: Partial<TableSiteConfig> = { title: 'Draft Site Title', userConfig: { draftKey: 'draftValue' } }
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'saveDraft', where: { siteId }, fields: draftFields, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.title).toBe('Draft Site Title')
      expect(response.data?.userConfig?.draftKey).toBe('draftValue')
    })

    it('should retrieve a site with merged draft data when scope is draft', async () => {
      const draftFields = { title: 'Draft Site Title', userConfig: { draftKey: 'draftValue' } }
      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'saveDraft', where: { siteId }, fields: draftFields, orgId, userId, caller: 'test' },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.title).toBe('Draft Site Title')
      expect(response.data?.userConfig?.draftKey).toBe('draftValue')
    })

    it('should save and retrieve draft pages', async () => {
      const draftPage = { cardId, templateId: 'pageWrap', title: 'Draft Page', slug: 'draft-page' }
      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [draftPage],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.pages).toContainEqual(expect.objectContaining(draftPage))
    })

    it('should not return draft pages when retrieving with publish scope', async () => {
      const draftPage = { cardId, templateId: 'pageWrap', title: 'Draft Page', slug: 'draft-page' }
      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [draftPage],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'publish' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.pages).not.toContainEqual(expect.objectContaining(draftPage))
      expect(response.data?.pages).toContainEqual(expect.objectContaining({ title: 'Published Page', slug: 'published-page' }))
    })

    it('should merge site and page drafts when retrieving with draft scope', async () => {
      const siteDraft = { title: 'Draft Site Title' }
      const pageDraft = { cardId, templateId: 'pageWrap', title: 'Draft Page', slug: 'draft-page' }

      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'saveDraft', where: { siteId }, fields: siteDraft, orgId, userId, caller: 'test' },
        { server: true },
      )

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [pageDraft],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.title).toBe('Draft Site Title')
      // expect(response.data?.pages).toContainEqual(expect.objectContaining(pageDraft))
      expect(response.data?.pages.find(p => p.title === 'Draft Page')).toBeTruthy()
    })

    it('should maintain separate drafts for multiple pages', async () => {
      const draftPage1 = { cardId, templateId: 'pageWrap', title: 'Draft Page 1', slug: 'draft-page-1' }
      const draftPage2 = { cardId: cardId2, templateId: 'pageWrap', title: 'Draft Page 2', slug: 'draft-page-2' }

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [draftPage1, draftPage2],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.pages.find(p => p.title === 'Draft Page 1')).toBeTruthy()
      expect(response.data?.pages.find(p => p.title === 'Draft Page 2')).toBeTruthy()
    })

    it('should update existing page draft when saving a new draft', async () => {
      const initialDraft = { cardId, templateId: 'pageWrap', title: 'Initial Draft', slug: 'draft-page' }
      const updatedDraft = { cardId, templateId: 'pageWrap', title: 'Updated Draft', slug: 'draft-page' }

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [initialDraft],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [updatedDraft],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(response.status).toBe('success')
      expect(response.data?.pages).toContainEqual(expect.objectContaining(updatedDraft))
      expect(response.data?.pages).not.toContainEqual(expect.objectContaining(initialDraft))
    })
  })

  describe('site draft reversion', () => {
    let siteId: string
    let cardId: string

    beforeEach(async () => {
      const fields = createSiteFields('Draft Reversion Test Site')
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )
      siteId = response.data?.siteId as string
      cardId = objectId({ prefix: 'card' })

      // Add a published page to the site
      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'upsert',
          siteId,
          fields: [{ cardId, templateId: 'pageWrap', title: 'Published Page', slug: 'published-page' }],
          orgId,
          userId,
          caller: 'test',
          scope: 'publish',
        },
        { server: true },
      )
    })

    it('should revert site and page drafts', async () => {
      // Create drafts for site and page
      const siteDraft = { title: 'Draft Site Title' }
      const pageDraft = { cardId, templateId: 'pageWrap', title: 'Draft Page Title', slug: 'published-page' }

      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'saveDraft', where: { siteId }, fields: siteDraft, orgId, userId, caller: 'test' },
        { server: true },
      )

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [pageDraft],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      // Revert drafts
      const revertResponse = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'revertDraft', where: { siteId }, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(revertResponse.status).toBe('success')
      expect(revertResponse.message).toMatchInlineSnapshot(`"Site reverted successfully"`)
      expect(revertResponse.message).toBeTruthy()

      // Verify site draft is reverted
      const siteResponse = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(siteResponse.data?.title).not.toBe('Draft Site Title')

      // Verify page draft is reverted
      const pageResponse = await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'retrieve',
          where: [{ cardId }],
          siteId,
          orgId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      expect(pageResponse.data?.[0]?.title).toBe('Published Page')
    })

    it('should handle revert when no drafts exist', async () => {
      const revertResponse = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'revertDraft', where: { siteId }, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(revertResponse.status).toBe('success')
      expect(revertResponse.message).toMatchInlineSnapshot(`"Site reverted successfully"`)
      expect(revertResponse.message).toBeTruthy()
    })

    it('should throw an error when reverting non-existent site', async () => {
      const nonExistentSiteId = objectId({ prefix: 'sit' })
      const r = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'revertDraft', where: { siteId: nonExistentSiteId }, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(r?.status).toBe('error')
      expect(r?.message).toContain('Site not found')
    })
  })

  describe('draft clearing on publish', () => {
    let siteId: string
    let cardId: string

    beforeEach(async () => {
      const fields = createSiteFields('Draft Clearing Test Site')
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )
      siteId = response.data?.siteId as string
      cardId = objectId({ prefix: 'card' })

      // Add a published page to the site
      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'upsert',
          siteId,
          fields: [{ cardId, templateId: 'pageWrap', title: 'Published Page', slug: 'published-page' }],
          orgId,
          userId,
          caller: 'test',
          scope: 'publish',
        },
        { server: true },
      )
    })

    it('should clear site and page drafts when publishing', async () => {
      // Create drafts for site and page
      const siteDraft = { title: 'Draft Site Title' }
      const pageDraft = { cardId, templateId: 'pageWrap', title: 'Draft Page Title', slug: 'published-page' }

      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'saveDraft', where: { siteId }, fields: siteDraft, orgId, userId, caller: 'test' },
        { server: true },
      )

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [pageDraft],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      // Publish the site
      const publishResponse = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'update', where: { siteId }, fields: { title: 'Published Site Title' }, orgId, userId, caller: 'test', scope: 'publish' },
        { server: true },
      )

      expect(publishResponse.status).toBe('success')
      expect(publishResponse.data?.title).toBe('Published Site Title')

      // Verify site draft is cleared
      const siteResponse = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(siteResponse.data?.title).toBe('Published Site Title')
      expect(siteResponse.data?.draft).toBeUndefined()

      // Verify page draft is cleared
      const pageResponse = await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'retrieve',
          where: [{ cardId }],
          siteId,
          orgId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      expect(pageResponse.data?.[0]?.title).toBe('Published Page')
      expect(pageResponse.data?.[0]?.draft).toBeUndefined()
    })

    it('should not clear drafts when updating in draft mode', async () => {
      // Create drafts for site and page
      const siteDraft = { title: 'Draft Site Title' }
      const pageDraft = { cardId, templateId: 'pageWrap', title: 'Draft Page Title', slug: 'published-page' }

      await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'saveDraft', where: { siteId }, fields: siteDraft, orgId, userId, caller: 'test' },
        { server: true },
      )

      await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'saveDraft',
          siteId,
          fields: [pageDraft],
          orgId,
          userId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      // Update the site in draft mode
      const updateResponse = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'update', where: { siteId }, fields: { title: 'Updated Draft Title' }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(updateResponse.status).toBe('success')

      // Verify site draft is not cleared
      const siteResponse = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'retrieve', where: { siteId }, orgId, userId, caller: 'test', scope: 'draft' },
        { server: true },
      )

      expect(siteResponse.data?.title).toBe('Updated Draft Title')
      expect(siteResponse.data?.draft).toBeFalsy()

      // Verify page draft is not cleared
      const pageResponse = await testUtils.fictionSites.queries.ManagePage.serve(
        {
          _action: 'retrieve',
          where: [{ cardId }],
          siteId,
          orgId,
          caller: 'test',
          scope: 'draft',
        },
        { server: true },
      )

      expect(pageResponse.data?.[0]?.title).toBe('Draft Page Title')
      expect(pageResponse.data?.[0]?.draft).toBeFalsy()
    })
  })

  describe('edge cases and error handling', () => {
    it('should have correct error message for invalid theme', async () => {
      const fields = { ...createSiteFields('Invalid Theme Site'), themeId: 'non-existent-theme' }
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'create', fields, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('error')
      expect(response.message).toContain('theme not found')
    })

    it('should have correct error message for non-existent site update', async () => {
      const nonExistentSiteId = objectId({ prefix: 'sit' })
      const updateFields = { title: 'Updated Non-existent Site' }
      const response = await testUtils.fictionSites.queries.ManageSite.serve(
        { _action: 'update', where: { siteId: nonExistentSiteId }, fields: updateFields, orgId, userId, caller: 'test' },
        { server: true },
      )

      expect(response.status).toBe('error')
      expect(response.message).toContain('site not found')
    })
  })
})
