<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const open = ref(false)
const route = useRoute()

watch(
  () => route.path,
  () => {
    open.value = false
  },
)
</script>

<template>
  <header class="site-header">
    <nav class="nav wrap" aria-label="Main navigation">
      <router-link to="/" class="wordmark" aria-label="Issued For Destruction home"
        >ISSUED FOR<br />DESTRUCTION<span>HEAVY. LOUD. UNFILTERED.</span></router-link
      >
      <button
        class="menu-toggle"
        :aria-expanded="open"
        aria-controls="navigation"
        @click="open = !open"
      >
        {{ open ? 'Close ×' : 'Menu +' }}
      </button>
      <div id="navigation" class="nav-links" :class="{ open }">
        <router-link to="/">Home</router-link><router-link to="/news">News</router-link
        ><router-link to="/songs">Music</router-link><router-link to="/shows">Live</router-link
        ><router-link to="/band">The band</router-link>
        <a
          class="nav-listen"
          href="https://www.youtube.com/@IssuedForDestruction"
          target="_blank"
          rel="noopener noreferrer"
          >Listen ↗</a
        >
      </div>
    </nav>
  </header>
</template>
