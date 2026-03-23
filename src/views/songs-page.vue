<template>
  <div class="page">
    <h2>Songs</h2>

    <div class="song" v-for="song in songs" :key="song.id">
      <div class="date">
        {{ song.release }}
      </div>

      <div class="info">
        <h3>{{ song.name }}</h3>
        <p>{{ song.released }}</p>
      </div>

      <div class="actions">
        <button v-if="song.download">Download</button>
        <span v-else class="negativedownload">Nope</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const songs = [
  {
    id: 1,
    release: '30 MAY',
    name: 'Satan Just Arrived',
    released: 'not yet released',
    download: true,
  },
  {
    id: 2,
    release: '25 JUN',
    name: 'Issued For Destruction',
    released: 'not yet released',
    download: true,
  },
  { id: 3, release: '16 AUG', name: 'Stratenrøver', released: 'not yet released', download: false },
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

.song {
  display: flex;
  justify-content: space-between;
  padding: 18px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

button:hover {
  transform: translateY(-1px);
}

.links a:hover {
  opacity: 1;
}

.release {
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

.negativedownload {
  opacity: 0.3;
}
</style>
