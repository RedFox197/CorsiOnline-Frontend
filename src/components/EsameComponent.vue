<template>
  <div class="exams-container">
    <h1>Elenco Esami</h1>

    <!-- Visualizzazione Lista -->
    <div v-if="vistaCorrente === 'lista'">
      <table class="exams-table" v-if="esami.length">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descrizione</th>
            <th>Punteggio</th>
            <th>Data</th>
            <th>Classe</th>
            <th>Studente</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(esame, index) in esami" :key="index">
            <td>{{ esame.tipo }}</td>
            <td>{{ esame.descrizione }}</td>
            <td>{{ esame.punteggio }}</td>
            <td>{{ new Date(esame.data).toLocaleDateString('it-IT') }}</td>
            <td>{{ esame.classe ? esame.classe.nome : 'N/A' }}</td>
            <td>{{ esame.studente ? `${esame.studente.nome} ${esame.studente.cognome}` : 'N/A' }}</td>
            <td>
              <button @click="modificaEsame(esame)" class="edit-button">Modifica</button>
              <button @click="esamePerEliminazione = esame; modalEliminazione = true" class="delete-button">Elimina</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else-if="esamiCaricati" class="no-exams">Nessun esame trovato</div>
      <div v-else class="loading">Caricamento esami in corso...</div>

      <div class="actions-bar">
        <button class="add-button" @click="nuovoEsame">Aggiungi Nuovo Esame</button>
      </div>
    </div>

    <!-- Form Aggiunta/Modifica -->
    <div v-else class="esame-form">
      <h2>{{ modalitaModifica ? 'Modifica Esame' : 'Nuovo Esame' }}</h2>

      <div v-if="messaggioForm" class="message" :class="{ 'error': erroreForm }">
        {{ messaggioForm }}
      </div>

      <form @submit.prevent="salvaEsame">
        <div class="form-group">
          <label for="tipo">Tipo:</label>
          <input type="text" id="tipo" v-model="esameCorrente.tipo" required>
        </div>

        <div class="form-group">
          <label for="descrizione">Descrizione:</label>
          <textarea id="descrizione" v-model="esameCorrente.descrizione" required></textarea>
        </div>

        <div class="form-group">
          <label for="punteggio">Punteggio:</label>
          <input type="number" id="punteggio" v-model.number="esameCorrente.punteggio" min="0" max="100" required>
        </div>

        <div class="form-group">
          <label for="data">Data:</label>
          <input type="date" id="data" v-model="esameCorrente.dataFormattata" required>
        </div>

        <!-- Selezione Classe -->
        <div class="form-group">
          <label for="classe">Classe:</label>
          <select id="classe" v-model="esameCorrente.classeId" @change="cambioClasse" required>
            <option value="">Seleziona una classe</option>
            <option v-for="classe in classi" :key="classe.id" :value="classe.id">
              {{ classe.nome }} ({{ classe.corso ? classe.corso.titolo : 'N/A' }})
            </option>
          </select>
        </div>

        <!-- Selezione Studente -->
        <div class="form-group">
          <label for="studente">Studente:</label>
          <select id="studente" v-model="esameCorrente.studenteId" required :disabled="!esameCorrente.classeId || caricamentoStudenti">
            <option value="">
              {{ !esameCorrente.classeId ? 'Seleziona prima una classe' :
                 caricamentoStudenti ? 'Caricamento studenti...' : 'Seleziona uno studente' }}
            </option>
            <option v-for="studente in studentiClasse" :key="studente.id" :value="studente.id">
              {{ studente.nome }} {{ studente.cognome }}
            </option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="salvataggioInCorso">
            {{ salvataggioInCorso ? 'Salvataggio...' : 'Salva' }}
          </button>
          <button type="button" class="cancel-button" @click="vistaCorrente = 'lista'">Annulla</button>
        </div>
      </form>
    </div>

    <!-- Modal Conferma Eliminazione -->
    <div v-if="modalEliminazione" class="modal-overlay">
      <div class="modal-content">
        <h3>Conferma Eliminazione</h3>
        <p>Sei sicuro di voler eliminare l'esame selezionato?</p>
        <div class="modal-actions">
          <button @click="eliminaEsame" class="delete-button" :disabled="eliminazioneInCorso">
            {{ eliminazioneInCorso ? 'Eliminazione...' : 'Elimina' }}
          </button>
          <button @click="modalEliminazione = false" class="cancel-button-white">Annulla</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import esameService from '@/service/EsameService.js'
import classeService from '@/service/ClasseService.js'

