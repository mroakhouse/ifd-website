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
