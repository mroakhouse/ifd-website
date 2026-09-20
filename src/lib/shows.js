// Show dates are calendar dates in the band's home timezone.
export function groupShows(shows, now = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Oslo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
  const upcoming = [],
    past = [],
    cancelled = []
  for (const show of shows) {
    if (show.status === 'cancelled') cancelled.push(show)
    else if (show.status === 'done' || show.date < today) past.push(show)
    else upcoming.push(show)
  }
  upcoming.sort((a, b) => a.date.localeCompare(b.date))
  past.sort((a, b) => b.date.localeCompare(a.date))
  cancelled.sort((a, b) => b.date.localeCompare(a.date))
  return { upcoming, past, cancelled }
}
