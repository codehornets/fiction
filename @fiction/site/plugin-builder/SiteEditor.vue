<script lang="ts" setup>
import type { FictionApp, FictionRouter } from '@fiction/core'
import type { FictionSites } from '..'
import type { Card } from '../card'
import type { Site } from '../site'
import ElSavingSignal from '@fiction/admin/el/ElSavingSignal.vue'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import CardButton from '@fiction/cards/CardButton.vue'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { onResetUi, resetUi, useService, vue } from '@fiction/core'
import XText from '@fiction/ui/common/XText.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import El404 from '@fiction/ui/page/El404.vue'
import { getMountContext, loadSite } from '../load'
import { activeSiteDisplayUrl } from '../utils/site'
import SiteEditorFrame from './SiteEditorFrame.vue'
import { adminEditorController } from './tools/tools'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionSites: FictionSites, fictionRouterSites: FictionRouter, fictionAppSites: FictionApp }>()
const { fictionRouter, fictionSites, fictionRouterSites, fictionEnv } = service

const loading = vue.ref(true)
const sending = vue.ref('')
const editing = vue.ref(false)

const site = vue.shallowRef<Site | undefined>()

async function load() {
  loading.value = true

  try {
    const q = fictionRouter.query.value as Record<string, string>
    const { siteId = q.site, themeId = q.theme, cardId = q.card } = q

    if (!siteId && !themeId && !cardId)
      throw new Error('No site, theme, or card id provided')

    await fictionRouterSites.create({ noBrowserNav: true, caller: 'SiteEditor' })

    const mountContext = getMountContext({ queryVars: { siteId, themeId, cardId }, siteMode: 'designer' })

    site.value = await loadSite({
      fictionSites,
      siteRouter: fictionRouterSites,
      mountContext,
    })

    if (!site.value)
      throw new Error('No site found')

    site.value.frame.init({ caller: 'SiteEditor' })

    site.value.events.on('setActiveCard', () => {
      adminEditorController.useTool({ toolId: 'editCard' })
    })

    fictionEnv.events.on('resetUi', (event) => {
      const { scope, trigger } = event.detail
      if (scope === 'iframe' && trigger !== 'routeChange')
        adminEditorController.useTool({ toolId: '' })
    })
  }
  catch (error) {
    console.error('Error loading site', error)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(async () => {
  await load()
})

onResetUi(() => {
  editing.value = false
})

async function save() {
  if (!site.value)
    throw new Error('No site to save')

  sending.value = 'save'

  // make sure any blur events are triggered
  resetUi({ scope: 'all', cause: 'saveSite', trigger: 'manualReset' })

  await site.value.save({ minTime: 500, scope: 'publish' })
  sending.value = ''
}

async function resetToPublished() {
  if (!site.value)
    throw new Error('No site to revert')
  const s = site.value
  const siteId = s.siteId

  const r = await s.settings.fictionSites.requests.ManageSite.projectRequest({
    _action: 'revertDraft',
    where: { siteId },
    caller: 'siteEditor',
  })

  if (r.status === 'success') {
    await site.value.update({ ...r.data }, { noSave: true, caller: 'resetToPublished' })
  }
}
</script>

<template>
  <div
    class="h-full w-full"
    :data-site-router-path="fictionRouterSites?.params.value.viewId ?? '[empty]'"
    :data-view-id="site?.currentViewId.value ?? '[empty]'"
    :data-page-id="site?.activePageId.value ?? '[empty]'"
    :data-theme-id="site?.themeId.value ?? '[empty]'"
    :data-active-pathname="site?.currentPath.value ?? '[empty]'"
  >
    <div v-if="loading" class="">
      <div class="text-theme-300 dark:text-theme-600 flex justify-center pt-32">
        <ElSpinner class="h-12 w-12" />
      </div>
    </div>

    <template v-else>
      <ViewEditor :tool-props="{ site }" :controller="adminEditorController" :card>
        <template #headerLeft>
          <div>
            <CardButton :card theme="primary" design="outline" href="/sites" icon="i-tabler-arrow-left">
              Back
            </CardButton>
          </div>
          <div class="flex space-x-1 font-medium">
            <CardLink
              :card
              class="whitespace-nowrap  dark:text-theme-300 pr-1 hover:text-primary-500 dark:hover:text-theme-0 flex items-center gap-1"
              href="/"
            >
              <span class="i-tabler-browser-plus text-xl inline-block dark:text-theme-500" />
              <span>Edit Site</span>
              <span class="i-tabler-slash text-xl dark:text-theme-500" />
            </CardLink>

            <XText v-if="site" v-model="site.title.value" :is-editable="true" class="hover:bg-theme-100 hover:dark:bg-theme-700 whitespace-nowrap" />
          </div>
        </template>
        <template v-if="site" #headerRight>
          <ElSavingSignal
            :is-dirty="site?.editor.value.isDirty"
            :nav-items="[{
              label: 'Reset to Published Version',
              onClick: () => resetToPublished(),
              testId: 'reset-to-published',
            }]"
            data-test-id="draft-control-dropdown"
          />
          <CardButton
            :card
            theme="default"
            :href="activeSiteDisplayUrl(site, { mode: 'staging' }).value"
            target="_blank"
            size="md"
            icon="i-tabler-arrow-up-right"
            data-test-id="viewSiteButton"
          >
            View Site
          </CardButton>
          <CardButton
            :card
            theme="primary"
            :loading="sending === 'save'"
            icon="i-tabler-arrow-big-up-lines"
            size="md"
            data-test-id="publishChangesButton"
            @click.prevent="save()"
          >
            Publish Changes
          </CardButton>
        </template>
        <template #default>
          <El404 v-if="!site && !loading" heading="Site Not Found" sub-heading="No site was found here." />
          <SiteEditorFrame v-else class="h-full" :site="site" />
        </template>
      </ViewEditor>
    </template>
  </div>
</template>
