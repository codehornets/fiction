<script lang="ts" setup>
import { stored, vue } from '@factor/api'
import { socialList } from './map'
import ElLogo from './ElLogo.vue'

const darkMode = vue.computed(() => stored('pageMode') === 'dark')

interface Column {
  heading?: string
  class?: string
  menu?: { path: string, name: string, target?: string }[]
}
const columns = vue.ref<Column[]>([
  {
    heading: 'Legal',
    menu: [
      { path: '/docs/privacy-policy', name: 'Privacy' },
      { path: '/docs/tos', name: 'Terms of use' },
      { path: '/docs/gdpr', name: 'GDPR' },
    ],
  },
  {
    heading: 'Company',
    menu: [
      { path: '/about', name: 'About' },
      { path: '/support', name: 'Customer Support' },
      { path: '/affiliate', name: 'Affiliate Program' },
    ],
  },
])
</script>

<template>
  <footer aria-labelledby="footerHeading">
    <h2 id="footerHeading" class="sr-only">
      Footer
    </h2>
    <div class="mx-auto max-w-7xl px-4 lg:px-0">
      <div
        class="flex flex-col justify-between py-16 md:py-36 lg:flex-row lg:px-12"
      >
        <div
          class="mx-auto w-80 py-6 text-center md:py-1 text-xs font-semibold tracking-wider uppercase"
        >
          <a href="https://www.waylight.ai"> <ElLogo /> </a>
        </div>
        <div
          class="grid grow grid-cols-12 gap-x-8 gap-y-12"
          :style="{ direction: 'rtl' }"
        >
          <div
            v-for="(col, i) in columns"
            :key="i"
            class="col-span-6 sm:col-span-4"
          >
            <h3
              v-if="col.heading"
              class="font-medium mb-2 text-center text-sm uppercase tracking-wider lg:mb-3 lg:text-left"
            >
              {{ col.heading }}
            </h3>
            <ul v-if="col.menu" :class="col.class ? col.class : 'space-y-1'">
              <li
                v-for="(item, ii) in col.menu"
                :key="ii"
                class="text-center lg:text-left"
              >
                <a
                  :href="item.path"
                  :target="item.target ? item.target : '_self'"
                  class="text-xs"
                >
                  {{ item.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        class="flex-end flex flex-col pb-12 text-center text-sm lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:pb-36"
      >
        <ul class="m-0 mx-auto flex p-0 lg:mx-0">
          <li
            v-for="(item, i) in socialList"
            :key="i"
            class="text-center lg:text-left"
          >
            <a
              :href="item.path"
              class="mx-2 inline-block"
              :target="item.target ? item.target : '_self'"
            >
              <span class="sr-only">{{ item.name }}</span>
              <div class="text-white hover:opacity-80" v-html="item.icon" />
            </a>
          </li>
        </ul>

        <div class="mx-auto mt-5 text-xs text-white lg:mx-0 lg:mt-0">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="174"
              height="28"
            >
              <g fill="none" fill-rule="evenodd">
                <rect
                  width="173"
                  height="27"
                  x=".5"
                  y=".5"
                  stroke="currentColor"
                  opacity=".5"
                  rx="6"
                />
                <path
                  fill="currentColor"
                  d="M79.79 11.12L77.1 18h-1.44l-2.7-6.88h1.71l1.71 4.63 1.71-4.63h1.7zm.78 6.88v-6.88h4.34v1.36h-2.67v1.37h2.28v1.31h-2.28v1.48h2.75V18h-4.42zm7.34-5.56v1.82h.76c.57 0 .98-.39.98-.91 0-.54-.41-.91-.98-.91h-.76zM86.28 18v-6.88h2.61c1.42 0 2.43.92 2.43 2.23 0 .89-.47 1.61-1.26 1.99L91.59 18h-1.78l-1.34-2.43h-.56V18h-1.63zm6.4 0v-6.88h1.67V18h-1.67zm3.31 0v-6.88h4.34v1.36h-2.67v1.63h2.28v1.36h-2.28V18h-1.67zm5.47 0v-6.88h1.67V18h-1.67zm3.31 0v-6.88h4.34v1.36h-2.67v1.37h2.28v1.31h-2.28v1.48h2.75V18h-4.42zm5.71 0v-6.88h2.73c1.99 0 3.4 1.43 3.4 3.44S115.2 18 113.21 18h-2.73zm1.67-5.52v4.16h.98c1.05 0 1.78-.85 1.78-2.08s-.73-2.08-1.78-2.08h-.98zm8.17 5.52v-6.88h2.65c1.44 0 2.46.94 2.46 2.27s-1.02 2.25-2.46 2.25h-1.02V18h-1.63zm1.63-5.56v1.89h.8c.59 0 1.02-.39 1.02-.94 0-.57-.43-.95-1.02-.95h-.8zm3.12 5.56l2.7-6.88h1.44L131.9 18h-1.62l-.53-1.42h-2.53L126.7 18h-1.63zm3.42-4.87l-.81 2.21h1.61l-.8-2.21zm5.82-.69v1.82h.76c.57 0 .98-.39.98-.91 0-.54-.41-.91-.98-.91h-.76zM132.68 18v-6.88h2.61c1.42 0 2.43.92 2.43 2.23 0 .89-.47 1.61-1.26 1.99l1.53 2.66h-1.78l-1.34-2.43h-.56V18h-1.63zm7.64 0v-5.52h-1.99v-1.36h5.63v1.36h-1.98V18h-1.66zm4.7 0v-6.88h1.44l3.1 4.24v-4.24h1.55V18h-1.44l-3.09-4.24V18h-1.56zm7.73 0v-6.88h4.34v1.36h-2.67v1.37h2.28v1.31h-2.28v1.48h2.75V18h-4.42zm7.34-5.56v1.82h.76c.57 0 .98-.39.98-.91 0-.54-.41-.91-.98-.91h-.76zM158.46 18v-6.88h2.61c1.42 0 2.43.92 2.43 2.23 0 .89-.47 1.61-1.26 1.99l1.53 2.66h-1.78l-1.34-2.43h-.56V18h-1.63zM51 10.068L65 7v10.935L51 21V10.068zm5.323 6.469a.778.778 0 001.07-.004l3.814-3.664a.726.726 0 000-1.048.778.778 0 00-1.078 0l-3.27 3.129-.986-.9a.778.778 0 00-1.078 0 .726.726 0 000 1.048l1.528 1.439zM42.97 15.07h-4.428c.1 1.093.877 1.415 1.759 1.415.899 0 1.606-.194 2.223-.516v1.88c-.615.351-1.427.605-2.508.605-2.204 0-3.748-1.423-3.748-4.237 0-2.376 1.31-4.263 3.462-4.263 2.15 0 3.27 1.886 3.27 4.276 0 .225-.02.714-.03.84zm-3.254-3.214c-.566 0-1.195.44-1.195 1.492h2.34c0-1.05-.59-1.492-1.145-1.492zm-7.037 6.598c-.791 0-1.275-.345-1.6-.59l-.005 2.64-2.262.496-.001-10.89h1.992l.118.576a2.495 2.495 0 011.773-.732c1.588 0 3.085 1.476 3.085 4.192 0 2.965-1.48 4.308-3.1 4.308zm-.526-6.434c-.52 0-.845.196-1.08.463l.013 3.467c.219.245.536.443 1.067.443.836 0 1.397-.94 1.397-2.196 0-1.22-.57-2.177-1.397-2.177zm-6.538-1.91h2.271v8.177h-2.27v-8.178zm0-2.612L27.885 7v1.9l-2.27.498v-1.9zm-2.346 5.245v5.544h-2.262v-8.178h1.956l.143.69c.529-1.004 1.587-.8 1.888-.69v2.145c-.288-.096-1.19-.235-1.725.489zm-4.775 2.675c0 1.375 1.427.947 1.717.827v1.9c-.301.17-.848.309-1.588.309-1.343 0-2.35-1.02-2.35-2.401l.01-7.486 2.209-.484.002 2.026h1.718v1.99h-1.718v3.319zm-2.746.398c0 1.68-1.296 2.638-3.178 2.638a6.11 6.11 0 01-2.474-.53v-2.227c.76.426 1.727.745 2.477.745.504 0 .868-.14.868-.57 0-1.115-3.44-.695-3.44-3.278 0-1.652 1.224-2.64 3.059-2.64.75 0 1.499.119 2.248.427v2.197c-.688-.383-1.562-.6-2.25-.6-.474 0-.769.14-.769.505 0 1.05 3.46.551 3.46 3.333z"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
