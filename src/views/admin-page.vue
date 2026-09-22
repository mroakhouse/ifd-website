<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import {
  login,
  logout,
  getUser,
  handleAuthCallback,
  acceptInvite,
  updateUser,
  requestPasswordRecovery,
} from '@netlify/identity'
import { loadContent } from '../lib/content'

// Refs hold changing values that Vue uses to update the page. In this script,
// read or change them through .value; the template unwraps them automatically.
// user is the signed-in account; loading covers startup and busy covers an action.
// error and notice contain the failure or success message shown beside the controls.

const user = ref(null),
  loading = ref(true),
  busy = ref(false),
  error = ref(''),
  notice = ref('')

// Authentication form values. mode chooses login, recover (send a reset link),
// reset (set a new password), or invite (accept an invitation using inviteToken).

const email = ref(''),
  password = ref(''),
  mode = ref('login'),
  inviteToken = ref('')

// data is the editable content. version identifies the server copy we loaded so
// saving can detect another editor's changes. baseline is our last saved snapshot.
// tab chooses a section, selected holds an entry ID, and preview shows a news preview.

const data = ref(null),
  version = ref(null),
  baseline = ref(''),
  tab = ref('news'),
  selected = ref(null),
  preview = ref(false)

// Computed values update when their reactive inputs change.
// Compare the whole content snapshot to detect edits, additions, and removals.

const dirty = computed(() => data.value && JSON.stringify(data.value) !== baseline.value)

// Look up the selected entry so form fields edit that object directly.

const item = computed(() =>
  tab.value === 'story'
    ? null
    : data.value?.[tab.value]?.find((entry) => entry.id === selected.value),
)

const sections = {
  news: 'News stories',
  members: 'Band members',
  shows: 'Live shows',
  music: 'Music',
  story: 'Band story',
}

const entryName = computed(
  () =>
    ({ news: 'news story', members: 'member', shows: 'show', music: 'music release' })[tab.value],
)

function entryDetail(entry) {
  if (tab.value === 'news') return entry.published ? 'Published' : 'Draft'
  if (tab.value === 'shows') return `${entry.date} / ${entry.status}`
  return tab.value === 'music' ? entry.platform : entry.role
}

// Controls editor visibility; the server also checks permissions on API requests.

const isAdmin = computed(() => user.value?.roles?.includes('admin'))

// Send an editor request and turn API failures into messages that run() can display.

async function api(options) {
  const response = await fetch('/api/content?admin=1', options)
  // A plain Vite server may return HTML here because it cannot run Netlify Functions.
  if (!response.headers.get('content-type')?.includes('application/json'))
    throw new Error(
      'The editor needs Netlify Functions. Use your deployed site or netlify dev. See README.md for setup.',
    )
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'Request failed.')
  return result
}

// Load editable content, including drafts, and mark this copy as the saved baseline.

