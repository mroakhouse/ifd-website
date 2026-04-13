<script setup>
defineProps({
  vName: String,
  vImage: String,
  vInstagram: String,
  vFacebook: String,
  vYouTube: String,
})
</script>

<template>
  <div class="member">
    <img :src="vImage" :alt="vName" class="member-img" />

    <h3>{{ vName }}</h3>

    <div class="socials">
      <a v-if="vFacebook" :href="vFacebook" target="_blank">
        <i class="fab fa-facebook"></i>
      </a>

      <a v-if="vInstagram" :href="vInstagram" target="_blank">
        <i class="fab fa-instagram"></i>
      </a>

      <a v-if="vYouTube" :href="vYouTube" target="_blank">
        <i class="fab fa-youtube"></i>
      </a>
    </div>
  </div>
</template>

<style scoped>
.member {
  text-align: center;
}

.member-img {
  width: 200px;
  border-radius: 10px;
}

.socials {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.socials a {
  color: white;
  font-size: 20px;
  transition: 0.3s;
}

.socials a:hover {
  color: red;
  transform: scale(1.2);
}
</style>
