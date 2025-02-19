import { isCi, shortId } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, it } from 'vitest'

describe('admin site editing', async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: false, slowMo: 0 })

  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(async () => kit.close())

  it('site editing', { timeout: 80000, retry: isCi() ? 3 : 0 }, async () => {
    const _initialViewId = 'edit-site'
    const _slugId = shortId()
    await kit.performActions({
      caller: 'adminSiteEditing',
      path: `/app`,
      actions: [
        { type: 'click', selector: `[data-test-id="dashboard-nav-sites"]` },
        { type: 'click', selector: `[data-test-id="createSite"]` },
        { type: 'fill', selector: `[data-test-id="siteName"] input`, text: 'Test Site' },
        { type: 'click', selector: `[data-test-id="createSiteModal"] [data-test-el="step-submit"]` },
        { type: 'click', selector: `[data-test-id="createSiteModal"] [data-test-id="theme-prestige"]` },
        { type: 'click', selector: `[data-test-id="createSiteModal"] [data-test-el="step-submit"]` },
        { type: 'visible', selector: `[data-view-id="edit-site"]` },
        { type: 'frameInteraction', frameSelector: `#site-builder-iframe`, frameActions: [
          { type: 'click', selector: `[data-card-template-id="cardOverlaySliderV1"]` },
        ] },
        { type: 'click', selector: `[data-option-path="autoSlide"] button` },
        { type: 'click', selector: `[data-option-path="items"] [data-handle-index="0"] [data-test-id="handle"]` },
        { type: 'fill', selector: `[data-option-path="items"] [data-handle-index="0"] [data-option-path="title"] input`, text: 'hello' },
        { type: 'fill', selector: `[data-option-path="items"] [data-handle-index="0"] [data-option-path="subTitle"] input`, text: 'world' },
        { type: 'frameInteraction', frameSelector: `#site-builder-iframe`, frameActions: [
          { type: 'hasText', selector: `[data-card-type="cardOverlaySliderV1"] [data-option-path="items.0.title"]`, text: 'hello' },
          { type: 'hasText', selector: `[data-card-type="cardOverlaySliderV1"] [data-option-path="items.0.subTitle"]`, text: 'world' },
        ] },
        { type: 'click', selector: `[data-test-id="publishChangesButton"]` },

        { type: 'frameInteraction', frameSelector: `#site-builder-iframe`, frameActions: [
          { type: 'fill', selector: `[data-card-type="cardOverlaySliderV1"] [data-option-path="items.0.title"]`, text: 'change' },
          { type: 'fill', selector: `[data-card-type="cardOverlaySliderV1"] [data-option-path="items.0.subTitle"]`, text: 'the text' },
        ] },

        { type: 'click', selector: `[data-test-id="draft-control-dropdown"] button` },
        { type: 'click', selector: `[data-test-id="draft-control-dropdown"] [data-test-id="reset-to-published"]` },
        { type: 'frameInteraction', frameSelector: `#site-builder-iframe`, frameActions: [
          { type: 'click', selector: `[data-test-id="nav-dot-0"]` },
          { type: 'hasText', selector: `[data-card-type="cardOverlaySliderV1"] [data-option-path="items.0.title"]`, text: 'hello' },
          { type: 'hasText', selector: `[data-card-type="cardOverlaySliderV1"] [data-option-path="items.0.subTitle"]`, text: 'world' },
        ] },
        { type: 'click', selector: `[data-test-id="tool-button-managePages"]` },
        // { type: 'click', selector: `[data-test-id="addPage"]` },
        // { type: 'fill', selector: `[data-option-path="title"] input`, texxt: `New Page ${slugId}` },
        // { type: 'click', selector: `[data-test-id="requestCreateNewPage"]` },
        // { type: 'visible', selector: `[data-test-id="page-new-page-${slugId}"]` },
        // { type: 'click', selector: `[data-test-id="createSite"]` },
        // { type: 'fill', selector: `[data-test-id="siteName"] input`, text: 'Test Site' },
        // { type: 'click', selector: `[data-test-id="createSiteModal"] .xbutton` },
        // { type: 'click', selector: `[data-test-id="createSiteModal"] [data-test-index="0"]` },
        // { type: 'click', selector: `[data-test-id="createSiteModal"] .xbutton` },
        // { type: 'visible', selector: `[data-view-id="edit-site"]` },
      ],
    })
  })
})
