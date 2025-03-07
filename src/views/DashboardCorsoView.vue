<template>
  <div class="container">
    <!-- Titolo in alto -->
    <h1 class="title">Ecco a te i corsi</h1>

    <!-- Lista dei corsi -->
    <div v-if="corsi.length > 0" class="corsi-list">
      <div v-for="corso in corsi" :key="corso.id" class="corso-item">
        <p>{{ corso.titolo }} - {{ corso.descrizione }}</p>
      </div>
    </div>
    <p v-else class="text-gray-500">Nessun corso disponibile.</p>

    <!-- Pulsante dopo la lista -->
    <button @click="$router.push('/gestione-corso')" class="button">
      + Aggiungi Corso
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      corsi: [
        { id: 1, titolo: "Corso di Vue", descrizione: "Impara Vue.js da zero" },
        { id: 2, titolo: "Corso di JavaScript", descrizione: "JS moderno e avanzato" }
      ] // Simulazione dati, sostituiscili con API
    };
  }
};
</script>

<style scoped>
/* Contenitore generale */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  padding-top: 50px;
}

/* Stile del titolo */
.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: black;
  margin-bottom: 20px;
}

/* Stile lista corsi */
.corsi-list {
  width: 80%;
  max-width: 600px;
  margin-bottom: 20px;
}

.corso-item {
  background: #f8f9fa;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

/* Stile del pulsante */
.button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}
</style>
