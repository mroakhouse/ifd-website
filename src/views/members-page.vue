<template>
  <div class="page">
    <h2>Members</h2>

    <div class="grid">
      <div class="member" v-for="member in members" :key="member.id">
        <img :src="member.img" class="image" />

        <h3>{{ member.name }}</h3>
        <p>{{ member.role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import jarle from '@/assets/members/jarle1.png'
import rune from '@/assets/members/Rune1.png'
import thomas from '@/assets/members/thomas1.png'
import kristoffer from '@/assets/members/kristoffer1.png'
import johannes from '@/assets/members/johannes1.png'

const members = [
  { id: 1, name: 'Jarle', role: 'Vocals', img: jarle },
  { id: 2, name: 'Rune', role: 'Guitar / Backing Vocals', img: rune },
  { id: 3, name: 'Thomas', role: 'Guitar / Backing Vocals', img: thomas },
  { id: 4, name: 'Kristoffer', role: 'Bass', img: kristoffer },
  { id: 5, name: 'Johannes', role: 'Drums / Backing Vocals', img: johannes },
]
</script>

<style scoped>
.page {
  padding: 140px 20px;
  max-width: 1000px;
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

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-top: 40px;
}

/* MEMBER CARD */
.member {
  text-align: center;
}

/* IMAGE PLACEHOLDER */
.image {
  width: 100%;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 15px;
}

/* TEXT */
h3 {
  margin: 0;
}

p {
  margin-top: 5px;
  opacity: 0.6;
}
.image {
  filter: grayscale(100%) contrast(120%);
  transition: 0.3s;
}

.member:hover .image {
  filter: grayscale(0%) contrast(110%);
  transform: scale(1.03);
}
</style>
