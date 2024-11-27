/**
 * @vitest-environment happy-dom
 */
import { findValueByKey } from '@fiction/core'
import { afterAll, describe, expect, it } from 'vitest'
import { theme } from './test-theme'
import { createSiteTestUtils } from './testUtils'

describe('themeCreation', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await testUtils.createSite()
  const r = await testUtils.init()
  const userId = r?.user?.userId ?? ''
  const orgId = r?.user?.orgs?.[0]?.orgId ?? ''

  afterAll(async () => {
    await testUtils.close()
  })
})
