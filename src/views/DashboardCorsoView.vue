<template>
  <div class="container">
    <h1 class="title">Ecco a te i corsi</h1>

    <div v-if="corsi.length > 0" class="corsi-list">
      <div v-for="corso in corsi" :key="corso.id" class="corso-item">
        <p>{{ corso.titolo }} - {{ corso.descrizione }}</p>
        <button @click="$router.push(`/corso/${corso.id}`)" class="details-button">
          Dettagli
        </button>
      </div>
    </div>
    <p v-else class="text-gray-500">Nessun corso disponibile.</p>

    <button @click="$router.push('/corso/gestione')" class="bg-blue-500 text-white px-4 py-2 rounded mb-4">
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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  padding-top: 50px;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: black;
  margin-bottom: 20px;
}

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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.details-button {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: 10px;
}

.details-button:hover {
  background-color: #0056b3;
}
</style>
