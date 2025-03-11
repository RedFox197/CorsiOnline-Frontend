<template>
  <div class="container">
    <!-- Titolo grande centrato -->
    <h1 class="title">Elenco corsi disponibili</h1>

    <!-- Barra di ricerca per filtrare i corsi -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Cerca un corso..."
        class="search-input"
      />
    </div>

    <!-- Pulsante per aggiungere un nuovo corso -->
    <div class="button-wrapper">
      <button @click="vaiAggiungiCorso" class="add-button">+ Aggiungi Corso</button>
    </div>

    <!-- Tabella dei corsi -->
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome Corso</th>
            <th>Descrizione</th>
            <th>Classi Associate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="corso in filteredCorsi" :key="corso.id">
            <td>{{ corso.id }}</td>
            <td>{{ corso.titolo }}</td>
            <td>{{ corso.descrizione }}</td>
            <td>
              <span v-if="corso.classi.length > 0">
                {{ corso.classi.join(', ') }}
              </span>
              <span v-else class="no-classi">Nessuna classe associata</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Messaggio di errore API -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const searchQuery = ref("");
    const router = useRouter();
    const corsi = ref([]);
    const errorMessage = ref("");

    // Funzione per recuperare i corsi dall'API
    const fetchCorsi = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/corsi');
        corsi.value = response.data;

        // Recupera le classi associate per ogni corso
        for (let corso of corsi.value) {
          try {
            const classiResponse = await axios.get(`http://localhost:8080/api/v1/corsi/${corso.id}/classi`);
            corso.classi = classiResponse.data.map(c => c.nome); // Supponendo che la classe abbia una proprietà `nome`
          } catch (error) {
            console.error(`Errore nel recupero delle classi per il corso ${corso.id}:`, error);
            corso.classi = []; // Nessuna classe associata in caso di errore
          }
        }
      } catch (error) {
        console.error("Errore nel recupero corsi:", error);
        errorMessage.value = "Errore nel caricamento dei corsi. Riprova più tardi.";
      }
    };

    // Computed per filtrare i corsi in base alla ricerca
    const filteredCorsi = computed(() => {
      return corsi.value.filter(corso =>
        corso.titolo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        corso.descrizione.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    // Funzione per navigare alla pagina di aggiunta corsi
    const vaiAggiungiCorso = () => {
      router.push('/corso/gestione'); // ✅ Rotta per aggiungere un corso
    };

    onMounted(fetchCorsi);

    return { searchQuery, filteredCorsi, vaiAggiungiCorso, errorMessage };
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
  font-size: 2.5rem;
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
  margin-bottom: 20px;
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

/* Contenitore del pulsante */
.button-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}

/* Pulsante Aggiungi Corso */
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

/* Contenitore della tabella */
.table-container {
  width: 100%;
  overflow-x: auto;
}

/* Stile tabella */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.table th {
  background-color: #007bff;
  color: white;
}

.table tr:nth-child(even) {
  background-color: #f8f9fa;
}

.table tr:hover {
  background-color: #e9ecef;
}

/* Testo "Nessuna classe associata" */
.no-classi {
  color: gray;
  font-style: italic;
}

/* Messaggio di errore */
.error-message {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}
</style>
