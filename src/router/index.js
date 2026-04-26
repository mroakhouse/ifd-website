import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/home-page.vue'
import Shows from '../views/shows-page.vue'
import Songs from '../views/songs-page.vue'
import Merch from '../views/merch-page.vue'
import Members from '../views/members-page.vue'
import Band from '../views/band-page.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/shows', component: Shows },
  { path: '/songs', component: Songs },
  { path: '/merch', component: Merch },
  { path: '/members', component: Members },
  { path: '/band', component: Band },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
