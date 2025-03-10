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
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
// import axios from 'axios'; // API Commentata

export default {
  setup() {
    const searchQuery = ref("");

    // Dati statici per ora
    const corsi = ref([
      { id: 1, titolo: "Corso di Vue", descrizione: "Impara Vue.js da zero", classi: ["Classe A", "Classe B"] },
      { id: 2, titolo: "Corso di JavaScript", descrizione: "JS moderno e avanzato", classi: ["Classe C"] },
      { id: 3, titolo: "Corso di Python", descrizione: "Sviluppo e data science", classi: [] }
    ]);

    // Computed per filtrare i corsi in base alla ricerca
    const filteredCorsi = computed(() => {
      return corsi.value.filter(corso =>
        corso.titolo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        corso.descrizione.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

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

    return { searchQuery, filteredCorsi };
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

/* Contenitore della tabella */
.table-container {
  width: 100%;
  overflow-x: auto;
}

/* Stile tabella */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
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
</style>
