<script setup>
import { computed } from 'vue'
import { content, contentStatus, formatDate, loadContent } from '../lib/content'
import { groupShows } from '../lib/shows'
const groups = computed(() => groupShows(content.shows))
const headings = { upcoming: 'Upcoming shows', past: 'Past shows', cancelled: 'Cancelled shows' }
</script>
<template>
  <div class="wrap page">
    <p class="eyebrow">IN THE FLESH</p>
    <h1>LOUDER <span>LIVE.</span></h1>
    <p class="page-intro">See you at the front.</p>
    <p v-if="contentStatus.error" role="status">
      {{ contentStatus.error }} <button class="text-link" @click="loadContent">Retry</button>
    </p>
    <p v-if="!groups.upcoming.length">No upcoming shows announced. Check back for new dates.</p>
    <template v-for="(shows, group) in groups" :key="group">
      <section v-if="shows.length" class="section">
        <h2>{{ headings[group] }}</h2>
        <div v-for="show in shows" :key="show.id" class="show-row">
          <time class="show-date" :datetime="show.date"
            ><strong>{{ show.date.slice(8) }}</strong
            ><span>{{ formatDate(show.date).split(' ').slice(1).join(' ') }}</span></time
          >
          <div>
            <h3>{{ show.title }}</h3>
            <p>{{ show.location }}</p>
            <p v-if="show.status === 'cancelled'" class="eyebrow">Cancelled</p>
            <p v-else-if="show.status === 'done'" class="eyebrow">Done</p>
          </div>
          <a
            v-if="show.url"
            class="button"
            :href="show.url"
            target="_blank"
            rel="noopener noreferrer"
            >{{ group === 'upcoming' ? 'Event & tickets ↗' : 'View event ↗' }}</a
          >
        </div>
      </section>
    </template>
    <div class="announcement">
      <div>
        <p class="eyebrow">BRING THE NOISE TO YOUR CITY</p>
        <h3>Want us on your stage?</h3>
        <p>Get in touch with the band for bookings.</p>
      </div>
      <a
        class="button primary"
        href="https://www.facebook.com/multimetalmaniacs"
        target="_blank"
        rel="noopener noreferrer"
        >Contact the band ↗</a
      >
    </div>
  </div>
</template>
