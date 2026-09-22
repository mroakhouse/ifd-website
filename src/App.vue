<script setup>
import { onMounted } from 'vue'
import Navbar from './components/navbar-comp.vue'
import SocialLinks from './components/social-links.vue'
import { loadContent } from './lib/content'
onMounted(loadContent)
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <Navbar />
  <main id="main">
    <router-view />
  </main>
  <footer class="footer wrap">
    <router-link class="wordmark" to="/"
      >ISSUED FOR<br />DESTRUCTION<span>EST. 2016</span></router-link
    >
    <SocialLinks />
    <div class="footer-meta">
      <span>© {{ new Date().getFullYear() }} Issued For Destruction</span
      ><router-link to="/admin">Band login ↗</router-link>
    </div>
  </footer>
</template>