async function read() {
  const result = await api()
  data.value = result.content
  version.value = result.version
  baseline.value = JSON.stringify(data.value)
}
// Give asynchronous actions the same busy state and error handling. finally clears
// busy whether the action succeeds or fails, allowing the user to try again.
async function run(action) {
  busy.value = true
  error.value = ''
  notice.value = ''
  try {
    await action()
  } catch (e) {
    error.value = e.message || 'Something went wrong. Please try again.'
  } finally {
    busy.value = false
  }
}
// On first display, process invitation/password-reset links before restoring the
// account. Load the editor only when an admin is in the normal login mode.
onMounted(async () => {
  await run(async () => {
    const callback = await handleAuthCallback()
    if (callback?.type === 'invite') {
      mode.value = 'invite'
      inviteToken.value = callback.token
    }
    if (callback?.type === 'recovery') mode.value = 'reset'
    user.value = await getUser()
    if (isAdmin.value && mode.value === 'login') await read()
  })
  loading.value = false
})
// Reuse the form for signing in, accepting an invite, and password recovery.
async function submitAuth() {
  await run(async () => {
    if (mode.value === 'recover') {
      await requestPasswordRecovery(email.value)
      notice.value = 'If an account exists for this email, you will receive a password reset link.'
      return
    }
    if (mode.value === 'invite') user.value = await acceptInvite(inviteToken.value, password.value)
    else if (mode.value === 'reset') {
      await updateUser({ password: password.value })
      user.value = await getUser()
    } else user.value = await login(email.value, password.value)
    // Clear the password from form state once authentication/password setup succeeds.
    password.value = ''
    mode.value = 'login'
    if (isAdmin.value) await read()
  })
}
// Switch between login and requesting a reset link, clearing old feedback.
function toggleRecovery() {
  mode.value = mode.value === 'login' ? 'recover' : 'login'
  error.value = ''
  notice.value = ''
}
// Open an entry in edit mode, even if the previous entry was being previewed.
function selectEntry(id) {
  selected.value = id
  preview.value = false
}
// Clear entry-specific state when moving to a different content section.
function chooseTab(value) {
  tab.value = value
  selected.value = null
  preview.value = false
}
// Create and select a local entry at the top of the list. New news starts as a
// private draft; entries are sent to the server when Save changes is clicked.
function add() {
  const id = crypto.randomUUID()
  const entry =
    tab.value === 'news'
      ? {
          id,
          title: '',
          date: new Date().toISOString().slice(0, 10),
          excerpt: '',
          body: '',
          image: '',
          published: false,
        }
      : tab.value === 'shows'
        ? {
            id,
            title: '',
            date: new Date().toISOString().slice(0, 10),
            location: '',
            url: '',
            status: 'upcoming',
          }
        : tab.value === 'music'
          ? { id, title: '', description: '', image: '', platform: '', url: '', videoUrl: '' }
          : { id, name: '', role: '', bio: '', image: '' }
  data.value[tab.value].unshift(entry)
  selected.value = id
  preview.value = false
}
// Remove the selected entry from the local copy after confirmation. Saving makes
// the removal permanent on the server.
function remove() {
  if (
    !window.confirm('Remove this ' + entryName.value + '? The change takes effect when you save.')
  )
    return
  data.value[tab.value] = data.value[tab.value].filter((entry) => entry.id !== selected.value)
  selected.value = null
}

// Save all sections together, sending the version to avoid overwriting a newer
// server copy. Use the returned content as the new baseline after a successful save.

async function save() {
  await run(async () => {
    const result = await api({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: data.value, version: version.value }),
    })
    data.value = result.content
    version.value = result.version
    baseline.value = JSON.stringify(data.value)
    notice.value = 'Saved. Published content is now live; drafts stay private.'

    // Refresh the shared public content used by the other pages in this session.
    await loadContent()
  })
}

// Confirm before abandoning edits, then end the session and clear editor content.
async function signOut() {
  if (dirty.value && !window.confirm('Discard unsaved changes and log out?')) return
  await run(async () => {
    await logout()
    user.value = null
    data.value = null
    baseline.value = ''
    selected.value = null
  })
}

// Ask the browser to warn about unsaved edits when the tab is closed or reloaded.
function beforeUnload(event) {
  if (dirty.value) {
    event.preventDefault()
    event.returnValue = ''
  }
}

// Remove the browser listener when this page is destroyed. The router guard below
// provides the equivalent warning for navigation within the website.
window.addEventListener('beforeunload', beforeUnload)

onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))

onBeforeRouteLeave(() => !dirty.value || window.confirm('Leave and discard unsaved changes?'))
</script>

