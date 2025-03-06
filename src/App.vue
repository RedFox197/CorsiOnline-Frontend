<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/corso">Corso</RouterLink>
        <RouterLink to="/esame">Esame</RouterLink>
        <RouterLink to="/utente">Utente</RouterLink>
        <RouterLink to="/classe">Classe</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  top: 0;
  left: 0;
  width: 100%;
  background-color: #42b983;
  padding: 1rem 0;
  text-align: center;
  z-index: 1000;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  color: white;
  text-decoration: none;
  font-weight: bold;
}

nav a.router-link-exact-active {
  text-decoration: underline;
}

header {
  text-align: center;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
