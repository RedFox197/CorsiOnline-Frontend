<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" class="logo-image" />
          QUACKADEMY
        </div>
        <div class="nav-links">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/corso">Corso</RouterLink>
          <RouterLink to="/esame">Esame</RouterLink>
          <RouterLink to="/utente">Utente</RouterLink>
          <RouterLink to="/classe">Classe</RouterLink>
        </div>
        <div class="space-filler"></div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Monoton&display=swap');

nav {
  top: 0;
  left: 0;
  width: 100%;
  background-color: #42b983;
  background-image: linear-gradient(135deg, #42b983, #3aa876);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  padding: 1rem 0;
  z-index: 1000;
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  font-family: 'Monoton', cursive;
  font-size: 1.5rem;
  color: white;
  margin-left: 2rem;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  flex: 1;
  text-align: left;
}

.logo-image {
  width: 40px; /* Adatta la dimensione del logo a seconda delle tue preferenze */
  margin-right: 10px; /* Distanza tra il logo e la scritta */
}

.nav-links {
  flex: 2;
  text-align: center;
}

.space-filler {
  flex: 1;
}

nav a {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  margin: 0 0.3rem;
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  border-radius: 4px;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

nav a.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

header {
  text-align: center;
}
</style>
