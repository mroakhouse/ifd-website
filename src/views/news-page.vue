<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { content, contentStatus, formatDate, loadContent } from '../lib/content'
const route = useRoute()
const stories = computed(() => [...content.news].sort((a, b) => b.date.localeCompare(a.date)))
const story = computed(() => content.news.find((item) => item.id === route.params.id))
</script>
<template>
  <div class="wrap page">
    <p class="eyebrow">DISPATCHES FROM THE BAND</p>
    <template v-if="route.params.id && story"
      ><router-link class="text-link" to="/news">← All news</router-link>
      <article class="article">
        <p class="eyebrow">{{ formatDate(story.date) }}</p>
        <h1>{{ story.title }}</h1>
        <p class="page-intro">{{ story.excerpt }}</p>
        <img v-if="story.image" class="article-image" :src="story.image" :alt="story.title" />
        <div class="prose">
          <p v-for="(paragraph, index) in story.body.split('\n\n')" :key="index">{{ paragraph }}</p>
        </div>
      </article></template
    >
    <template v-else
      ><h1>LATEST <span>NOISE.</span></h1>
      <p v-if="contentStatus.error" role="status">
        {{ contentStatus.error }} <button class="text-link" @click="loadContent">Retry</button>
      </p>
      <div v-if="route.params.id" class="announcement">
        <h2>Story not found.</h2>
        <router-link to="/news" class="text-link">View all news →</router-link>
      </div>
      <div v-else-if="!stories.length" class="announcement">
        <div>
          <h2>Something heavy is brewing.</h2>
          <p>Check back for updates from the band. Until then, follow the noise on our socials.</p>
        </div>
      </div>
      <div v-else class="news-grid section">
        <router-link
          v-for="item in stories"
          :key="item.id"
          class="news-card"
          :to="'/news/' + item.id"
          ><div class="news-image">
            <img :src="item.image || '/Logo.png'" :alt="item.title" loading="lazy" />
          </div>
          <p class="eyebrow">{{ formatDate(item.date) }}</p>
          <h2>{{ item.title }}</h2>
          <p>{{ item.excerpt }}</p>
          <span class="text-link">Read story ↗</span></router-link
        >
      </div></template
    >
  </div>
</template>
