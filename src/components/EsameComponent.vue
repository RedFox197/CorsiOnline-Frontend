// App.vue
<template>
  <div class="exams-container">
    <h1>Elenco Esami</h1>

    <table class="exams-table">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Descrizione</th>
          <th>Punteggio</th>
          <th>Data</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(esame, index) in esami" :key="index">
          <td>{{ esame.tipo }}</td>
          <td>{{ esame.descrizione }}</td>
          <td>{{ esame.punteggio }}</td>
          <td>{{ formatDate(esame.data) }}</td>
          <td>
            <button @click="dettaglioEsame(esame)">Dettaglio</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="esamiCaricati && !esami.length" class="no-exams">
      Nessun esame trovato
    </div>
    <div v-if="!esamiCaricati" class="loading">
      Caricamento esami in corso...
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      esami: [],
      esamiCaricati: false
    }
  },
  created() {
    // Chiama la funzione di caricamento quando il componente viene creato
    this.caricaEsami()
  },
  methods: {
    async caricaEsami() {
      try {
        this.esamiCaricati = false

        // Utilizzo di axios per la richiesta API
        const response = await axios.get('http://localhost:8080/api/v1/esami')

        // Con axios, i dati sono già nel formato JSON nell'oggetto response.data
        this.esami = response.data
      } catch (error) {
        console.error('Errore durante il caricamento degli esami:', error)
        // Gestione errori più dettagliata con axios
        if (error.response) {
          // La richiesta è stata effettuata e il server ha risposto con un codice di stato
          console.error('Status:', error.response.status)
          console.error('Data:', error.response.data)
        } else if (error.request) {
          // La richiesta è stata effettuata ma non è stata ricevuta risposta
          console.error('Nessuna risposta dal server')
        } else {
          // Errore nella configurazione della richiesta
          console.error('Errore di configurazione:', error.message)
        }
      } finally {
        this.esamiCaricati = true
      }
    },
    formatDate(dateString) {
      // Formatta la data nel formato desiderato (es: DD/MM/YYYY)
      const date = new Date(dateString)
      return date.toLocaleDateString('it-IT')
    },
    dettaglioEsame(esame) {
      // Funzione per gestire la visualizzazione del dettaglio
      console.log('Dettaglio esame:', esame)
      // Qui potresti navigare a una pagina di dettaglio o aprire un modal
    }
  }
}
</script>

<style scoped>
.exams-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.exams-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.exams-table th, .exams-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.exams-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.exams-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.exams-table tr:hover {
  background-color: #f1f1f1;
}

.loading, .no-exams {
  text-align: center;
  margin-top: 20px;
  font-style: italic;
  color: #666;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}
</style>
