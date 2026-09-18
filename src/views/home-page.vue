<script setup>
import { computed } from 'vue'
import { content, formatDate } from '../lib/content'
const latest = computed(() =>
  [...content.news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3),
)
const upcoming = new Date() < new Date('2026-09-20T00:00:00+02:00')
</script>
<template>
  <section class="hero">
    <div class="hero-art" aria-hidden="true"><img src="/Logo.png" alt="" /></div>
    <div class="hero-content wrap">
      <p class="eyebrow"><span class="red-dot"></span> IN DISTORTION WE TRUST · EST. 2016</p>
      <h1>ISSUED FOR<br /><span>DESTRUCTION.</span></h1>
      <p class="hero-tagline">Probably the worst band in the world.</p>
      <div class="actions">
        <router-link class="button primary" to="/songs">Turn it up <span>↗</span></router-link
        ><router-link class="button" to="/shows">Catch us live <span>→</span></router-link>
      </div>
      <div class="hero-bottom">
        <span>HEAVY RIFFS. NO APOLOGIES.</span><a href="#latest">ENTER THE NOISE ↓</a>
      </div>
    </div>
  </section>
  <div class="ticker" aria-hidden="true">
    <span>FORGED IN DISTORTION</span> ✳ <span>DRIVEN BY CHAOS</span> ✳
    <span>ISSUED FOR DESTRUCTION</span> ✳
  </div>
  <section id="latest" class="section wrap">
    <div class="section-heading">
      <div>
        <p class="eyebrow">01 / FROM THE BAND</p>
        <h2>Latest noise<span>.</span></h2>
      </div>
      <router-link class="text-link" to="/news">All news ↗</router-link>
    </div>
    <div v-if="latest.length" class="news-grid">
      <router-link
        v-for="story in latest"
        :key="story.id"
        :to="'/news/' + story.id"
        class="news-card"
        ><div class="news-image">
          <img :src="story.image || '/Logo.png'" :alt="story.title" loading="lazy" />
        </div>
        <p class="eyebrow">{{ formatDate(story.date) }}</p>
        <h3>{{ story.title }}</h3>
        <p>{{ story.excerpt }}</p>
        <span class="text-link">Read story ↗</span></router-link
      >
    </div>
    <div v-else class="announcement">
      <div>
        <span class="eyebrow">THE NEXT CHAPTER</span>
        <h3>Something heavy is brewing.</h3>
        <p>News from the rehearsal room, the stage, and everything in between. Watch this space.</p>
      </div>
      <a
        class="text-link"
        href="https://www.facebook.com/multimetalmaniacs"
        target="_blank"
        rel="noopener noreferrer"
        >Follow the band ↗</a
      >
    </div>
  </section>
  <section class="live-band">
    <div class="wrap live-feature">
      <div>
        <p class="eyebrow">02 / IN THE FLESH</p>
        <h2>LOUDER<br />IN PERSON.</h2>
        <p>Heavy riffs hit different in the front row.</p>
      </div>
      <div class="gig-card">
        <p class="eyebrow">{{ upcoming ? 'NEXT SHOW' : 'PAST SHOW' }} / 19 SEPTEMBER 2026</p>
        <h3>Fest I Hallen</h3>
        <p>Skjold City</p>
        <a
          class="button primary"
          href="https://fb.me/2gh4anCjlQQ83Do"
          target="_blank"
          rel="noopener noreferrer"
          >{{ upcoming ? 'Event & tickets ↗' : 'View event ↗' }}</a
        ><router-link class="text-link" to="/shows">All live dates →</router-link>
      </div>
    </div>
  </section>
  <section class="section wrap band-teaser">
    <div>
      <p class="eyebrow">03 / THE PEOPLE BEHIND THE NOISE</p>
      <h2>Five members.<br />One shared chaos.</h2>
    </div>
    <div>
      <p>
        It started with a jam in 2016. A shared love for heavy riffs became Issued For Destruction.
        This is our story.
      </p>
      <router-link class="text-link" to="/band">Meet the band ↗</router-link>
    </div>
  </section>
</template>
