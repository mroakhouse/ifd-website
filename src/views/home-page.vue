<template>
  <div class="home">
    <img src="@/assets/logo.png" class="logo" />

    <p>Modern metal from Norway</p>
  </div>
</template>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 500px;
  max-width: 80%;
  margin-bottom: 30px;
  opacity: 0.95;
}

h1 {
  font-size: 2.2rem;
  letter-spacing: 3px;
  margin: 0;
}

p {
  margin-top: 10px;
  opacity: 0.6;
}
.logo {
  animation: fadeIn 1.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 0.95;
    transform: translateY(0);
  }
}
</style>
