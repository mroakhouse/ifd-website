import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createContentHandler, validateContent } from '../netlify/lib/content-handler.js'
import defaults from '../src/content/defaults.json' with { type: 'json' }
import { groupShows } from '../src/lib/shows.js'

function fixture(user = { roles: ['admin'] }) {
  let stored = null
  const store = {
    getWithMetadata: async () => stored,
    setJSON: async (key, data, options) => {
      if (
        (options.onlyIfNew && stored) ||
        (options.onlyIfMatch && options.onlyIfMatch !== stored?.etag)
      )
        return { modified: false }
      stored = { data, etag: String(Number(stored?.etag || 0) + 1) }
      return { modified: true, etag: stored.etag }
    },
  }
  const handle = createContentHandler({ getUser: async () => user, getStore: () => store })
  return { handle, store }
}
const seed = () => ({
  ...structuredClone(defaults),
  news: [
    {
      id: 'one',
      title: 'First story',
      date: '2026-09-18',
      excerpt: 'News',
      body: 'New story',
      image: '',
      published: false,
    },
  ],
})
const write = (content, version = null, origin = 'https://band.test') =>
  new Request('https://band.test/api/content', {
    method: 'PUT',
    headers: { origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, version }),
  })
const read = (admin) => new Request('https://band.test/api/content' + (admin ? '?admin=1' : ''))

test('public fallback contains band content and no drafts', async () => {
  const { handle } = fixture(null)
  const result = await handle(read())
  assert.equal(result.status, 200)
  assert.equal(result.headers.get('cache-control'), 'no-store')
  assert.deepEqual(await result.json(), defaults)
})
test('unauthenticated and non-admin users cannot read drafts or save', async () => {
  for (const [user, status] of [
    [null, 401],
    [{ roles: ['member'], userMetadata: { roles: ['admin'] } }, 403],
  ]) {
    const { handle } = fixture(user)
    assert.equal((await handle(read(true))).status, status)
    assert.equal((await handle(write(seed()))).status, status)
  }
})
test('cross-origin and missing-origin writes are denied', async () => {
  const { handle } = fixture()
  assert.equal((await handle(write(seed(), null, 'https://evil.test'))).status, 403)
  const request = write(seed())
  request.headers.delete('origin')
  assert.equal((await handle(request)).status, 403)
})
test('draft save, member edit, publish, persistence, conflict and removal', async () => {
  const { handle } = fixture()
  const data = seed()
  data.members[0].bio = 'Updated biography'
  assert.equal((await handle(write(data))).status, 200)
  let result = await (await handle(read())).json()
  assert.equal(result.news.length, 0)
  assert.equal(result.members[0].bio, 'Updated biography')
  const privateData = await (await handle(read(true))).json()
  assert.equal(privateData.content.news.length, 1)
  data.news[0].published = true
  assert.equal((await handle(write(data, privateData.version))).status, 200)
  assert.equal((await handle(write(data, privateData.version))).status, 409)
  assert.equal((await handle(write(data))).status, 409)
  result = await (await handle(read())).json()
  assert.equal(result.news[0].title, 'First story')
  data.news = []
  assert.equal((await handle(write(data, '2'))).status, 200)
  assert.equal((await (await handle(read())).json()).news.length, 0)
})
test('rejects bad data, unsafe URLs, impossible dates and duplicate IDs', () => {
  for (const mutate of [
    (d) => {
      d.news[0].image = 'javascript:alert(1)'
    },
    (d) => {
      d.news[0].date = '2026-02-31'
    },
    (d) => {
      d.news[0].published = 'true'
    },
    (d) => {
      d.members[0].id = d.news[0].id
    },
    (d) => {
      d.news[0].body = ''
    },
  ]) {
    const data = seed()
    mutate(data)
    assert.throws(() => validateContent(data))
  }
  assert.doesNotThrow(() => validateContent(seed()))
})
test('malformed JSON and unavailable storage return explicit failures', async () => {
  const { handle } = fixture()
  assert.equal(
    (
      await handle(
        new Request('https://band.test/api/content', {
          method: 'PUT',
          headers: { origin: 'https://band.test', 'Content-Type': 'application/json' },
          body: '{',
        }),
      )
    ).status,
    400,
  )
  const failing = createContentHandler({
    getUser: async () => null,
    getStore: () => {
      throw new Error('Offline')
    },
  })
  assert.equal((await failing(read())).status, 503)
})

