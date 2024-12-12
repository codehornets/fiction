/**
 * @vitest-environment happy-dom
 */
import { afterAll, describe } from 'vitest'
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