export default {
  data() {
    return {
      esami: [],
      esamiCaricati: false,
      classi: [],
      classiCaricate: false,
      studentiClasse: [],
      caricamentoStudenti: false,
      vistaCorrente: 'lista',
      esameCorrente: {
        id: null,
        tipo: '',
        descrizione: '',
        punteggio: 0,
        dataFormattata: '',
        classeId: '',
        studenteId: ''
      },
      modalitaModifica: false,
      salvataggioInCorso: false,
      messaggioForm: '',
      erroreForm: false,
      modalEliminazione: false,
      esamePerEliminazione: null,
      eliminazioneInCorso: false
    }
  },

  created() {
    this.caricaEsami();
    this.caricaClassi();
  },

  methods: {
    async caricaEsami() {
      try {
        this.esamiCaricati = false
        this.esami = await esameService.findAll()
      } catch (error) {
        console.error('Errore durante il caricamento degli esami:', error)
      } finally {
        this.esamiCaricati = true
      }
    },

    async caricaClassi() {
      try {
        this.classiCaricate = false
        this.classi = await classeService.findAll()
      } catch (error) {
        console.error('Errore durante il caricamento delle classi:', error)
      } finally {
        this.classiCaricate = true
      }
    },

    async cambioClasse() {
      // Reset della selezione studente quando cambia la classe
      this.esameCorrente.studenteId = '';
      this.studentiClasse = [];

      if (!this.esameCorrente.classeId) return;

      try {
        this.caricamentoStudenti = true;
        // Utilizziamo il metodo specifico per ottenere studenti di una classe
        this.studentiClasse = await classeService.getStudenti(this.esameCorrente.classeId);
      } catch (error) {
        console.error('Errore durante il caricamento degli studenti della classe:', error);
        this.messaggioForm = 'Errore nel caricamento degli studenti';
        this.erroreForm = true;
      } finally {
        this.caricamentoStudenti = false;
      }
    },

    nuovoEsame() {
      this.esameCorrente = {
        id: null,
        tipo: '',
        descrizione: '',
        punteggio: 0,
        dataFormattata: '',
        classeId: '',
        studenteId: ''
      }
      this.studentiClasse = [];
      this.modalitaModifica = false;
      this.messaggioForm = '';
      this.erroreForm = false;
      this.vistaCorrente = 'form';
    },

    async modificaEsame(esame) {
      this.esameCorrente = {
        ...esame,
        dataFormattata: new Date(esame.data).toISOString().split('T')[0],
        classeId: esame.classe ? esame.classe.id : '',
        studenteId: esame.studente ? esame.studente.id : ''
      }
      this.modalitaModifica = true;
      this.messaggioForm = '';
      this.erroreForm = false;

      // Carica gli studenti della classe se è impostata
      if (this.esameCorrente.classeId) {
        await this.cambioClasse();
      }

      this.vistaCorrente = 'form';
    },

    async salvaEsame() {
      try {
        this.salvataggioInCorso = true;
        this.messaggioForm = '';

        // Trova gli oggetti completi di classe e studente
        const classeSelezionata = this.classi.find(c => c.id === parseInt(this.esameCorrente.classeId));
        const studenteSelezionato = this.studentiClasse.find(s => s.id === parseInt(this.esameCorrente.studenteId));

        const esameData = {
          ...this.esameCorrente,
          data: new Date(this.esameCorrente.dataFormattata).toISOString(),
          classe: classeSelezionata,
          studente: studenteSelezionato
        }

        // Rimuovi campi temporanei
        delete esameData.dataFormattata;
        delete esameData.classeId;
        delete esameData.studenteId;

        if (this.modalitaModifica) {
          await esameService.update(this.esameCorrente.id, esameData);
        } else {
          await esameService.save(esameData);
        }

        this.vistaCorrente = 'lista';
        this.caricaEsami();
      } catch (error) {
        console.error('Errore durante il salvataggio:', error);
        this.messaggioForm = error.response?.data?.message || 'Errore durante il salvataggio';
        this.erroreForm = true;
      } finally {
        this.salvataggioInCorso = false;
      }
    },

    async eliminaEsame() {
      if (!this.esamePerEliminazione?.id) return;

      try {
        this.eliminazioneInCorso = true;
        await esameService.deleteu(this.esamePerEliminazione.id);
        this.modalEliminazione = false;
        this.caricaEsami();
      } catch (error) {
        console.error('Errore durante l\'eliminazione:', error);
        alert('Si è verificato un errore durante l\'eliminazione dell\'esame');
      } finally {
        this.eliminazioneInCorso = false;
        this.esamePerEliminazione = null;
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
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
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
  background-color: #ccc;
  cursor: not-allowed;
}

.add-button {
  background-color: #2196F3;
}

.add-button:hover {
  background-color: #0b7dda;
}

.edit-button {
  background-color: #4CAF50;
  margin-right: 5px;
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

.cancel-button-white {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  margin-left: 10px;
}

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

.form-group input, .form-group textarea, .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-actions {
  margin-top: 20px;
  display: flex;
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
