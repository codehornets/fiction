<script lang="ts" setup>
import type { Card, Site } from '@fiction/site'
import type { UserConfig } from '.'
import { localRef, useService, vue } from '@fiction/core'
import { type QueryVarHook, setupRouteWatcher } from '@fiction/site/utils/site'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElClose from '@fiction/ui/common/ElClose.vue'
import ConfettiEffect from '@fiction/ui/effect/EffectConfetti.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import CardText from '../CardText.vue'
import EffectScrollModal from './EffectScrollModal.vue'
import EmailForm from './EmailForm.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const service = useService()

const uc = vue.computed(() => props.card.userConfig.value || {})
const loading = vue.ref(true)
const showConfetti = vue.ref(false)

const subscribed = localRef({ key: `capture-subscribed`, def: '', lifecycle: 'local' })
const dismissedLoad = localRef({ key: `capture-dismissed-load`, def: false, lifecycle: 'session' })
const dismissedScroll = localRef({ key: `capture-dismissed-scroll`, def: false, lifecycle: 'session' })

// Single modal state to ensure only one can be shown
const modalState = vue.ref<'subscribeModal' | 'confirmModal' | ''>('')

vue.onMounted(async () => {
  vue.watch(() => props.card.site, (v) => {
    if (v) {
      const queryVarHooks: QueryVarHook[] = [{
        key: '_subscribe',
        callback: async (args: { site: Site, value: string }) => {
          modalState.value = 'subscribeModal'
          return {}
        },
      }]
      setupRouteWatcher({ site: v, queryVarHooks })
    }
  }, { immediate: true })
  loading.value = false
})

const attrs = vue.useAttrs()

const showCard = vue.computed(() => {
  return !loading.value && !subscribed.value
})

function handleSubscribe(value: string) {
  subscribed.value = value
  modalState.value = 'confirmModal'
  showConfetti.value = true

  // Reset confetti after animation
  setTimeout(() => {
    showConfetti.value = false
  }, 3000)
}

vue.watchEffect(() => {
  const mode = uc.value.presentationMode

  if (mode === 'onLoad' || mode === 'onScroll')
    props.card.isNotInline.value = true
})

vue.watchEffect(() => {
  if (typeof document === 'undefined')
    return

  if (uc.value.presentationMode === 'onLoad') {
    const h = showCard.value && !dismissedLoad.value
    if (h)
      document.body.style.overflow = 'hidden'
    else
      document.body.style.overflow = ''
  }
})
</script>

<template>
  <div :data-value="JSON.stringify({ subscribed })" :data-wrap-mode="uc.presentationMode">
    <ConfettiEffect :active="showConfetti" />
    <!-- Subscribe Modal -->
    <ElModal
      :vis="modalState === 'subscribeModal'"
      modal-class="max-w-xl p-8"
      :has-close="true"
      @close="modalState = ''"
      @update:vis="modalState = ''"
    >
      <EmailForm
        class="p-8 py-12"
        :animate="false"
        :card="card"
        v-bind="attrs"
        :show-dismiss="true"

        @update:subscribed="handleSubscribe"
      />
    </ElModal>

    <!-- Confirmation Modal -->
    <ElModal
      :vis="modalState === 'confirmModal'"
      modal-class="max-w-md p-8"
      :has-close="true"
      @update:vis="modalState = ''"
    >
      <div class="text-center p-6">
        <CardText
          tag="h2"
          class="font-normal x-font-title text-balance text-xl"
          :card="card"
          path="thanksText"
          fallback="Congratulations, you've subscribed! Please confirm via email."
        />
      </div>
    </ElModal>

    <!-- Existing template content -->
    <template v-if="uc.presentationMode !== 'inline'">
      <teleport v-if="uc.presentationMode === 'onLoad'" to=".x-site">
        <div v-if="showCard && !dismissedLoad" :data-mode="uc.presentationMode" class="pointer-events-none z-[45] text-theme-800 dark:text-theme-0 fixed left-0 top-0 flex h-[100dvh] w-[100dvw] items-center justify-center bg-theme-0 dark:bg-theme-900">
          <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full flex-col items-center justify-center">
              <EmailForm
                class="pointer-events-auto p-8 py-12 md:p-16"
                :animate="false"
                :card="card"
                v-bind="attrs"
                :show-dismiss="true"
                @update:subscribed="handleSubscribe"
                @update:dismissed="dismissedLoad = $event"
              />
              <XButton
                data-test-id="dismiss"
                size="xs"
                design="textOnly"
                theme="theme"
                class=" pointer-events-auto cursor-pointer"
                icon="i-tabler-x"
                @click.prevent="dismissedLoad = true"
              >
                Continue to site
              </XButton>
            </div>
          </div>
        </div>
      </teleport>

      <EffectScrollModal v-if="uc.presentationMode === 'onScroll' && showCard && !dismissedScroll">
        <div :data-mode="uc.presentationMode">
          <div class="absolute right-3 top-3 pointer-events-auto z-10">
            <ElClose
              data-test-id="dismiss"
              @click.prevent="dismissedScroll = true"
            />
          </div>
          <EmailForm
            class="p-8 py-12 md:p-16"
            :card="card"
            v-bind="attrs"
            :show-dismiss="true"
            :subscribed="subscribed"
            @update:subscribed="handleSubscribe"
            @update:dismissed="dismissedScroll = $event"
          />
        </div>
      </EffectScrollModal>
    </template>

    <div v-else-if="!subscribed" v-bind="attrs" :class="card.classes.value.contentWidth" :data-mode="uc.presentationMode">
      <EmailForm
        :animate="true"
        :card="card"
        :subscribed="subscribed"
        @update:subscribed="handleSubscribe"
      />
    </div>

    <div v-else class="p-4 text-center bg-theme-50 dark:bg-theme-700/60 dark:text-theme-500 max-w-sm mx-auto rounded-full">
      <CardText
        tag="h2"
        class="font-normal x-font-title text-balance"
        :card="card"
        path="thanksText"
        fallback="Congratulations, you've subscribed! Please confirm via email."
      />
    </div>
  </div>
</template>