test('legacy saved content gains shows and music without replacing existing edits or empty lists', async () => {
  const { handle, store } = fixture()
  const legacy = seed()
  delete legacy.shows
  delete legacy.music
  legacy.story = 'Existing band biography'
  await store.setJSON('content', legacy, { onlyIfNew: true })
  const result = await (await handle(read(true))).json()
  assert.equal(result.content.story, legacy.story)
  assert.deepEqual(result.content.shows, defaults.shows)
  assert.deepEqual(result.content.music, defaults.music)
  result.content.shows = []
  result.content.music = []
  assert.equal((await handle(write(result.content, result.version))).status, 200)
  const publicData = await (await handle(read())).json()
  assert.deepEqual(publicData.shows, [])
  assert.deepEqual(publicData.music, [])
})

test('shows and music can be added, edited, marked done or cancelled, and removed', async () => {
  const { handle } = fixture()
  const data = seed()
  data.shows.push({ ...data.shows[0], id: 'new-show', title: 'Next gig', date: '2027-01-01' })
  data.music.unshift({ ...data.music[0], id: 'new-release', title: 'New music' })
  assert.equal((await handle(write(data))).status, 200)
  let result = await (await handle(read())).json()
  assert.equal(result.shows[1].title, 'Next gig')
  assert.equal(result.music[0].title, 'New music')
  data.shows[0].status = 'done'
  data.shows[1].status = 'cancelled'
  data.music[0].url = 'https://example.com/new-track'
  assert.equal((await handle(write(data, '1'))).status, 200)
  result = await (await handle(read())).json()
  assert.deepEqual(
    result.shows.map((show) => show.status),
    ['done', 'cancelled'],
  )
  assert.equal(result.music[0].url, 'https://example.com/new-track')
  data.shows.pop()
  data.music.shift()
  assert.equal((await handle(write(data, '2'))).status, 200)
  result = await (await handle(read())).json()
  assert.equal(result.shows.length, 1)
  assert.equal(result.music.length, 1)
})

test('rejects invalid show and music fields through the save endpoint', async () => {
  const { handle } = fixture()
  for (const mutate of [
    (d) => {
      d.shows[0].date = '2026-02-30'
    },
    (d) => {
      d.shows[0].status = 'unknown'
    },
    (d) => {
      d.shows[0].title = ''
    },
    (d) => {
      d.shows[0].url = 'javascript:alert(1)'
    },
    (d) => {
      d.music[0].url = ''
    },
    (d) => {
      d.music[0].url = 'javascript:alert(1)'
    },
    (d) => {
      d.music[0].videoUrl = 'data:text/html,bad'
    },
    (d) => {
      d.music[0].image = '//evil.test/image.png'
    },
    (d) => {
      d.music[0].id = d.shows[0].id
    },
    (d) => {
      d.shows = null
    },
    (d) => {
      d.music = {}
    },
  ]) {
    const data = seed()
    mutate(data)
    assert.equal((await handle(write(data))).status, 400)
  }
})

test('show groups respect Oslo dates, explicit statuses and chronological order', () => {
  const shows = [
    { id: 'later', date: '2026-10-01', status: 'upcoming' },
    { id: 'today', date: '2026-09-20', status: 'upcoming' },
    { id: 'yesterday', date: '2026-09-19', status: 'upcoming' },
    { id: 'done', date: '2026-09-21', status: 'done' },
    { id: 'cancelled', date: '2026-09-22', status: 'cancelled' },
  ]
  const grouped = groupShows(shows, new Date('2026-09-19T22:30:00Z'))
  assert.deepEqual(
    grouped.upcoming.map((show) => show.id),
    ['today', 'later'],
  )
  assert.deepEqual(
    grouped.past.map((show) => show.id),
    ['done', 'yesterday'],
  )
  assert.deepEqual(
    grouped.cancelled.map((show) => show.id),
    ['cancelled'],
  )
  assert.equal(shows[0].id, 'later')
})
