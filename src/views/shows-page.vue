<script setup>
const upcoming = new Date() < new Date('2026-09-20T00:00:00+02:00')
</script>
<template>
  <div class="wrap page">
    <p class="eyebrow">IN THE FLESH</p>
    <h1>LOUDER <span>LIVE.</span></h1>
    <p class="page-intro">See you at the front.</p>
    <section class="section">
      <h2>{{ upcoming ? 'Upcoming shows' : 'Past shows' }}</h2>
      <div class="show-row">
        <div class="show-date"><strong>19</strong><span>SEP 2026</span></div>
        <div>
          <h3>Fest I Hallen 2026</h3>
          <p>Skjold City</p>
        </div>
        <a
          class="button"
          href="https://fb.me/2gh4anCjlQQ83Do"
          target="_blank"
          rel="noopener noreferrer"
          >{{ upcoming ? 'Event & tickets ↗' : 'View event ↗' }}</a
        >
      </div>
    </section>
    <div class="announcement">
      <div>
        <p class="eyebrow">BRING THE NOISE TO YOUR CITY</p>
        <h3>Want us on your stage?</h3>
        <p>Get in touch with the band for bookings.</p>
      </div>
      <a
        class="button primary"
        href="https://www.facebook.com/multimetalmaniacs"
        target="_blank"
        rel="noopener noreferrer"
        >Contact the band ↗</a
      >
    </div>
  </div>
</template>
<<<<<<< HEAD

<script setup>
const shows = [
  // { id: 2, date: '19 SEPT', venue: 'Fest I Hallen 2026', city: 'Skjold City', tickets: true , website: () => window.open('https://fb.me/2gh4anCjlQQ83Do','_blank')},
  { id: 1, date: '??', venue: 'Book Us', city: 'Somewhere', tickets: false }
]


</script>

<style scoped>
.page {
  padding: 140px 20px;
  max-width: 900px;
  margin: auto;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.show {
  display: flex;
  justify-content: space-between;
  padding: 18px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.date {
  width: 80px;
  opacity: 0.6;
}

.info h3 {
  margin: 0;
  font-weight: 500;
}

.info p {
  margin: 5px 0 0;
  font-size: 0.9rem;
  opacity: 0.6;
}

.actions button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 14px;
  color: white;
  cursor: pointer;
}

.actions button:hover {
  border-color: white;
}

.soldout {
  opacity: 0.3;
}
</style>
=======
>>>>>>> aa921e8 (completely rebuild of the website by the help of codex.)
