<script setup>
import { content, contentStatus, loadContent } from '../lib/content'
</script>
<template>
  <div class="wrap page">
    <p class="eyebrow">THE SOUND OF DESTRUCTION</p>
    <h1>TURN IT <span>UP.</span></h1>
    <p v-if="contentStatus.error" role="status">
      {{ contentStatus.error }} <button class="text-link" @click="loadContent">Retry</button>
    </p>
    <p v-if="!content.music.length" class="page-intro">
      New music is on the way. Check back for releases.
    </p>
    <div v-for="release in content.music" :key="release.id" class="music-feature">
      <div class="album-art">
        <img :src="release.image || '/Logo.png'" :alt="release.title + ' artwork'" loading="lazy" />
      </div>
      <div>
        <p class="eyebrow">LISTEN ON {{ release.platform }}</p>
        <h2>{{ release.title }}</h2>
        <p class="release-description">{{ release.description }}</p>
        <a class="button primary" :href="release.url" target="_blank" rel="noopener noreferrer"
          >▶ Play on {{ release.platform }}</a
        ><a
          v-if="release.videoUrl"
          class="text-link"
          :href="release.videoUrl"
          target="_blank"
          rel="noopener noreferrer"
          >Watch video ↗</a
        >
      </div>
    </div>
    <div class="announcement">
      <div>
        <p class="eyebrow">IN THE WORKS</p>
        <h3>Issued For Destruction</h3>
        <p>Unreleased. Follow the band for release announcements.</p>
      </div>
      <router-link class="text-link" to="/news">Band news →</router-link>
    </div>
  </div>
</template>
<style scoped>
.release-description {
  white-space: pre-wrap;
}
</style>
