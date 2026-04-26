<template>
  <nav class="nav">
    <div class="logo">{{ vBandName1 }}</div>

    <div class="links">
      <router-link to="/">Home</router-link>
      <router-link to="/shows">Shows</router-link>
      <router-link to="/songs">Songs</router-link>
      <!-- <router-link to="/members">Members</router-link> -->
      <router-link to="/band">Band</router-link>
      <!-- <router-link to="/merch">Merch</router-link> -->
    </div>
  </nav>
  <SocialLinks />
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import SocialLinks from './social-links.vue'

const vRoute = useRoute()
const vBandName1 = computed(() => (vRoute.path !== '/' ? 'ISSUED FOR DESTRUCTION' : ''))

// console.log('path:', vRoute.path)
// console.log('name:', vRoute.name)
</script>
<style scoped>
.nav {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 18px 40px;
  display: flex;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 10;
  box-sizing: border-box;
}

.logo {
  font-size: 0.9rem;
  letter-spacing: 3px;
  opacity: 0.8;
}

.links a {
  margin-left: 25px;
  text-decoration: none;
  color: #aaa;
  font-size: 0.9rem;
  transition: 0.2s;
}

.links a:hover {
  color: white;
}

.links a.router-link-active {
  color: white;
}
</style>
