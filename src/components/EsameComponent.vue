<!-- App.vue -->
<template>
  <div class="exams-container">
    <h1>Elenco Esami</h1>

    <!-- Tabella Esami -->
    <table class="exams-table" v-if="vistaCorrente === 'lista'">
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
            <button @click="modificaEsame(esame)" class="edit-button">Modifica</button>
            <button @click="confermaEliminazione(esame)" class="delete-button">Elimina</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="vistaCorrente === 'lista' && esamiCaricati && !esami.length" class="no-exams">
      Nessun esame trovato
    </div>

    <div v-if="vistaCorrente === 'lista' && !esamiCaricati" class="loading">
      Caricamento esami in corso...
    </div>

    <!-- Pulsante per aggiungere un nuovo esame (spostato sotto la tabella) -->
    <div class="actions-bar" v-if="vistaCorrente === 'lista'">
      <button class="add-button" @click="nuovoEsame">Aggiungi Nuovo Esame</button>
    </div>

    <!-- Modal di conferma eliminazione -->
    <div v-if="modalEliminazione" class="modal-overlay">
      <div class="modal-content">
        <h3>Conferma Eliminazione</h3>
        <p>Sei sicuro di voler eliminare l'esame selezionato?</p>
        <div class="modal-actions">
          <button @click="eliminaEsame" class="delete-button" :disabled="eliminazioneInCorso">
            {{ eliminazioneInCorso ? 'Eliminazione...' : 'Elimina' }}
          </button>
          <button @click="annullaEliminazione" class="cancel-button-white">Annulla</button>
        </div>
      </div>
    </div>

    <!-- Form per aggiunta/modifica esame -->
    <div v-if="vistaCorrente === 'form'" class="esame-form">
      <h2>{{ modalitaModifica ? 'Modifica Esame' : 'Nuovo Esame' }}</h2>

      <div v-if="messaggioForm" class="message" :class="{ 'error': erroreForm }">
        {{ messaggioForm }}
      </div>

      <form @submit.prevent="salvaEsame">
        <div class="form-group">
          <label for="tipo">Tipo:</label>
          <input
            type="text"
            id="tipo"
            v-model="esameCorrente.tipo"
            required
          >
        </div>

        <div class="form-group">
          <label for="descrizione">Descrizione:</label>
          <textarea
            id="descrizione"
            v-model="esameCorrente.descrizione"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="punteggio">Punteggio:</label>
          <input
            type="number"
            id="punteggio"
            v-model.number="esameCorrente.punteggio"
            min="0"
            max="100"
            required
          >
        </div>

        <div class="form-group">
          <label for="data">Data:</label>
          <input
            type="date"
            id="data"
            v-model="esameCorrente.dataFormattata"
            required
          >
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="salvataggioInCorso">
            {{ salvataggioInCorso ? 'Salvataggio...' : 'Salva' }}
          </button>
          <button type="button" class="cancel-button" @click="tornaAllaLista">Annulla</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import esameService from '@/service/EsameService.js'

