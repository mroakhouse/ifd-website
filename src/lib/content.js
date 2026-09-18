import { reactive } from 'vue'
import defaults from '../content/defaults.json'
export const content = reactive(structuredClone(defaults))
export const contentStatus = reactive({ error: '' })
export async function loadContent() {
  try {
    const response = await fetch('/api/content')
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json'))
      throw new Error('Unavailable')
    Object.assign(content, await response.json())
    contentStatus.error = ''
  } catch {
    contentStatus.error = 'Live updates are temporarily unavailable. Please try again shortly.'
  }
}
export function formatDate(value) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value + 'T12:00:00'))
}
