import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createContentHandler, validateContent } from '../netlify/lib/content-handler.js'
import defaults from '../src/content/defaults.json' with { type: 'json' }

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
