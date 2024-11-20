<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { vue } from '@fiction/core'
import CardForm from '@fiction/forms/deck/CardForm.vue'
import { useElementVisible } from '@fiction/ui/anim'
import XIcon from '@fiction/ui/media/XIcon.vue'
import CardText from '../CardText.vue'
import CardSocials from '../el/CardSocials.vue'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const items = vue.computed(() => uc.value.items)

const isVisible = vue.ref(false)

vue.onMounted(async () => {
  await useElementVisible({ selector: `.contact-form`, onVisible: () => isVisible.value = true, caller: 'contact' })
})
</script>

<template>
  <div :class="card.classes.value.contentWidth" class="contact-form">
    <div class="text-center">
      <div class="md:flex gap-8 sm:gap-16 lg:gap-28 justify-center" :class="uc.layout === 'left' ? 'md:flex-row-reverse' : ''">
        <div class="w-full md:w-[50%]  ">
          <div v-if="card.site" class="overflow-hidden relative border border-theme-300/70 dark:border-theme-700 rounded-xl h-full bg-theme-100/40 dark:bg-theme-800/50">
            <CardForm
              :site="card.site"
              :config="{
                formTemplateId: 'contact',
                userConfig: {
                  notifyEmails: card.userConfig.value.notifyEmails,
                },
              }"
              class="h-full w-full"
            />
          </div>
        </div>
        <div class="md:w-[50%] mt-6 md:mt-0 flex flex-col justify-center text-left gap-6 md:gap-10">
          <CardText :card tag="h2" path="title" animate="rise" class=" md:text-3xl x-font-title font-medium" />

          <div class="flex flex-col w-full gap-10 2xl:gap-12 " :class="isVisible ? 'translate-y-0' : 'translate-y-[100px]'">
            <div v-for="(item, i) in items" :key="i" class="list space-y-6">
              <div class="flex gap-2 items-center">
                <CardText
                  tag="h3"
                  :card
                  class="sub-heading text-theme-400 dark:text-theme-500 x-font-title text-lg lg:text-xl font-medium "
                  :path="`items.${i}.title`"
                  placeholder="List Title"
                />
                <div class="grow">
                  <hr class="border-t border-2 border-dashed border-theme-200/70 dark:border-theme-700/40">
                </div>
              </div>
              <div class="flex flex-col gap-[10%] gap-y-4 flex-wrap text-base pl-8">
                <a v-for="(subItem, ii) in item.items" :key="ii" :href="subItem.href" class="flex gap-4 items-center hover:text-primary-500 dark:hover:text-primary-400">
                  <XIcon v-if="subItem.media" class="size-6 lg:size-8" :media="subItem.media" />
                  <CardText
                    :card
                    tag="span"
                    class="text-base lg:text-lg font-sans"
                    :path="`items.${i}.items.${ii}.title`"
                  />
                </a>
              </div>
            </div>

            <CardSocials :card :socials="uc.socials || []" class="flex gap-2 text-2xl justify-center md:justify-start" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
