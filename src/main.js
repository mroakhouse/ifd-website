import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
// Invitation and recovery emails may land on the homepage. Keep their hash intact.
if (
  /^#(invite_token|recovery_token|confirmation_token|access_token|email_change_token)=/.test(
    window.location.hash,
  ) &&
  window.location.pathname !== '/admin'
) {
  window.location.replace('/admin' + window.location.hash)
} else {
  createApp(App).use(router).mount('#app')
}
