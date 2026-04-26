<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <h2>Forged in distortion. Driven by chaos.</h2>
    </section>

    <!-- Story -->
    <section class="story">
      <h2>Our Story</h2>
      <p>
        Issued For Destruction was born in 2016, when Thomas and Rune started jamming together with
        no real plan — just a shared love for heavy riffs.
      </p>

      <p>
        Johne soon joined, forming a trio that built the foundation of the band’s raw and aggressive
        sound.
      </p>

      <p>
        As the band evolved, Kristoffer and Johannes joined, pushing the music further into heavier
        and darker territory.
      </p>

      <p>
        In 2023, Johne left the band. Shortly after, Jarle joined on vocals, bringing new energy and
        a new chapter for Issued For Destruction.
      </p>
    </section>

    <!-- Timeline -->
    <section class="timeline">
      <h2>Timeline</h2>
      <ul>
        <li><strong>2016:</strong> Band formed (Thomas & Rune)</li>
        <li><strong>2016–2017:</strong> Johne joins (trio)</li>
        <li><strong>Later:</strong> Kristoffer & Johannes join</li>
        <li><strong>2023:</strong> Johne leaves</li>
        <li><strong>Now:</strong> Jarle on vocals</li>
      </ul>
    </section>
  </div>

  <section class="timeline">
    <h2>Current Lineup</h2>
    <ul>
      <li><strong>Jarle:</strong> Vocals</li>
      <li><strong>Rune:</strong> Guitar</li>
      <li><strong>Thomas:</strong> Guitar</li>
      <li><strong>Kristoffer:</strong> Bass</li>
      <li><strong>Johannes:</strong> Drums</li>
    </ul>
  </section>
</template>

<style scoped>
.band-page {
  color: #eee;
  background: #0b0b0b;
  padding: 40px;
}

.hero {
  text-align: center;
  margin-bottom: 60px;
}

.hero h1 {
  font-size: 3rem;
  letter-spacing: 2px;
}

.story {
  max-width: 800px;
  margin: auto;
  line-height: 1.7;
}

.timeline {
  margin-top: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.timeline ul {
  list-style: none;
  padding: 0;
}

.timeline li {
  margin: 10px 0;
}
</style>
