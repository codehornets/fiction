import type { BrandGuide } from '../guideSchema'
import type { TableBrand } from '../schema'
import { abort } from '@fiction/core'
import { createTestUser } from '@fiction/core/test-utils'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { describe, expect, it } from 'vitest'
import { FictionBrand } from '..'

describe('brand guide endpoint', async () => {
  const testUtils = await createSiteTestUtils()
  const fictionBrand = new FictionBrand(testUtils)
  const initialized = await testUtils.init()

  const orgId = initialized.orgId
  const userId = initialized.user.userId

  // Create additional test users
  const { user: user2 } = await createTestUser(testUtils.fictionUser)
  const { user: user3 } = await createTestUser(testUtils.fictionUser)

  if (!orgId || !userId || !user2 || !user3) {
    throw abort('missing orgId or user data')
  }

  const sampleBrandGuide: BrandGuide = {
    personality: {
      archetype: 'creator' as const,
      traits: 'innovative',
      voice: {
        tone: 'Friendly but professional',
        guidelines: 'Use clear, simple language. Be direct but warm.',
      },
    },
    purpose: {
      mission: 'Help creators build sustainable businesses',
      vision: 'Empower 1000 creators to achieve financial freedom',
      positioning: 'Practical, experience-based guidance for creators',
      values: [{
        title: 'Authenticity',
        description: 'Being genuine in all interactions',
        inPractice: 'Sharing both successes and failures openly',
      }],
    },
    communities: [{
      name: 'Early-stage creators',
      interests: 'personal branding',
      challenges: 'finding their voice',
      content: 'tutorials',
    }],
    pillars: [{
      topic: 'Brand Building',
      description: 'Developing a strong personal brand',
      examples: 'Brand voice workshop',
      audiences: 'creators',
    }],
    futurePacing: {
      declaration: 'I am the go-to resource for creator branding',
      nextSteps: [{
        statement: 'Regular content production',
        action: 'Launch weekly newsletter',
        deadline: '2024-12-01',
      }],
    },
    visuals: {
      primaryColor: 'blue',
      typography: {
        title: 'Montserrat',
        body: 'Inter',
      },
      imageStyle: 'Clean, minimal with bold accent colors',
    },
    systemMessage: 'Maintain friendly, expert tone while prioritizing actionable advice',
    version: '1.0.0',
  }

  it('bulk create brand guides', async () => {
    const guides: TableBrand[] = [
      {
        title: 'Brand Guide 1',
        description: 'First test guide',
        guide: { ...sampleBrandGuide },
      },
      {
        title: 'Brand Guide 2',
        description: 'Second test guide',
        guide: {
          ...sampleBrandGuide,
          personality: { ...sampleBrandGuide.personality, archetype: 'sage' },
        },
      },
    ] as const

    const createResults = await Promise.all(guides.map(guide =>
      fictionBrand.queries.ManageBrandGuide.serve({
        _action: 'create',
        fields: guide,
        orgId,
      }, { server: true }),
    ))

    createResults.forEach((r) => {
      expect(r.status).toBe('success')
      expect(r.data?.length).toBe(1)
      expect(r.data?.[0].guide?.personality).toBeDefined()
      expect(r.data?.[0].guide?.purpose).toBeDefined()
    })

    const brandIds = createResults.map(r => r.data?.[0].brandId).filter(Boolean) as string[]
    expect(brandIds.length).toBe(2)

    await Promise.all(brandIds.map(brandId =>
      fictionBrand.queries.ManageBrandGuide.serve({
        _action: 'delete',
        where: { brandId },
        orgId,
      }, { server: true }),
    ))
  })

  it('create single brand guide', async () => {
    const r = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'create',
      fields: {
        title: 'Test Guide',
        description: 'Test description',
        guide: sampleBrandGuide,
      },
      orgId,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].guide?.personality?.archetype).toBe('creator')
    expect(r.data?.[0].guide?.purpose?.mission).toBeDefined()
    expect(r.data?.[0].guide?.futurePacing?.declaration).toBeDefined()

    const r2 = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'create',
      fields: {
        title: 'Second Guide',
        description: 'Another test guide',
        orgId,
        guide: {
          ...sampleBrandGuide,
          personality: { ...sampleBrandGuide.personality, archetype: 'hero' },
        },
      },
      orgId,
    }, { server: true })

    expect(r2.status).toBe('success')
  })

  it('update brand guide', async () => {
    const list = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'list',
      orgId,
    }, { server: true })

    const brandId = list.data?.[0].brandId

    const r = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'update',
      orgId,
      where: { brandId },
      fields: {
        title: 'Updated Title',
        description: 'Updated description',
        guide: {
          ...sampleBrandGuide,
          personality: {
            ...sampleBrandGuide?.personality,
            traits: 'bold',
          },
          futurePacing: {
            ...sampleBrandGuide?.futurePacing,
            declaration: 'I am the leading voice in creator education',
          },
        },
      },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].guide?.personality?.traits).toContain('bold')
    expect(r.data?.[0].guide?.futurePacing?.declaration).toContain('leading voice')
  })

  it('handles invalid requests', async () => {
    const invalidCreate = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'create',
      fields: {
        orgId,
        guide: {
          ...sampleBrandGuide,
          personality: {
            ...sampleBrandGuide?.personality,
            // @ts-expect-error test
            archetype: 'InvalidArchetype', // Invalid archetype
          },
        },
      },
      orgId,
    }, { server: true })

    expect(invalidCreate.status).toBe('error')

    const invalidRetrieve = await fictionBrand.queries.ManageBrandGuide.serve({
      _action: 'retrieve',
      where: { brandId: 'non-existent-id' },
      orgId,
    }, { server: true })

    expect(invalidRetrieve.status).toBe('error')
    expect(invalidRetrieve.message).toBe('Brand guide not found')
  })
})
