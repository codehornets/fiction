<script lang="ts" setup>
import type { FactorRouter, FactorUser } from '@factor/api'
import { useService, vue } from '@factor/api'
import type { FictionPayment } from '@fiction/core/plugin-payment'
import ElLoadingLogo from '@fiction/core/ui/ElLoadingLogo.vue'

const { factorRouter, fictionPayment } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
  fictionPayment: FictionPayment
}>()

const authLoading = vue.ref(false)

if (factorRouter.routeRequiresAuth())
  authLoading.value = true

vue.onMounted(async () => {
  await fictionPayment.customerInitialized()
  authLoading.value = false
})
</script>

<template>
  <div
    v-if="authLoading"
    class="loading-veil fixed left-0 top-0 flex h-full w-full items-center justify-center bg-white text-slate-300"
  >
    <ElLoadingLogo class="w-24" />
  </div>
</template>

<style lang="less" scoped>
.loading-veil {
  z-index: 10000;
}
</style>
