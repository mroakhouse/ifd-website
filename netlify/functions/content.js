import { getStore } from '@netlify/blobs'
import { getUser } from '@netlify/identity'
import { createContentHandler } from '../lib/content-handler.js'
export default createContentHandler({ getStore, getUser })
export const config = { path: '/api/content' }
