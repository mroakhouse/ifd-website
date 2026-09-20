import defaults from '../../src/content/defaults.json' with { type: 'json' }

const reply = (data, status = 200) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
export function publicContent(data) {
  return { ...data, news: data.news.filter((story) => story.published) }
}
function string(value, name, max, required = true) {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim()))
    throw new Error(`Invalid ${name}.`)
  return value.trim()
}
function image(value) {
  const url = string(value, 'image URL', 2000, false)
  if (url && !/^\/(?!\/)[a-zA-Z0-9/_.-]+$/.test(url)) {
    try {
      if (new URL(url).protocol !== 'https:') throw new Error()
    } catch {
      throw new Error('Images must use an HTTPS URL or a local path.')
    }
  }
  return url
}
function link(value, name, required = false) {
  const url = string(value, name, 2000, required)
  if (url) {
    try {
      if (new URL(url).protocol !== 'https:') throw new Error()
    } catch {
      throw new Error(`${name} must use an HTTPS URL.`)
    }
  }
  return url
}
function date(value, name) {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString().slice(0, 10) !== value
  )
    throw new Error(`Invalid ${name} date.`)
  return value
}
// Existing saved sites predate these collections. Preserve intentional empty lists.
function withCollections(data) {
  return {
    ...data,
    shows: data.shows === undefined ? defaults.shows : data.shows,
    music: data.music === undefined ? defaults.music : data.music,
  }
}
export function validateContent(data) {
  if (
    !data ||
    !Array.isArray(data.news) ||
    !Array.isArray(data.members) ||
    data.news.length > 200 ||
    data.members.length > 30
  )
    throw new Error('Invalid content collection.')
  data = withCollections(data)
  if (
    !Array.isArray(data.shows) ||
    !Array.isArray(data.music) ||
    data.shows.length > 500 ||
    data.music.length > 200
  )
    throw new Error('Invalid shows or music collection.')
  const ids = new Set()
  const id = (value) => {
    if (typeof value !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(value) || ids.has(value))
      throw new Error('Invalid or duplicate ID.')
    ids.add(value)
    return value
  }
  return {
    story: string(data.story, 'band story', 20000),
    shows: data.shows.map((item) => {
      if (!['upcoming', 'done', 'cancelled'].includes(item.status))
        throw new Error('Invalid show status.')
      return {
        id: id(item.id),
        title: string(item.title, 'show title', 180),
        date: date(item.date, 'show'),
        location: string(item.location, 'show location', 200),
        url: link(item.url, 'Event / tickets URL'),
        status: item.status,
      }
    }),
    music: data.music.map((item) => ({
      id: id(item.id),
      title: string(item.title, 'music title', 180),
      description: string(item.description, 'music description', 5000, false),
      image: image(item.image),
      platform: string(item.platform, 'listening platform', 80),
      url: link(item.url, 'Listening URL', true),
      videoUrl: link(item.videoUrl, 'Video URL'),
    })),
    news: data.news.map((item) => {
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(item.date) ||
        Number.isNaN(Date.parse(item.date)) ||
        new Date(item.date).toISOString().slice(0, 10) !== item.date
      )
        throw new Error('Invalid story date.')
      if (typeof item.published !== 'boolean') throw new Error('Invalid publication status.')
      return {
        id: id(item.id),
        title: string(item.title, 'title', 180),
        date: item.date,
        excerpt: string(item.excerpt, 'excerpt', 500, false),
        body: string(item.body, 'story body', 30000),
        image: image(item.image),
        published: item.published,
      }
    }),
    members: data.members.map((item) => ({
      id: id(item.id),
      name: string(item.name, 'member name', 100),
      role: string(item.role, 'role', 150),
      bio: string(item.bio, 'biography', 5000, false),
      image: image(item.image),
    })),
  }
}

// Dependencies are injected so the actual access-control and persistence path can be tested.
export function createContentHandler({ getUser, getStore }) {
  return async (request) => {
    try {
      const admin = new URL(request.url).searchParams.get('admin') === '1'
      if (!['GET', 'PUT'].includes(request.method))
        return reply({ error: 'Method not allowed.' }, 405)
      if (request.method === 'PUT' && request.headers.get('origin') !== new URL(request.url).origin)
        return reply({ error: 'Invalid request origin.' }, 403)
      if (admin || request.method === 'PUT') {
        const user = await getUser()
        if (!user)
          return reply({ error: 'Please log in again. Your session may have expired.' }, 401)
        if (!user.roles?.includes('admin'))
          return reply(
            {
              error:
                'Your account needs the admin role. Ask the site owner to assign it in Netlify Identity.',
            },
            403,
          )
      }
      const store = getStore({ name: 'ifd-content', consistency: 'strong' })
      if (request.method === 'GET') {
        const saved = await store.getWithMetadata('content', { type: 'json' })
        const data = withCollections(saved?.data || defaults)
        return reply(admin ? { content: data, version: saved?.etag || null } : publicContent(data))
      }
      if (!request.headers.get('content-type')?.includes('application/json'))
        return reply({ error: 'JSON required.' }, 415)
      const body = await request.text()
      if (body.length > 1000000) return reply({ error: 'Content is too large.' }, 413)
      let payload, validated
      try {
        payload = JSON.parse(body)
        validated = validateContent(payload.content)
        if (
          payload.version !== null &&
          (typeof payload.version !== 'string' || payload.version.length > 200)
        )
          throw new Error('Invalid version.')
      } catch (error) {
        return reply({ error: error.message }, 400)
      }
      const saved = await store.setJSON(
        'content',
        validated,
        payload.version === null ? { onlyIfNew: true } : { onlyIfMatch: payload.version },
      )
      if (!saved.modified)
        return reply(
          {
            error:
              'Someone else saved changes. Copy your edits, then reload the editor before saving again.',
          },
          409,
        )
      return reply({ content: validated, version: saved.etag })
    } catch {
      return reply(
        {
          error:
            'Content storage is unavailable. Please try again. On a new site, check the Netlify setup in README.md.',
        },
        503,
      )
    }
  }
}
