<template>
  <div class="page">
    <h2>Upcoming Shows</h2>

    <div class="show" v-for="show in shows" :key="show.id">
      <div class="date">
        {{ show.date }}
      </div>

      <div class="info">
        <h3>{{ show.venue }}</h3>
        <p>{{ show.city }}</p>
      </div>

      <div class="actions">
        <button v-if="show.tickets">Tickets</button>
        <span v-else class="soldout">Sold Out</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const shows = [
  { id: 1, date: '12 APR', venue: 'Folken', city: 'Stavanger', tickets: true },
  { id: 2, date: '25 APR', venue: 'Rockefeller', city: 'Oslo', tickets: true },
  { id: 3, date: '03 MAY', venue: 'Garage', city: 'Bergen', tickets: false },
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
