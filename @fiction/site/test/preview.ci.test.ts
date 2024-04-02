/**
 * @vitest-environment happy-dom
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { shortId, waitFor } from '@fiction/core'
import { snapshotHtml } from '@fiction/core/utils/snapshot'
import { requestManageSite } from '../load'
import { createSiteTestUtils } from './siteTestUtils'

describe('sitePreview', async () => {
  const testUtils = createSiteTestUtils()
  await testUtils.init()

  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    siteMode: 'standard',
  } as const

  const r = testUtils.fictionRouter

  const { init: _, initialized: __, close: ___, ...service } = testUtils
  const mountEl = document.createElement('div')
  mountEl.id = 'app'
  document.body.appendChild(mountEl)
  const entry = await testUtils.fictionApp.mountApp({ selector: '#app', service })

  beforeAll(async () => { })
  afterAll(async () => {
    entry.app.unmount()
  })

  it('should load siteId preview if siteId is in URL', async (ctx) => {
    if (!testUtils)
      return

    const cur = () => r.current.value
    const previewPath = () => testUtils.fictionSites.getPreviewPath({ fictionAdmin: testUtils.fictionAdmin }).value

    const orgBase = testUtils.fictionAdmin.adminBaseOrgPath.value
    const siteEdit = `${orgBase}/siteEdit`

    await r.push(`/admin/preview/theme/minimal`, { caller: ctx.task.name })

    expect(cur().params).toMatchInlineSnapshot(`
      {
        "itemId": "",
        "selectorId": "minimal",
        "selectorType": "theme",
        "viewId": "",
      }
    `)

    await r.push(`${siteEdit}?siteId=554433`, { caller: ctx.task.name })

    expect(cur().query).toMatchInlineSnapshot(`
      {
        "siteId": "554433",
      }
    `)

    expect(previewPath()).toMatchInlineSnapshot(`"/admin/preview/site/554433"`)

    await r.push(`${siteEdit}?themeId=minimal`, { caller: ctx.task.name })

    expect(cur().query).toMatchInlineSnapshot(`
      {
        "themeId": "minimal",
      }
    `)

    expect(previewPath()).toMatchInlineSnapshot(`"/admin/preview/theme/minimal"`)

    await r.push(`${siteEdit}?subDomain=test-sub-domain`, { caller: ctx.task.name })

    expect(cur().query).toMatchInlineSnapshot(`
      {
        "subDomain": "test-sub-domain",
      }
    `)

    expect(previewPath()).toMatchInlineSnapshot(`"/admin/preview/domain/test-sub-domain"`)
  })

  it('mounts correctly', async (ctx) => {
    await r.push(`/admin/preview/theme/test`, { caller: ctx.task.name })

    await waitFor(100)

    const html = await snapshotHtml(mountEl.innerHTML, { hideTags: ['svg'], maskIds: false })

    expect(html).toContain('data-theme-id="test"')
  })

  it('loads theme correctly', async (ctx) => {
    const subDomain = shortId()
    const result = await requestManageSite(
      {
        _action: 'create',
        fields: { title: 'test', themeId: 'minimal', subDomain },
        caller: ctx.task.name,
        ...common,
      },
    )

    const site = result?.site

    expect(r.current.value.name).toMatchInlineSnapshot(`"sitePreview"`)

    await r.push(`/admin/preview/site/${site?.siteId}`, { caller: ctx.task.name })

    await waitFor(300)

    const html = await snapshotHtml(mountEl.innerHTML, { hideTags: ['svg'], maskIds: false })

    expect(html).toContain('data-theme-id="minimal"')
    expect(html).toContain(`data-site-id="${site?.siteId}"`)

    await r.push(`/admin/preview/domain/${site?.subDomain.value}`, { caller: ctx.task.name })

    await waitFor(300)

    const html2 = await snapshotHtml(mountEl.innerHTML, { hideTags: ['svg'], maskIds: false })
    expect(html2).toContain('data-theme-id="minimal"')
    expect(html2).toContain(`data-site-id="${site?.siteId}"`)
    expect(html2).toContain(`data-sub-domain="${site?.subDomain.value}"`)
  }, 10000)
})
