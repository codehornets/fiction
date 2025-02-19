import { isCi } from '@fiction/core'
import { describe, it } from 'vitest'
import { createPostsUiTestingKit } from './postTestUtils'

describe('postEditing', async () => {
  it('creates post and allows basic editing', { retry: isCi() ? 3 : 0, timeout: 100000 }, async () => {
    const kit = await createPostsUiTestingKit({ headless: false, slowMo: 0, initUser: true })

    await kit.performActions({
      caller: 'postEditing',
      path: '/app',
      actions: [
        { type: 'click', selector: '[data-test-id="dashboard-nav-posts"]' },
        { type: 'click', selector: '[data-test-id="createPostButton"]' },
        { type: 'fill', selector: '[data-test-id="postTitleInput"] input', text: 'Test Post' },
        { type: 'click', selector: '[data-test-id="step-button-postTitle"]' },
        { type: 'hasText', selector: '[data-test-id="post-editor-title"]', text: 'Test Post' },
        { type: 'hasValue', selector: '[data-option-path="title"] input', text: 'Test Post' },
        { type: 'fill', selector: '[data-test-id="post-editor-sub-title"]', text: 'hello world' },
        { type: 'hasValue', selector: '[data-option-path="subTitle"] input', text: 'hello world' },
        { type: 'fill', selector: '[data-test-id="prose-editor-content"] .tiptap', text: 'jack and jill' },
        { type: 'click', selector: '[data-test-id="publish-button"]' },
        { type: 'fill', selector: '[data-test-id="prose-editor-content"] .tiptap', text: ' went up the hill', wait: 3000 },
        { type: 'click', selector: `[data-test-id="draft-control-dropdown"] button`, wait: 3000 },
        { type: 'click', selector: `[data-test-id="draft-control-dropdown"] [data-test-id="reset-to-published"]` },
        { type: 'hasText', selector: '[data-test-id="prose-editor-content"] .tiptap', text: 'jack and jill' },
        { type: 'notHasText', selector: '[data-test-id="prose-editor-content"] .tiptap', text: 'went up the hill' },
      ],
    })

    kit?.close()
  })
})
