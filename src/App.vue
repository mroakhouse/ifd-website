<template>
  <div :class="['app', isHome ? 'home' : 'subpage']">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from './components/navbar-comp.vue'

const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: black;
  color: #eaeaea;
}

.app {
  position: relative;
  min-height: 100vh;
}

/* 🔥 BACKGROUND IMAGE LAYER */
.app::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/src/assets/logo.png');
  background-size: cover;
  background-position: center;
  z-index: -2;
  box-sizing: border-box;
}

/* 🔥 OVERLAY LAYER */
.app::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  box-sizing: border-box;

  /* IMPORTANT */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  /* default */
  background: rgba(0, 0, 0, 0.75);
}

/* 🏠 HOME = PURE BLACK */
.home::before {
  background-image: none; /* 👈 remove logo */
}

.home::after {
  background: black; /* 👈 clean look */
  backdrop-filter: none;
}

/* SUBPAGES (darker) */
.subpage::after {
  background: rgba(0, 0, 0, 0.8);
}
</style>
