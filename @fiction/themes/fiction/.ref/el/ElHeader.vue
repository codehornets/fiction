<script setup lang="ts">
import type { ActionItem, MediaObject, NavItem } from '@fiction/core'
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import ElImage from '@fiction/ui/media/ElImage.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import XElement from '@fiction/cards/CardElement.vue'
import CardNavLink from '@fiction/cards/CardNavLink.vue'
import NavMobile from '@fiction/ui/NavMobile.vue'
import NavAccount from './NavAccount.vue'

export type UserConfig = {
  icon?: string
  nav?: NavItem[]
  logo?: MediaObject
  actions?: ActionItem[]
}

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const { fictionUser, fictionRouter } = useService()

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const nav = vue.computed(() => {
  const currentRoute = fictionRouter.current.value.path
  return (uc.value.nav || []).map((item) => {
    const isActive = item.href === currentRoute
    return { ...item, isActive }
  })
})

const activeUser = fictionUser.activeUser
/* Nav visibility */
const vis = vue.ref(false)

const btnClass = `hover:bg-theme-200 dark:hover:bg-primary-950 cursor-pointer rounded-full px-4 py-1.5 text-sm font-sans font-semibold `

// vue.onMounted(async () => {
//   const user = await fictionUser.userInitialized({ caller: 'ElHeader' })

//   if (!user) {
//     await googleOneTap({
//       fictionUser,
//       callback: async (r) => {
//         const email = r.user?.email
//         if (r.user && r.isNew && email) {
//           // if (r.code) {
//           // }
//         }
//       },
//     })
//   }
// })

const accountMenu = vue.computed((): NavItem[] => {
  const p = fictionRouter.current.value.path
  const user = activeUser.value
  const list = [
    {
      name: user ? 'Dashboard' : 'Sign In',
      icon: 'i-tabler-user',
      href: props.card.link('/app?_reload=1=1'),
    },
  ]

  if (user) {
    list.push({
      name: 'Sign Out',
      icon: 'i-tabler-logout',
      href: '/?logout=1',
    })
  }

  return list.map(item => ({ ...item, isActive: item.href === p }))
})
</script>

<template>
  <div>
    <div class="relative z-30">
      <div class="relative p-4 md:p-6 lg:px-8">
        <nav
          class="relative flex items-center justify-between"
          aria-label="Global"
        >
          <div class="flex lg:flex-1 text-left">
            <RouterLink
              to="/"
              class="flex hover:text-primary-700 dark:hover:text-primary-100 x-font-title rounded-md text-2xl font-bold transition-all max-w-[30dvw]"
            >
              <ElImage :media="uc.logo" class="h-6 inline-block" />
            </RouterLink>
          </div>
          <div class="hidden lg:block space-x-2">
            <CardNavLink
              v-for="item in nav"
              :key="item.href"
              :card
              :item="item"
              :class="[btnClass, item.isActive ? 'bg-theme-200 dark:bg-primary-950' : '']"
            />
          </div>
          <div
            class="flex lg:flex-1 lg:justify-end gap-x-4 items-center"
          >
            <NavAccount v-if="activeUser" :card="card" :account-menu="accountMenu" />
            <template v-else>
              <XElement
                :card="card"
                theme-el="button"
                btn="default"
                href="/app/auth/login?_reload=1=1"
              >
                Login
              </XElement>
              <XElement
                :card="card"
                theme-el="button"
                btn="primary"
                href="/app/auth/register?_reload=1=1"
              >
                Sign Up
              </XElement>
            </template>

            <button

              type="button"
              class="-m-2.5 inline-flex lg:hidden items-center justify-center rounded-md p-2.5"
              @click.stop="vis = !vis"
            >
              <span class="sr-only">Open main menu</span>
              <div class="i-tabler-menu text-2xl" />
            </button>
          </div>
        </nav>
      </div>
    </div>
    <!-- Mobile Nav -->
    <NavMobile v-model:vis="vis" :nav="{ a: nav }" :account-menu="accountMenu">
      <template #foot>
        <div class="px-12">
          <ElButton btn="default" format="block" size="lg" href="/app?_reload=1">
            View Dashboard
          </ElButton>
        </div>
      </template>
    </NavMobile>
  </div>
</template>
