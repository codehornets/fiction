<script lang="ts" setup>
import type { UiElementSize } from '@fiction/ui/utils'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import InputText from '@fiction/ui/inputs/InputText.vue'

export interface CustomDomain {
  hostname?: string
  isPrimary?: boolean
}

const props = defineProps({
  modelValue: { type: Array as vue.PropType<CustomDomain[]>, default: () => ([]) },
  destination: { type: String, required: true },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
})
const emit = defineEmits(['update:modelValue'])

const domains = vue.computed<CustomDomain[]>({
  get: () => {
    const base = props.modelValue ?? []

    if (base.length === 0)
      return [{ isPrimary: true }]
    else if (!base.find(item => item.isPrimary))
      base[0].isPrimary = true

    return base
  },
  set: (v) => {
    emit('update:modelValue', v)
  },
})

function addCustomDomain(): void {
  domains.value = [...domains.value, {}]
}

function deleteDomain(index: number): void {
  domains.value = (domains.value ?? []).filter((_, i) => i !== index)
}

function setPrimary(index: number) {
  const d = domains.value ?? []

  d.forEach((item, i) => (item.isPrimary = (i === index)))

  domains.value = [...d]
}

function updateHostname(value: string, index: number): void {
  domains.value = domains.value ?? []

  if (value && index >= 0 && index < domains.value.length) {
    const updatedDomains = [...domains.value]
    const hostname = value.replace(/^https?:\/\//, '').split('/')[0].trim()

    updatedDomains[index] = { ...updatedDomains[index], hostname }
    domains.value = updatedDomains
  }
}

const defaultCopyText = 'click to copy'
const copyText = vue.ref(defaultCopyText)
const copyEffect = vue.ref(false)
async function handleCopy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.destination)
    copyText.value = '...copied!'
    copyEffect.value = true
    setTimeout(() => {
      copyText.value = defaultCopyText
      copyEffect.value = false
    }, 2500)
  }
  catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const showInstructions = vue.ref(false)
</script>

<template>
  <div class="custom-domains font-sans pt-4">
    <div

      class=" grid grid-cols-1 gap-x-12 gap-y-6"
    >
      <div class="sm:col-span-6">
        <label for="domain" class="block text-theme-500 text-xs">
          Your Domain Names
        </label>
        <div class="space-y-4">
          <div
            v-for="(item, i) in domains"
            :key="i"
            class="flex mt-2 items-center"
          >
            <div class="grow">
              <InputText
                :model-value="item.hostname"
                type="text"
                placeholder="Enter domain (e.g., www.yoursite.com)"
                :ui-size="uiSize"
                @update:model-value="updateHostname($event, i)"
              />
              <div class="flex space-x-1 mt-3 justify-between text-[9px]  font-medium text-theme-500 select-none">
                <XButton
                  size="xs"
                  :icon="item.isPrimary ? 'i-tabler-check' : 'i-tabler-switch-horizontal'"
                  theme="primary"
                  rounding="full"
                  :design="item.isPrimary ? 'solid' : 'outline'"
                  :title="item.isPrimary ? 'This is your main domain' : 'Make this your main domain'"
                  @click.prevent="setPrimary(i)"
                >
                  {{ item.isPrimary ? 'Primary Domain' : 'Set as Primary' }}
                </XButton>

                <XButton
                  size="xs"
                  icon="i-tabler-x"
                  theme="default"
                  rounding="full"
                  title="Remove this domain"
                  @click.prevent="deleteDomain(i)"
                >
                  Remove Domain
                </XButton>
              </div>
            </div>
          </div>
        </div>
        <div class="add-new mt-4">
          <XButton
            theme="default"
            size="xs"
            icon="i-tabler-plus"
            rounding="full"
            @click.prevent="addCustomDomain()"
          >
            Add Another Domain
          </XButton>
        </div>
      </div>
      <div class="sm:col-span-6 bg-theme-50 dark:bg-theme-800 rounded-lg p-6 mb-8">
        <label for="instructions" class="block font-bold space-x-4" @click="showInstructions = !showInstructions">
          <span class="text-base">Domain Setup Instructions</span>
        </label>

        <div class="mt-2 text-xs sm:col-span-6 text-theme-500 dark:text-theme-100">
          <ol class="list-decimal list-outside ml-4 space-y-3">
            <li>Sign in to your domain provider's website (like GoDaddy, Namecheap, or Google Domains)</li>
            <li>Find the DNS settings or DNS management section</li>
            <li>
              Add a new <strong>CNAME record</strong> with these settings:
              <div class="mt-2 space-y-2">
                <div><strong>Host/Name:</strong> Your subdomain (usually 'www')</div>
                <div>
                  <strong>Target/Value:</strong> Copy this exactly &darr;
                  <code
                    :class="copyEffect ? 'scale-effect' : ''"
                    class="py-4 px-6 bg-primary-50 dark:bg-primary-950 dark:hover:bg-primary-800 mt-2 mb-3 rounded-full font-bold text-primary-700 dark:text-primary-50 cursor-pointer flex items-center justify-between"
                    title="Click to copy to clipboard"
                    @click="handleCopy()"
                  >
                    <span>{{ destination }}</span>
                    <span class="opacity-50 text-[10px]" v-html="copyText" />
                  </code>
                </div>
              </div>
            </li>
          </ol>
          <div class="mt-4 space-y-2 text-[11px]">
            <p class="italic opacity-80">
              <strong>Note:</strong> DNS changes typically take 15-30 minutes to work, but can take up to 48 hours to fully propagate across the internet.
            </p>
            <p class="opacity-60">
              Need help? Our support team can guide you through the process or check your DNS configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@keyframes scaleup {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
    opacity: 0;
  }
}

/* Class to apply the animation */
.scale-effect {
  animation: scaleup .4s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
