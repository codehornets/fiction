<script lang="ts" setup>
import type { LogoObject } from '@fiction/core'
import { vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import XLogoType from '../media/XLogoType.vue'
import { createStockMediaHandler } from '../stock/index.js'

const darkMode = vue.ref(false)

const alignments = ['justify-start', 'justify-center', 'justify-end'] as const

const containerScenarios = [
  { label: 'Header Logo', class: 'h-16' },
  { label: 'Sidebar Logo', class: 'h-12 max-w-[200px]' },
  { label: 'Footer Logo', class: 'h-10' },
  { label: 'Mobile Header', class: 'h-8' },
  { label: 'Logo Grid Item', class: 'h-24' },
  { label: 'Banner Logo', class: 'h-20' },
  { label: 'Tall Container', class: 'h-40' },
  { label: 'No Height Specified', class: '' },
]

const stock = vue.ref<Awaited<ReturnType<typeof createStockMediaHandler>>>()

async function generateMediaObjects(): Promise<LogoObject[]> {
  if (!stock.value) {
    stock.value = await createStockMediaHandler()
  }
  else {
    stock.value.resetUsedMedia()
  }
  return [
    // Typography examples
    {
      typography: {
        label: 'Fiction.com',
        font: { family: 'Quicksand' },
        weight: 'bold',
        letterSpacing: '-0.02em',
      },
      variant: 'typography',
    },
    {
      typography: {
        label: 'Fiction.com',
        font: { family: 'Montserrat' },
        weight: 'normal',
        letterSpacing: '-0.02em',
      },
      variant: 'typography',
      scale: 1.5,
    },
    // HTML (SVG) examples
    {
      media: {
        html: `<div class="flex items-center gap-1 h-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
</svg><div class="font-sans">test</div></div>`,
        format: 'html',
      },
    },
    {
      variant: 'media',
      media: {
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 122">
  <style>
    path { fill: currentColor; transition: fill 0.3s ease; }
  </style>
  <path d="M271.21 72.2368C267.936 67.6287 262.047 65.5272 256.81 65.5272C246.07 65.5272 238.61 75.7256 238.61 86.7755C238.61 95.5797 243.974 100.751 252.098 100.751C258.234 100.572 264.156 98.3679 268.987 94.4603L270.824 111.512C264.542 116.965 253.802 119.335 246.076 119.335C229.713 119.335 217.929 107.735 217.929 90.0994C217.929 66.6192 234.591 47.6098 256.943 47.6098C263.358 47.6098 272.115 49.567 276.819 54.8757L271.21 72.2368Z" />
  <path d="M305.105 48.8953H319.452L316.611 66.0917H302.397C300.907 75.459 298.232 85.8016 298.232 95.3269C298.232 99.3787 300.128 100.629 303.781 100.629C306.004 100.635 308.206 100.21 310.282 99.3719L308.619 117.118C303.628 118.491 298.491 119.247 293.321 119.356C282.621 119.356 276.259 114.323 276.259 102.861C276.259 90.705 279.506 77.8489 281.256 66.0986L283.925 48.9022H283.965L285.316 40.2354C285.528 38.3811 285.622 36.5131 285.582 34.6452C285.595 33.2099 285.508 31.7745 285.316 30.3461H306.297C306.603 31.8501 306.736 33.3884 306.689 34.9267C306.676 37.0351 306.496 39.1434 306.15 41.2243L305.105 48.8953Z" />
  <path d="M318.767 117.797C318.355 116.204 318.175 114.556 318.228 112.908C318.235 110.889 318.414 108.876 318.767 106.892L325.941 58.9562C326.193 57.0539 326.333 55.1379 326.346 53.2218C326.36 51.7865 326.267 50.3443 326.074 48.9227H347.068C347.381 50.4405 347.52 51.9925 347.474 53.5377C347.461 55.6461 347.281 57.7475 346.935 59.8215L339.762 107.757C339.515 109.467 339.376 111.191 339.356 112.915C339.329 114.556 339.469 116.197 339.762 117.804L318.767 117.797ZM339.183 41.2036C333.493 41.2036 328.895 37.8522 328.895 31.5547C328.895 23.4441 335.117 17.7166 342.842 17.7166C348.678 17.7166 353.13 21.0679 353.13 27.3586C353.163 35.3387 346.928 41.2036 339.183 41.2036Z" />
  <path d="M378.151 119.336C361.695 119.336 348.992 109.138 348.992 90.2657C348.992 65.9477 365.827 47.6457 388.585 47.6457C405.167 47.6457 417.744 57.9676 417.744 76.8809C417.764 101.144 401.055 119.336 378.151 119.336ZM385.99 65.5219C375.449 65.5219 369.407 76.7023 369.407 87.0174C369.407 94.8395 373.266 100.711 380.846 100.711C391.386 100.711 397.428 89.5309 397.428 79.2158C397.455 71.3937 393.595 65.5219 386.016 65.5219H385.99Z" />
  <path d="M461.596 117.798C461.19 116.205 461.003 114.557 461.057 112.908C461.063 110.889 461.243 108.877 461.596 106.892L465.389 81.8807C465.808 79.6144 466.034 77.3138 466.061 74.9994C466.061 69.265 463.891 66.0578 458.069 66.0578C448.593 66.0578 445.479 75.4183 444.255 83.6731L438.971 117.777H417.85L426.814 59.2521C427.066 57.2536 427.2 55.2483 427.213 53.2361C427.226 51.8008 427.14 50.3586 426.947 48.937H447.775C448.087 50.4548 448.227 52.0068 448.181 53.5589C448.154 55.2895 448.021 57.0064 447.775 58.7164H447.908C452.785 52.0068 459.965 47.6734 468.23 47.6734C481.492 47.6734 488 54.2457 488 67.7953C487.993 70.9819 487.714 74.1616 487.168 77.2932L482.424 107.765C482.177 109.475 482.038 111.198 482.018 112.922C481.991 114.563 482.131 116.205 482.424 117.819L461.596 117.798Z" />
  <path d="M181.593 47.7951C182.718 40.9825 183.43 35.2206 191.561 34.0188C194.576 33.6617 195.707 33.5312 198.548 33.8746L202.295 15.8541C197.71 15.0506 192.852 15.1743 188.747 15.5726C168.205 17.571 162.515 29.8159 159.707 47.7814H149.06L146.911 65.6095H157.045C157.045 65.6095 151.003 100.167 150.597 102.66C150.191 105.153 147.756 118.819 147.756 118.819L169.602 118.503C169.602 118.503 169.229 118.641 170.354 111.396L178.512 65.6301H193.371L187.15 104.858C186.724 107.316 185.706 118.311 185.706 118.311L206.62 118.153C206.76 113.188 206.92 111.904 207.345 107.756C207.771 103.601 212.822 76.3298 212.822 76.3298C213.62 71.1585 214.845 63.5905 215.936 57.547C216.928 52.0461 216.375 47.8089 216.375 47.8089H181.593V47.7951Z" />
  <path d="M101.983 122H50.8045C47.484 122 44.3565 120.668 42.0075 118.237L3.01319 77.9858C0.0653321 74.9503 -0.806383 70.4109 0.783998 66.4414C2.38103 62.4651 6.1008 59.8898 10.2731 59.8898H58.0577V10.5739C58.0577 6.28166 60.5464 2.44269 64.3926 0.79448C68.1789 -0.83313 72.6906 0.0939898 75.5852 3.08138L114.599 43.3458C116.948 45.7838 118.239 49.0047 118.239 52.4248V105.229C118.233 114.48 110.946 122 101.983 122ZM52.9472 103.856H100.659V54.6155L75.6384 28.7935V78.0339H27.927L52.9472 103.856Z" />
</svg>`,
        format: 'html',
      },
    },
    {
      variant: 'media',
      media: {
        html: `<div class="bg-primary-500 text-white flex items-center rounded"><div>Custom HTML Logo</div></div>`,
        format: 'html',
      },
    },
    // Icon example
    {
      media: {
        iconId: 'brand-github',
        format: 'iconId',
      },
    },
    // Image example
    {
      media: {
        ...stock.value.getRandomByAspectRatio('aspect:wide', { format: 'image' }),
        alt: 'Wide image logo',
        format: 'image',
      },
    },
    // Video example
    {
      media: {
        ...stock.value.getRandomMedia({ format: 'video' }),
        format: 'video',
      },
    },
  ]
}

const logoObjects = vue.ref<LogoObject[]>([])

async function refreshMedia() {
  logoObjects.value = await generateMediaObjects()
}

// Grid layout example
const gridItems = vue.computed(() => {
  return logoObjects.value.map((logo, index) => ({
    logo,
    href: index % 2 === 0 ? `https://example.com/logo${index}` : undefined,
  }))
})

