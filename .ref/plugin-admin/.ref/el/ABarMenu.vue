<script lang="ts" setup>
import type {
  FactorRouter,
  FactorUser,
  ListItem,
} from '@factor/api'
import {
  getNavComponentType,
  onResetUi,
  useService,
  vue,
} from '@factor/api'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import type { FactorAdmin } from '..'

defineProps({
  list: { type: Array as vue.PropType<ListItem[]>, default: () => [] },
  loading: { type: Boolean, default: false },
  direction: { type: String, default: 'right' },
  vertical: { type: String as vue.PropType<'up' | 'down'>, default: 'down' },
})
defineEmits<{
  (event: 'select', payload: ListItem): void
  (event: 'update', payload: ListItem): void
}>()
const { factorAdmin, factorUser } = useService<{
  factorAdmin: FactorAdmin
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()
const active = vue.ref(false)

onResetUi(() => {
  active.value = false
})
</script>

<template>
  <div class="relative ml-auto">
    <div @click.stop="active = !active">
      <div class="group flex cursor-pointer items-center space-x-2">
        <ElAvatar
          class=" ml-3 h-10 w-10 rounded-full  "
          :class="active ? 'opacity-70' : ''"
          :email="factorUser.activeUser.value?.email"
        />
        <div
          class="flex flex-col items-end justify-center transition-all"
          :class="active ? 'space-y-1' : 'space-y-0.5'"
        >
          <div
            class="h-1 w-1 rounded-full bg-theme-300 group-hover:bg-theme-400"
          />
          <div
            class="h-1 w-1 rounded-full bg-theme-300 group-hover:bg-theme-400"
          />
          <div
            class="h-1 w-1 rounded-full bg-theme-300 group-hover:bg-theme-400"
          />
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="active"
        class="absolute z-30 w-80 origin-top-right overflow-hidden rounded-md bg-white py-2 text-slate-800 shadow-xl ring-1 ring-black/10 focus:outline-none"
        :class="[
          direction === 'left' ? 'right-0' : 'left-0',
          vertical === 'up' ? 'bottom-full mb-1' : 'top-full mt-1',
        ]"
      >
        <div
          v-if="factorUser.activeUser.value"
          class="border-theme-200 flex items-center space-x-3 border-b px-4 py-3 text-sm"
        >
          <div>
            <ElAvatar
              class="ring-theme-300 h-9 w-9 rounded-full ring-2"
              :email="factorUser.activeUser.value?.email"
            />
          </div>
          <div>
            <div class="text-sm text-slate-400">
              Signed in as...
            </div>
            <p class="truncate text-lg font-bold leading-tight">
              {{
                factorUser.activeUser.value?.fullName
                  || factorUser.activeUser.value?.email
              }}
            </p>
          </div>
        </div>
        <div
          class="p-2"
          role="none"
          @click.stop
        >
          <template v-for="(item, i) in factorAdmin.menu.value" :key="i">
            <component
              :is="getNavComponentType(item)"
              class="hover:text-primary-500 flex grow cursor-pointer items-center justify-between space-x-2 px-3 py-2 font-medium"
              :to="item.href"
              :href="item.href"
              @click="item.onClick ? item.onClick({ event: $event }) : ''"
            >
              <div
                class="flex items-center space-x-4 truncate whitespace-nowrap"
              >
                <div
                  v-if="item.icon"
                  :class="item.icon"
                  class="text-xl"
                />
                <div class="text-base">
                  {{ item.name }}
                </div>
              </div>
            </component>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>
