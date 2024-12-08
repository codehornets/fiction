import { isCi } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, it } from 'vitest'

describe('admin site pages', async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: false, slowMo: 1000 })

  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(async () => kit.close())

  it('page and card ui', { timeout: 80000, retry: isCi() ? 3 : 0 }, async () => {
    const initialViewId = 'edit-site'

    const logoText = 'Hello World from Test'
    await kit.performActions({
      caller: 'adminSitePages',
      path: `/app/${initialViewId}?theme=minimal`,
      actions: [
        { type: 'visible', selector: `[data-view-id="${initialViewId}"]` },
        { type: 'frameInteraction', frameSelector: `#site-builder-iframe`, frameActions: [
          { type: 'click', selector: `[data-card-template-id="pageNav"]` },
        ] },
        { type: 'click', selector: `[data-test-id="radio-button-typography"]` },
        { type: 'fill', selector: `[data-test-id="typography.label"] input`, text: logoText },
        { type: 'click', selector: `[data-test-id="typography.font"] [data-test-id="select-custom-dropdown-toggle"]` },
        { type: 'click', selector: `[data-test-id="typography.font"] #listbox-item-3` },
        { type: 'click', selector: `[data-test-id="radio-button-media"]` },
        { type: 'click', selector: `[data-test-id="media-select-button"]` },
        { type: 'click', selector: `[data-test-id="library-modal"] [data-test-id="library-apply-changes"]` },
        { type: 'click', selector: `[data-test-id="radio-button-typography"]` },
        { type: 'frameInteraction', frameSelector: `#site-builder-iframe`, frameActions: [
          { type: 'hasText', selector: `[data-test-id="page-nav-logo"]`, text: logoText },
        ] },
      ],
    })
  })
})