export default {
  data() {
    return {
      esami: [],
      esamiCaricati: false,
      vistaCorrente: 'lista', // 'lista' o 'form'
      esameCorrente: {
        id: null,
        tipo: '',
        descrizione: '',
        punteggio: 0,
        data: null,
        dataFormattata: ''
      },
      modalitaModifica: false,
      salvataggioInCorso: false,
      messaggioForm: '',
      erroreForm: false,
      // Nuove proprietà per la funzionalità di eliminazione
      modalEliminazione: false,
      esamePerEliminazione: null,
      eliminazioneInCorso: false
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
        const response = await esameService.findAll();

        // Con axios, i dati sono già nel formato JSON nell'oggetto response.data
        this.esami = response
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
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('it-IT')
    },

    formatDateForInput(dateString) {
      // Formatta la data per l'input type="date" (YYYY-MM-DD)
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    },

    nuovoEsame() {
      // Prepara il form per un nuovo esame
      this.esameCorrente = {
        id: null,
        tipo: '',
        descrizione: '',
        punteggio: 0,
        data: null,
        dataFormattata: ''
      }
      this.modalitaModifica = false
      this.messaggioForm = ''
      this.erroreForm = false
      this.vistaCorrente = 'form'
    },

    modificaEsame(esame) {
      // Prepara il form per modificare un esame esistente
      this.esameCorrente = {
        ...esame,
        dataFormattata: this.formatDateForInput(esame.data)
      }
      this.modalitaModifica = true
      this.messaggioForm = ''
      this.erroreForm = false
      this.vistaCorrente = 'form'
    },

    tornaAllaLista() {
      this.vistaCorrente = 'lista'
    },

    async salvaEsame() {
      try {
        this.salvataggioInCorso = true
        this.messaggioForm = ''
        this.erroreForm = false

        // Prepara i dati per l'invio
        const esamePerSalvataggio = {
          ...this.esameCorrente,
          data: new Date(this.esameCorrente.dataFormattata).toISOString()
        }

        // Rimuovi la proprietà dataFormattata che è solo per il form
        delete esamePerSalvataggio.dataFormattata

        let response

        if (this.modalitaModifica) {
          // Modifica di un esame esistente
          response = await axios.put(
            `http://localhost:8080/api/v1/esami/${this.esameCorrente.id}`,
            esamePerSalvataggio
          )
        } else {
          // Creazione di un nuovo esame
          response = await axios.post(
            'http://localhost:8080/api/v1/esami',
            esamePerSalvataggio
          )
        }

        // Torna alla lista e ricarica gli esami
        this.vistaCorrente = 'lista'
        this.caricaEsami()

      } catch (error) {
        console.error('Errore durante il salvataggio dell\'esame:', error)
        this.messaggioForm = 'Si è verificato un errore durante il salvataggio dell\'esame'
        this.erroreForm = true

        if (error.response) {
          console.error('Status:', error.response.status)
          console.error('Data:', error.response.data)

          if (error.response.data && error.response.data.message) {
            this.messaggioForm = `Errore: ${error.response.data.message}`
          }
        }
      } finally {
        this.salvataggioInCorso = false
      }
    },

    // Nuovi metodi per la funzionalità di eliminazione
    confermaEliminazione(esame) {
      this.esamePerEliminazione = esame
      this.modalEliminazione = true
    },

    annullaEliminazione() {
      this.modalEliminazione = false
      this.esamePerEliminazione = null
    },

    async eliminaEsame() {
      if (!this.esamePerEliminazione || !this.esamePerEliminazione.id) {
        return
      }

      try {
        this.eliminazioneInCorso = true

        // Chiamata DELETE all'API per eliminare l'esame
        await axios.delete(`http://localhost:8080/api/v1/esami/${this.esamePerEliminazione.id}`)

        // Chiudi il modal e ricarica la lista degli esami
        this.modalEliminazione = false
        this.esamePerEliminazione = null

        // Ricarica la lista degli esami
        this.caricaEsami()
      } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'esame:', error)

        // Qui potresti gestire eventuali errori, come visualizzare un messaggio
        // o mantenere il modal aperto con un messaggio di errore
        alert('Si è verificato un errore durante l\'eliminazione dell\'esame')

        if (error.response) {
          console.error('Status:', error.response.status)
          console.error('Data:', error.response.data)
        }
      } finally {
        this.eliminazioneInCorso = false
      }
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

.actions-bar {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.add-button {
  background-color: #2196F3;
}

.add-button:hover {
  background-color: #0b7dda;
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

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.edit-button {
  background-color: #4CAF50;
  margin-right: 5px;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button {
  background-color: #f44336;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.cancel-button {
  background-color: #f44336;
  margin-left: 10px;
}

.cancel-button:hover {
  background-color: #d32f2f;
}

.cancel-button-white {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  margin-left: 10px;
}

.cancel-button-white:hover {
  background-color: #f5f5f5;
}

/* Stili per il form */
.esame-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
}

.message {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  background-color: #d4edda;
  color: #155724;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
}

/* Stili per il modal di eliminazione */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
