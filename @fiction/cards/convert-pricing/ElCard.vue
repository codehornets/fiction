<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { PricingPlan, UserConfig } from './config'
import { formatNumber, vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import XIcon from '@fiction/ui/media/XIcon.vue'
import CardButton from '../CardButton.vue'
import CardText from '../CardText.vue'
import CardButtons from '../el/CardButtons.vue'

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)
const priceDuration = vue.ref<'month' | 'year'>('month')

// Styling helpers
function getVariantClasses(plan: PricingPlan) {
  const base = {
    card: 'relative flex flex-col overflow-hidden rounded-3xl',
    highlight: '',
    badge: '',
    button: '',
    pricing: '',
  }

  switch (plan.variant) {
    case 'highlighted':
      return {
        card: `${base.card} ring-2 ring-primary-500  translate-y-0 hover:-translate-y-2 shadow-xl`,
        highlight: 'text-primary-500 dark:text-primary-50',
      }
    case 'muted':
      return {
        card: `${base.card} bg-theme-50/50 dark:bg-theme-900/50`,
        highlight: 'text-theme-600 dark:text-theme-300',
      }
    default:
      return {
        card: `${base.card} ring-2 ring-theme-300/70 dark:ring-theme-600/70 hover:-translate-y-1`,
        highlight: 'text-theme-500 dark:text-theme-50',
      }
  }
}

// Price calculation with annual discount
function getPrice(plan: PricingPlan) {
  if (!plan.price)
    return 'Free'

  const basePrice = plan.price
  if (priceDuration.value === 'year' && uc.value.annualDiscountPercent) {
    const discount = 1 - (uc.value.annualDiscountPercent / 100)
    return formatNumber(Math.ceil(basePrice * discount))
  }
  return formatNumber(basePrice)
}

function getPricingLink(plan: PricingPlan): string {
  return priceDuration.value === 'year' && plan.hrefAnnual ? plan.hrefAnnual : plan.href || '#'
}
const isVisible = vue.ref(false)

// Animation handling
vue.onMounted(() => {
  useElementVisible({
    caller: 'pricing',
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      isVisible.value = true
      await animateItemEnter({
        targets: `#${props.card.cardId} .animate-item`,
        themeId: 'slide',
        config: { overallDelay: 150 },
      })
    },
  })
})

// Style variants
const containerClass = vue.computed(() => {
  switch (uc.value.pricingStyle) {
    case 'minimal':
      return 'grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto'
    case 'feature-focus':
      return 'grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto'
    default:
      return 'grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto'
  }
})
</script>

<template>
  <div :class="card.classes.value.contentWidth" :show="isVisible">
    <!-- Annual Toggle -->
    <div v-if="uc.hasAnnual" class="flex flex-col items-center gap-4 mb-12 animate-item" :class="isVisible ? 'opacity-100' : 'opacity-0'">
      <div v-if="uc.hasAnnual" class="flex justify-center ">
        <div class="relative grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-sans font-semibold leading-5 ring-1 ring-inset ring-theme-300 dark:ring-theme-600">
          <label :class="priceDuration === 'month' ? 'text-theme-0' : 'text-theme-500 dark:text-theme-200'" class="z-10 relative cursor-pointer rounded-full px-4 py-0.5 transition-all" @click="priceDuration = 'month'">
            <span>Monthly</span>
          </label>
          <label :class="priceDuration === 'year' ? ' text-theme-0' : 'text-theme-500 dark:text-theme-200'" class="z-10 relative cursor-pointer rounded-full px-4 py-0.5 transition-all" @click="priceDuration = 'year'">
            <span>Annually</span>
          </label>
          <div class="bg-primary-500 dark:bg-primary-800/50 ring-1 ring-inset ring-primary-600 dark:ring-primary-500/50 text-primary-0 rounded-full marker w-50 absolute h-full w-[50%] transition-all ease-[cubic-bezier(0.25,1,0.33,1)] duration-500" :class="priceDuration === 'month' ? 'left-0' : 'left-1/2'" />
        </div>
        <div class="relative">
          <div v-if="uc.annualDiscountPercent" class="x-font-highlight absolute left-full -top-12 w-56 flex items-center bottom-full -rotate-12">
            <div class="i-tabler-arrow-down-left" /><div>Pay {{ uc.annualDiscountPercent }}% Less</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Cards Grid -->
    <div :class="containerClass">
      <div
        v-for="(plan, i) in uc.prices"
        :key="i"
        class="animate-item transition-all duration-500"
        :class="[getVariantClasses(plan).card, isVisible ? 'opacity-100' : 'opacity-0']"
      >
        <div class="p-8 flex flex-col h-full space-y-8">
          <!-- Plan Header -->
          <div class="flex justify-between items-start">
            <div class="flex gap-3 items-center">
              <CardText
                :card
                tag="h3"
                :path="`prices.${i}.title`"
                class="text-2xl font-semibold x-font-title"
                :class="getVariantClasses(plan).highlight"
              />
              <CardButton
                v-if="plan.badge"
                :card
                tag="span"
                :path="`prices.${i}.badge`"
                size="xs"
                theme="primary"
                design="outline"
              >
                {{ plan.badge }}
              </CardButton>
            </div>
            <XIcon
              v-if="plan.icon"
              :media="plan.icon"
              class="size-10"
              :class="getVariantClasses(plan).highlight"
            />
          </div>

          <!-- Pricing -->
          <div class="">
            <div class="flex items-baseline gap-x-1">
              <span
                class="text-5xl font-bold x-font-title tracking-tight"
              >
                <span v-if="plan.price" class="text-2xl align-top font-medium -mr-0.5">$</span>
                {{ getPrice(plan) }}
              </span>
              <span
                v-if="plan.price"
                class="text-base font-sans text-theme-600/70 dark:text-theme-400/70"
              >/ {{ priceDuration }}</span>
            </div>
            <CardText
              :card
              tag="p"
              :path="`prices.${i}.description`"
              class="mt-3 text-lg  text-theme-500 dark:text-theme-400"
            />
          </div>

          <!-- Features List -->
          <div class="space-y-4 grow">
            <div v-for="(feature, fi) in plan.features" :key="fi" class="flex gap-3 text-xl">
              <div
                class="i-tabler-check  shrink-0 mt-0.5"
              />
              <CardText
                :card
                tag="span"
                :path="`prices.${i}.features.${fi}.label`"
                class=""
              />
            </div>
          </div>

          <!-- CTA Button -->
          <div class="mt-8 space-y-4">
            <CardButtons
              :card
              :actions="[{
                href: getPricingLink(plan),
                label: plan.buttonText || 'Get Started',
                format: 'block',
                theme: 'primary',
                design: plan.variant === 'highlighted' ? 'solid' : 'outline',
              }]"
              ui-size="xl"
              format="block"
              design="solid"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
