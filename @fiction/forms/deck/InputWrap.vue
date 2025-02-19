<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { Form } from '../form'
import type { CardAlignmentMode, CardLayoutMode } from '../schema.js'
import type { InputUserConfig } from '../templates.js'
import CardButton from '@fiction/cards/CardButton.vue'
import CardText from '@fiction/cards/CardText.vue'
import { vue } from '@fiction/core'
import { inputs } from '@fiction/ui/inputs'

import XMedia from '@fiction/ui/media/XMedia.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<InputUserConfig>>, required: true },
  form: { type: Object as vue.PropType<Form>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)
const inputComponent = vue.computed(() => uc.value.inputType ? inputs[uc.value.inputType] : undefined)

const inputEl = vue.ref<HTMLElement>()
const submitEl = vue.ref<HTMLElement>()

const layout = vue.computed<CardLayoutMode>(() => {
  const conf = props.card.fullConfig.value
  const out = conf.layout && conf.media ? conf.layout : 'background'

  return out as CardLayoutMode
})

const alignment = vue.computed<CardAlignmentMode | undefined>(() => {
  const conf = props.card.userConfig.value.alignment

  return conf || 'left'
})

const media = vue.computed<MediaObject | undefined>(() => {
  const m = props.card.fullConfig.value.media as
    | MediaObject[]
    | undefined

  return m?.[0]
})

const contentClasses = vue.computed(() => {
  const out: string[] = []

  if (layout.value === 'background')
    out.push('col-span-2 row-span-2')

  if (layout.value === 'hero' || layout.value === 'background')
    out.push('col-span-2')

  if (layout.value === 'right' || layout.value === 'heroRight')
    out.push('col-start-1')
  else
    out.push(' ')

  if (alignment.value === 'center')
    out.push('text-center')
  else if (alignment.value === 'right')
    out.push('text-right')
  else
    out.push('text-left')

  return out
})

const mediaClasses = vue.computed(() => {
  const out: string[] = ['media']
  if (layout.value === 'right' || layout.value === 'heroRight')
    out.push('lg:col-start-2')
  else
    out.push(' ')

  if (layout.value === 'background')
    out.push('absolute inset-0 z-0')
  else
    out.push('relative')

  return out
})

const classes = vue.computed(() => {
  const out: string[] = [
    'card-wrap',
    'theme-font',
    'relative',
    'h-full',
    'w-full',
    'overflow-scroll',
    'grid',
    'grid-cols-1',
    'grid-rows-[30%_1fr]',
    'lg:grid-cols-2',
    'lg:grid-rows-[minmax(0,_1fr)]',
  ]

  return out
})

// if is last card, default to 'submit', else 'next'
const buttonText = vue.computed(() => {
  if (props.form.isLastCard.value)
    return

  return uc.value.buttonText || (props.form.isSubmitCard.value ? 'Submit' : 'Next')
})

const ic = vue.computed(() => props.form?.activeCard.value)
</script>

<template>
  <div class="grid-flow-dense @container" :class="classes">
    <div v-if="layout !== 'hero'" :class="mediaClasses">
      <XMedia
        class="absolute"
        :class="
          ['heroLeft', 'heroRight'].includes(layout) ? 'inset-[10%]' : 'inset-0'
        "
        :media
        fit="cover"
      />
    </div>
    <div
      class="content relative z-10 flex h-full min-h-0 w-full flex-col justify-center overflow-hidden"
      :class="contentClasses"
    >
      <transition :name="form?.slideTransition.value" mode="out-in">
        <div
          :id="ic?.cardId"
          :key="ic?.cardId"
          class="no-scrollbar overflow-y-auto"
        >
          <div class="mx-auto w-full h-full max-w-4xl px-8 @md:px-[4em] py-12 @lg:py-32 @xl:py-48">
            <div class="relative" :data-card-id="card.cardId">
              <div class="relative">
                <div class="text-input-size grow">
                  <CardText
                    class="text-2xl @lg:text-3xl x-font-title font-medium"
                    tag="h2"
                    :card
                    path="title"
                    placeholder="Your question here..."
                  />
                  <CardText
                    class="text-theme-500 mt-2 text-base @lg:text-lg font-sans"
                    tag="p"
                    :card
                    path="subTitle"
                    placeholder="Description (optional)"
                  />
                </div>
                <div class="absolute right-0 top-0">
                  <span
                    v-if="card.userConfig.value.required"
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-base font-medium text-theme-400"
                  >
                    <div class="i-carbon-asterisk" />
                  </span>
                </div>
              </div>

              <div v-if="layout === 'hero' && media" class="hero my-10">
                <XMedia
                  image-class="max-h-[40vh]"
                  :media
                  fit="inline"
                />
              </div>

              <div
                v-if="inputComponent?.el"
                ref="inputEl"
                class="relative mt-8 mb-4"
              >
                <component
                  :is="inputComponent.el"
                  v-bind="{ uiSize: '2xl', ...uc }"
                  :model-value="form.getUserValue({ cardId: ic?.cardId })"
                  @update:model-value="form.setUserValue({ value: $event, cardId: ic?.cardId })"
                />
              </div>
              <div v-if="buttonText" class="mt-8">
                <CardButton
                  ref="submitEl"
                  :card
                  class="submit-button"
                  theme="primary"
                  design="solid"
                  type="submit"
                  size="2xl"
                  rounding="full"
                  :loading="form.isLoading.value"
                >
                  {{ buttonText }}
                </CardButton>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
