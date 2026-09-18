import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home-page.vue'
export default createRouter({
  history: createWebHistory(),
  scrollBehavior(to) {
    return to.hash ? { el: to.hash } : { top: 0 }
  },
  routes: [
    { path: '/', component: Home },
    { path: '/shows', component: () => import('../views/shows-page.vue') },
    { path: '/songs', component: () => import('../views/songs-page.vue') },
    { path: '/band', component: () => import('../views/band-page.vue') },
    { path: '/members', redirect: '/band' },
    { path: '/merch', component: () => import('../views/merch-page.vue') },
    { path: '/news/:id?', component: () => import('../views/news-page.vue') },
    { path: '/admin', component: () => import('../views/admin-page.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('../views/not-found.vue') },
  ],
})
