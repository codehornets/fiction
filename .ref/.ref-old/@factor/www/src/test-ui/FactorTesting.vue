<template>
  <div class="space-y-6 p-12 text-center">
    <div v-for="(item, i) in list" :key="i" class="my-6">
      <div class="text-xs font-bold uppercase tracking-wider text-slate-500">
        {{ item.title }}
      </div>
      <div :id="item.id" class="text-sm font-bold">
        <span v-if="item.value" class="min-w-0 break-words text-slate-800">{{
          item.value
        }}</span>
        <span v-else class="text-red-500">[not set]</span>
      </div>
    </div>
    <div>{{ processVars }}</div>
  </div>
</template>
<script lang="ts" setup>
import { useFactorService } from "../inject"

const { factorApp } = useFactorService()

const processVars = process.env

const list = [
  {
    id: "server-port",
    title: "Server port",
    value: process.env.SERVER_PORT,
  },
  {
    id: "www-port",
    title: "WWW Port",
    value: process.env.WWW_PORT,
  },
  {
    id: "is-test",
    title: "IS_TEST",
    value: process.env.IS_TEST,
  },
  {
    id: "node-env",
    title: "NODE_ENV",
    value: process.env.NODE_ENV,
  },
  {
    id: "is-vite",
    title: "IS_VITE",
    value: process.env.IS_VITE,
  },
  {
    id: "app-name",
    title: "App Name",
    value: factorApp.appName,
  },
  {
    id: "app-email",
    title: "App Email",
    value: factorApp.appEmail,
  },
]
</script>
