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

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Definiamo l'URL dell'API
const API_URL = 'http://localhost:8080/api/v1/corsi';

// Variabile reattiva per i corsi
const corsi = ref([]);

// Funzione per recuperare i corsi dall'API
const fetchCorsi = async () => {
  try {
    const response = await axios.get(API_URL);
    corsi.value = response.data; // Aggiorniamo lo stato con i dati ricevuti
  } catch (error) {
    console.error('Errore nel recupero dei corsi:', error);
  }
};

// **Funzione per aggiornare un corso specifico nella lista**
const aggiornaCorso = (corsoAggiornato) => {
  const index = corsi.value.findIndex(c => c.id === corsoAggiornato.id);
  if (index !== -1) {
    corsi.value[index] = { ...corsoAggiornato };
  }
};

// Chiamata API al montaggio del componente
onMounted(fetchCorsi);
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
