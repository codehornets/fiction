<script lang="ts" setup>
import thumbRuleBehavior from './img/thumb-rule-behavior.webp'
import thumbRuleDevice from './img/thumb-rule-device.webp'
import thumbRuleUtm from './img/thumb-rule-utm.webp'

const thumbs = [
  {
    thumb: thumbRuleBehavior,
    alt: 'A/B Analytics - Rule Behavior',
  },
  {
    thumb: thumbRuleDevice,
    alt: 'A/B Analytics - Rule Device',
  },
  {
    thumb: thumbRuleUtm,
    alt: 'A/B Analytics - Rule UTM',
  },
]
</script>

<template>
  <div class="my-12">
    <div class="figure-stage m-auto relative flex justify-center">
      <div
        v-for="(th, i) in thumbs"
        :key="i"
        class="w-52 -ml-8 mt-4"
      >
        <img
          class="shadow-xl ring-1 ring-black ring-opacity-10 rounded-md"
          :src="th.thumb"
          :style="{ 'margin-top': `${i * 2}em` }"
          :alt="th.alt"
        >
      </div>
    </div>
  </div>
</template>
