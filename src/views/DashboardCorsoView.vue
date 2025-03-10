<template>
  <div class="container">
    <!-- Titolo grande centrato -->
    <h1 class="title">Lista dei corsi</h1>

    <!-- Barra di ricerca per filtrare i corsi -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Cerca un corso..."
        class="search-input"
      />
    </div>

    <!-- Griglia dei corsi filtrati -->
    <div v-if="filteredCorsi.length > 0" class="grid-container">
      <div v-for="corso in filteredCorsi" :key="corso.id" class="corso-card">
        <h2>{{ corso.titolo }}</h2>
        <p>{{ corso.descrizione }}</p>
        <button @click="vaiDettagliCorso(corso.id)" class="details-button">Vedi Dettagli</button>
      </div>
    </div>

    <p v-else class="no-results">Nessun corso trovato.</p>

    <!-- Pulsante per aggiungere un nuovo corso -->
    <div class="button-wrapper">
      <button @click="vaiAggiungiCorso" class="add-button">+ Aggiungi Corso</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import axios from 'axios'; // API Commentata

export default {
  setup() {
    const searchQuery = ref("");
    const router = useRouter();

    // Dati statici per ora
    const corsi = ref([
      { id: 1, titolo: "Corso di Vue", descrizione: "Impara Vue.js da zero" },
      { id: 2, titolo: "Corso di JavaScript", descrizione: "JS moderno e avanzato" },
      { id: 3, titolo: "Corso di Python", descrizione: "Sviluppo e data science" }
    ]);

    // Computed per filtrare i corsi in base alla ricerca
    const filteredCorsi = computed(() => {
      return corsi.value.filter(corso =>
        corso.titolo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        corso.descrizione.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const vaiDettagliCorso = (corsoId) => {
      router.push(`/corso/${corsoId}`);
    };

    const vaiAggiungiCorso = () => {
      router.push('/corso/gestione');
    };

    // Funzione per recuperare i corsi da API (Attualmente commentata)
    // const fetchCorsi = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:8080/api/v1/corsi');
    //     corsi.value = response.data;
    //   } catch (error) {
    //     console.error("Errore nel recupero corsi:", error);
    //   }
    // };

    // onMounted(fetchCorsi); // API disabilitata per ora

    return { searchQuery, filteredCorsi, vaiDettagliCorso, vaiAggiungiCorso };
  }
};
</script>

<style scoped>
/* Contenitore principale */
.container {
  text-align: center;
  padding: 40px 20px;
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Titolo grande centrato */
.title {
  font-size: 3rem;
  font-weight: bold;
  color: black;
  text-align: center;
  margin-bottom: 20px;
}

/* Contenitore della barra di ricerca */
.search-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 30px;
}

/* Input di ricerca */
.search-input {
  width: 50%;
  max-width: 500px;
  padding: 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  text-align: center;
  outline: none;
  transition: all 0.3s ease-in-out;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0px 4px 10px rgba(0, 123, 255, 0.2);
}

/* Griglia per i corsi */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  justify-content: center;
  max-width: 1000px;
  margin: auto;
}

/* Card per ogni corso */
.corso-card {
  background: #1c1c1c;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  color: white;
  transition: transform 0.2s ease-in-out;
}

.corso-card:hover {
  transform: translateY(-5px);
}

/* Bottone dettagli */
.details-button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  border: none;
}

.details-button:hover {
  background-color: #0056b3;
}

/* Pulsante Aggiungi Corso */
.button-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 30px;
}

.add-button {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease-in-out;
}

.add-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* Messaggio "Nessun corso trovato" */
.no-results {
  font-size: 1.2rem;
  color: gray;
  margin-top: 20px;
}
</style>