<template>
  <div class="wrap page">
    <p v-if="loading" role="status">Opening the backstage door…</p>
    <template v-else>
      <div v-if="!user || mode !== 'login'" class="login-layout">
        <div>
          <p class="eyebrow">FOR THE PEOPLE BEHIND THE NOISE</p>
          <h1>BACK<span>STAGE.</span></h1>
          <p class="page-intro">Your band. Your stories. Your next chapter.</p>
          <p>Log in to publish news and keep the band up to date.</p>
          <router-link class="text-link" to="/">← Back to the website</router-link>
        </div>
        <form class="login-panel" @submit.prevent="submitAuth">
          <p class="eyebrow">BAND ACCESS</p>
          <h2>
            {{
              mode === 'recover'
                ? 'Reset your password'
                : ['invite', 'reset'].includes(mode)
                  ? 'Set your password'
                  : 'Welcome back.'
            }}
          </h2>
          <label v-if="['login', 'recover'].includes(mode)" class="field"
            >Email address<input v-model="email" type="email" autocomplete="username" required
          /></label>
          <label v-if="mode !== 'recover'" class="field"
            >Password<input
              v-model="password"
              type="password"
              :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
              :minlength="mode === 'login' ? 1 : 12"
              required
            /><small v-if="mode !== 'login'">Use at least 12 characters.</small></label
          >
          <p v-if="error" role="alert" class="notice">{{ error }}</p>
          <p v-if="notice" role="status" class="notice success">{{ notice }}</p>
          <button class="button primary" :disabled="busy">
            {{
              busy
                ? 'Please wait…'
                : mode === 'recover'
                  ? 'Send reset link'
                  : mode === 'login'
                    ? 'Log in →'
                    : 'Save password →'
            }}
          </button>
          <p v-if="['login', 'recover'].includes(mode)">
            <button type="button" class="text-link" @click="toggleRecovery">
              {{ mode === 'login' ? 'Forgot your password?' : 'Back to login' }}
            </button>
          </p>
          <p class="login-help">
            Access is by invitation. Use the email invited by your site owner.
          </p>
        </form>
      </div>
      <template v-else>
        <div class="admin-bar">
          <div>
            <p class="eyebrow">BACKSTAGE / {{ user.email }}</p>
            <h1>Band <span>control.</span></h1>
          </div>
          <button class="button" :disabled="busy" @click="signOut">Log out</button>
        </div>
        <p v-if="!isAdmin" class="notice">
          Your account needs the admin role. The site owner can assign it in Netlify Identity.
        </p>
        <p v-if="error" role="alert" class="notice">{{ error }}</p>
        <p v-if="notice" role="status" class="notice success">{{ notice }}</p>
        <button v-if="isAdmin && !data" class="button" :disabled="busy" @click="run(read)">
          Load editor
        </button>
        <template v-if="data && isAdmin">
          <div class="admin-bar">
            <p>{{ dirty ? 'You have unsaved changes.' : 'All changes saved.' }}</p>
            <button class="button primary" :disabled="busy || !dirty" @click="save">
              {{ busy ? 'Saving…' : 'Save changes ↗' }}
            </button>
          </div>
          <div class="admin-tabs" aria-label="Content sections">
            <button
              v-for="(label, section) in sections"
              :key="section"
              :aria-pressed="tab === section"
              @click="chooseTab(section)"
            >
              {{ label }}
            </button>
          </div>
          <fieldset :disabled="busy" class="editor-fieldset">
            <div v-if="tab === 'story'" class="editor-panel">
              <h2>Our story</h2>
              <label class="field"
                >Band biography<textarea v-model="data.story" rows="14" maxlength="20000" />
              </label>
            </div>
            <div v-else class="editor-layout">
              <aside class="editor-list">
                <button class="button" @click="add">+ Add {{ entryName }}</button
                ><button
                  v-for="entry in data[tab]"
                  :key="entry.id"
                  class="editor-item"
                  :class="{ selected: entry.id === selected }"
                  @click="selectEntry(entry.id)"
                >
                  {{ entry.title || entry.name || 'Untitled'
                  }}<small>{{ entryDetail(entry) }}</small>
                </button>
                <p v-if="!data[tab].length">Nothing here yet. Add your first {{ entryName }}.</p>
              </aside>
              <div v-if="item" class="editor-panel">
                <template v-if="tab === 'news'"
                  ><h2>Edit news story</h2>
                  <label class="field"
                    >Title<input v-model="item.title" maxlength="180" required
                  /></label>
                  <div class="form-row">
                    <label class="field"
                      >Date<input v-model="item.date" type="date" required /></label
                    ><label class="field"
                      >Image URL (optional)<input
                        v-model="item.image"
                        placeholder="https://… or /members/…"
                        maxlength="2000"
                    /></label>
                  </div>
                  <label class="field"
                    >Short introduction<textarea
                      v-model="item.excerpt"
                      rows="2"
                      maxlength="500"
                    /></label
                  ><label class="field"
                    >Story<textarea
                      v-model="item.body"
                      rows="12"
                      maxlength="30000"
                      required
                    /><small
                      >Separate paragraphs with a blank line. Text is displayed safely without
                      HTML.</small
                    ></label
                  ><label class="checkbox"
                    ><input v-model="item.published" type="checkbox" /> Publish on the website when
                    saved</label
                  ><button class="text-link" @click="preview = !preview">
                    {{ preview ? 'Hide preview' : 'Preview story' }}
                  </button>
                  <article v-if="preview" class="preview-story">
                    <h3>{{ item.title || 'Untitled' }}</h3>
                    <p>{{ item.excerpt }}</p>
                    <p>{{ item.body }}</p>
                  </article></template
                >
                <template v-else-if="tab === 'shows'">
                  <h2>Edit live show</h2>
                  <label class="field"
                    >Show / event name<input v-model="item.title" maxlength="180" required
                  /></label>
                  <div class="form-row">
                    <label class="field"
                      >Date<input v-model="item.date" type="date" required
                    /></label>
                    <label class="field"
                      >Status<select v-model="item.status">
                        <option value="upcoming">Upcoming</option>
                        <option value="done">Done</option>
                        <option value="cancelled">Cancelled</option>
                      </select></label
                    >
                  </div>
                  <label class="field"
                    >Venue / location<input v-model="item.location" maxlength="200" required
                  /></label>
                  <label class="field"
                    >Event / tickets URL (optional)<input
                      v-model="item.url"
                      type="url"
                      placeholder="https://…"
                      maxlength="2000"
                  /></label>
                  <p>
                    Past dates appear under past shows automatically. Done and cancelled shows are
                    never promoted as upcoming.
                  </p>
                </template>
                <template v-else-if="tab === 'music'">
                  <h2>Edit music release</h2>
                  <label class="field"
                    >Title<input v-model="item.title" maxlength="180" required
                  /></label>
                  <label class="field"
                    >Description<textarea v-model="item.description" rows="5" maxlength="5000" />
                  </label>
                  <label class="field"
                    >Artwork URL (optional)<input
                      v-model="item.image"
                      maxlength="2000"
                      placeholder="https://… or /Logo.png"
                    /><small
                      >Use an HTTPS image link or an existing local image. Blank uses the band
                      logo.</small
                    ></label
                  >
                  <label class="field"
                    >Listening platform<input
                      v-model="item.platform"
                      maxlength="80"
                      placeholder="SoundCloud, Spotify, Bandcamp…"
                      required
                  /></label>
                  <label class="field"
                    >Listening URL<input
                      v-model="item.url"
                      type="url"
                      maxlength="2000"
                      placeholder="https://…"
                      required
                  /></label>
                  <label class="field"
                    >Video URL (optional)<input
                      v-model="item.videoUrl"
                      type="url"
                      maxlength="2000"
                      placeholder="https://…"
                  /></label>
                  <p>
                    Releases appear on the music page in the order shown here, with new entries
                    first.
                  </p>
                </template>
                <template v-else
                  ><h2>Edit band member</h2>
                  <label class="field"
                    >Name<input v-model="item.name" maxlength="100" required /></label
                  ><label class="field"
                    >Instrument / role<input v-model="item.role" maxlength="150" required /></label
                  ><label class="field"
                    >Photo URL<input
                      v-model="item.image"
                      placeholder="https://… or /members/…"
                      maxlength="2000"
                    /><small
                      >Use an HTTPS image link or an existing image in /members/.</small
                    ></label
                  ><img
                    v-if="
                      item.image && (/^https:\/\//.test(item.image) || /^\/(?!\/)/.test(item.image))
                    "
                    class="editor-preview"
                    :src="item.image"
                    :alt="item.name" /><label class="field"
                    >Biography<textarea v-model="item.bio" rows="7" maxlength="5000" /></label
                ></template>
                <p>
                  <button class="text-link danger" @click="remove">Remove {{ entryName }}</button>
                </p>
              </div>
              <div v-else class="empty-state">
                <h3>{{ sections[tab] }}</h3>
                <p>
                  Select an item to edit or add a new one. Changes become public when you save;
                  unpublished news stays private.
                </p>
              </div>
            </div>
          </fieldset>
        </template>
      </template>
    </template>
  </div>
</template>
<style scoped>
.editor-fieldset {
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
}
.login-help {
  font-size: 12px;
  margin-top: 25px;
}
</style>