// Height handling examples
const heightExamples = [
  { label: 'Default (no height)', class: '' },
  { label: 'Fixed Height (64px)', class: 'h-16' },
  { label: 'Percentage Height (50%)', class: 'h-1/2' },
  { label: 'Viewport Height (25vh)', class: 'h-[15vh]' },
  { label: 'Min Height (100px)', class: 'min-h-[100px]' },
]

vue.onMounted(async () => {
  logoObjects.value = await generateMediaObjects()
})
</script>

<template>
  <div id="test-logo" class="min-h-screen p-8" :class="{ dark: darkMode }">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold x-font-title">
          Logo Handling
        </h1>
        <div class="space-x-4">
          <XButton rounding="full" @click="refreshMedia">
            Refresh Media
          </XButton>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="(logo, mediaIndex) in logoObjects"
          :key="mediaIndex"
          class="bg-white dark:bg-theme-800 p-6 rounded-lg shadow-lg"
        >
          <h2 class="text-xl font-semibold mb-4 text-theme-800 dark:text-white">
            {{ logo.variant }} {{ logo.media?.alt ? `(${logo.media?.alt})` : '' }}
          </h2>

          <div v-for="scenario in containerScenarios" :key="scenario.label" class="mb-6">
            <h3 class="text-sm font-medium mb-2 text-theme-600 dark:text-theme-300">
              {{ scenario.label }}
            </h3>
            <div v-for="alignment in alignments" :key="alignment" class="mb-2">
              <p class="text-xs text-theme-500 dark:text-theme-400 mb-1">
                {{ alignment }}
              </p>
              <div class="bg-theme-100 dark:bg-theme-700 rounded" :class="scenario.class">
                <XLogoType
                  :classes="{}"
                  :logo="logo"
                  :class="alignment"
                  class="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Height Handling Examples -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold mb-8 text-theme-800 dark:text-white">
          Height Handling Examples
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="example in heightExamples" :key="example.label" class="space-y-4">
            <h3 class="text-lg font-semibold text-theme-700 dark:text-theme-300 font-sans">
              {{ example.label }}
            </h3>
            <div class="bg-theme-100 dark:bg-theme-700 rounded" :class="example.class">
              <XLogoType
                :classes="{}"
                :logo="logoObjects[0] ?? {}"
                :class="example.class"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Grid layout example -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold mb-8 text-theme-800 dark:text-white">
          Logo Grid Example
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <a
            v-for="(item, index) in gridItems"
            :key="index"
            :href="item.href"
            class="flex items-center justify-center h-24 bg-white dark:bg-theme-800 p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            :class="{ 'cursor-pointer': item.href }"
            target="_blank"
            rel="noopener noreferrer"
          >
            <XLogoType
              :classes="{}"
              :logo="item.logo"
              class="w-full h-full"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
