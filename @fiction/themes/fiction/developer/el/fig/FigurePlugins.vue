<script lang="ts" setup>
import { vue } from '@fiction/core'

import IconAnalytics from './img/icon-analytics.svg'
import IconAws from './img/icon-aws.svg'
import iDocs from './img/icon-docs.svg'
import iFeed from './img/icon-feed.svg'
import iForms from './img/icon-forms.svg'
import iGallery from './img/icon-gallery.svg'
import iJobs from './img/icon-plugin-job-board.svg'
import iSEO from './img/icon-plugin-seo.svg'
import iSitemap from './img/icon-plugin-sitemap.svg'
import iSyntax from './img/icon-plugin-syntax-highlight.svg'
import iSocial from './img/icon-socialize.svg'
import iSub from './img/icon-subscriptions.svg'
import iThemes from './img/icon-themes.svg'

const plugins = vue.ref([
  { image: iDocs, alt: 'Docs Icon', class: '' },
  { image: IconAnalytics, alt: 'Analytics Icon' },
  { image: iForms, alt: 'Forms Icon' },
  { image: iGallery, alt: 'Gallery Icon' },
  { image: iFeed, alt: 'Feed Icon' },
  { image: iSitemap, alt: 'Sitemap Icon' },
  { image: iSyntax, alt: 'Syntax Icon' },
  { image: iThemes, alt: 'Themes Icon' },
  { image: IconAws, alt: 'AWS Icon' },
  { image: iSub, alt: 'Subscriptions Icon' },
  { image: iJobs, alt: 'Jobs Icon' },
  { image: iSocial, alt: 'Socialize Icon' },
  { image: iSEO, alt: 'SEO Icon' },
])
</script>

<template>
  <figure class="figure-plugins relative -mx-6 h-full w-full">
    <div class="stage-wrap">
      <div class="stage">
        <div
          v-for="(plugin, i) in plugins"
          :key="i"
          class="plugin-icon"
          :class="plugin.class"
        >
          <img :src="plugin.image" :alt="plugin.alt">
        </div>
      </div>
    </div>
  </figure>
</template>

<style lang="less">
figure.figure-plugins {
  max-width: 100%;

  .stage-wrap {
    perspective: 1000px;
  }
  .stage-wrap,
  .stage {
    width: 100%;
    height: 100%;
  }
  .stage {
    position: absolute;
    perspective: 1000px;
    min-width: 500px;
    left: 0;
    top: 0;

    @media (max-width: 900px) {
      transform: rotateX(27deg) rotateY(10deg) rotateZ(-7deg) rotate(-2deg) scale(.8) translateX(0px) translateY(0px);
    }

    transform: rotateX(27deg) rotateY(10deg) rotateZ(-7deg) rotate(-2deg) scale(1) translateX(0px) translateY(-90px);
    .plugin-icon {
      position: absolute;
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 1.5rem;
      overflow: hidden;
      background: #fff;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.11),
        0px 1px 3px rgba(0, 0, 0, 0.08);

      img {
        width: 100%;
      }

      &:nth-child(1) {
        top: 5%;
        left: 5%;
      }
      &:nth-child(2) {
        top: 5%;
        left: 38%;
      }
      &:nth-child(3) {
        top: 8%;
        left: 78%;
        transform: scale(0.7);
        opacity: 0.8;
      }
      &:nth-child(4) {
        top: 25%;
        left: 65%;
      }
      &:nth-child(5) {
        top: 75%;
        left: 15%;
      }
      &:nth-child(6) {
        top: 63%;
        left: 30%;
        transform: scale(0.6);
      }
      &:nth-child(7) {
        top: 87%;
        left: 67%;
        transform: scale(1.8);
      }
      &:nth-child(8) {
        top: 50%;
        left: 45%;
      }
      &:nth-child(9) {
        top: 25%;
        left: 5%;
        transform: scale(0.85);
      }
      &:nth-child(10) {
        top: 55%;
        left: 80%;
      }
      &:nth-child(11) {
        top: 35%;
        left: 80%;
      }
      &:nth-child(12) {
        top: 33%;
        left: 30%;
        transform: scale(1.5);
      }
      &:nth-child(13) {
        top: 66%;
        left: 4%;
        transform: scale(1.5);
      }
    }
  }
}
</style>
