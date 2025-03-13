<template>
  <div class="container mt-4">
    <h2>Elenco Classi</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Data Inizio</th>
          <th>Data Fine</th>
          <th>Corso</th>
          <th>Docente</th>
          <th>Mostra</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="classe in classi" :key="classe.id">
          <td>{{ classe.id }}</td>
          <td>{{ classe.nome }}</td>
          <td>{{ classe.dataInizio }}</td>
          <td>{{ classe.dataFine }}</td>
          <td>{{ classe.corso.titolo }}</td>
          <td>{{ classe.docente.nome }} {{ classe.docente.cognome }}</td>
          <td>
            <button class="btn btn-info btn-sm" @click="showDetails(classe.id)">Mostra</button>
          </td>
          <td>
            <button class="btn btn-primary btn-sm" @click="editClasse(classe)">Modifica</button>
            <button class="btn btn-danger btn-sm" @click="deleteClasse(classe.id)">Elimina</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pulsante per aggiungere una nuova classe -->
    <CreaClasse @classi-created="fetchClassi" />

    <!-- Modal Modifica -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modifica Classe</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <label>Nome:</label>
            <input v-model="selectedClasse.nome" class="form-control" />
            <label>Data Inizio:</label>
            <input v-model="selectedClasse.dataInizio" type="date" class="form-control" />
            <label>Data Fine:</label>
            <input v-model="selectedClasse.dataFine" type="date" class="form-control" />
            <label>Corso:</label>
            <select v-model="selectedClasse.corso.id" class="form-control">
              <option v-for="corso in corsi" :key="corso.id" :value="corso.id">
                {{ corso.titolo }}
              </option>
            </select>

            <label>Docente:</label>
            <select v-model="selectedClasse.docente.id" class="form-control">
              <option v-for="docente in docenti" :key="docente.id" :value="docente.id">
                {{ docente.nome }} {{ docente.cognome }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
            <button class="btn btn-success" @click="saveClasse">Salva</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal per Mostra Dettagli -->
    <div class="modal fade" id="detailsModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Dettagli Classe</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h6>Utenti:</h6>
            <ul>
              <li v-for="utente in utenti" :key="utente.id">
                {{ utente.nome }} - {{ utente.ruolo }}
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <lezione-modal/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CreaClasse from '@/components/classe/CreaClasse.vue'
import ClasseService from '@/service/ClasseService'
import UtenteService from '@/service/UtenteService'
import { Modal } from 'bootstrap'
import utenteService from '@/service/UtenteService'
import classeService from '@/service/ClasseService'
import corsoService from '@/service/CorsoService.js'
import LezioneModal from '@/components/classe/LezioneModal.vue'

const classi = ref([])
const selectedClasse = ref({
  id: null,
  nome: '',
  dataInizio: '',
  dataFine: '',
  corso: { id: null },
  docente: { id: null },
})
let modalInstance = null

const utenti = ref([])
const corsi = ref([])
const docenti = ref([])
let detailsModal = null

const fetchCorsi = async () => {
  try {
    corsi.value = await corsoService.findAll()
  } catch (error) {
    console.error('Errore nel recupero corsi:', error)
  }
}

const fetchDocenti = async () => {
  try {
    docenti.value = await utenteService.findByRuolo('DOCENTE')
  } catch (error) {
    console.error('Errore nel recupero docenti:', error)
  }
}

const fetchClassi = async () => {
  try {
    classi.value = await classeService.findAll()
  } catch (error) {
    console.error('Errore nel recupero classi:', error)
  }
}

const editClasse = (classe) => {
  selectedClasse.value = {
    ...classe,
  }
  if (!modalInstance) {
    modalInstance = new Modal(document.getElementById('editModal'))
  }
  fetchCorsi()
  fetchDocenti()
  modalInstance.show() // Apre il modal
}

const deleteClasse = (id) => {
  classeService.deleteu(id).then(() => {
    fetchClassi()
  })
}

const saveClasse = async () => {
  try {
    classeService.update(selectedClasse.value.id, selectedClasse.value).then(() => {
      fetchClassi()
    })

    modalInstance.hide()
  } catch (error) {
    console.error('Errore nel salvataggio:', error)
  }
}

const showDetails = async (id) => {
  try {
    const classe = await ClasseService.findById(id);
    const studenti = await ClasseService.getStudenti(id);
    const docente = classe.docente ? [await UtenteService.findById(classe.docente.id)] : [];

    utenti.value = [...studenti, ...docente]
      .map((utente) => ({
        nome: utente.nome,
        ruolo: utente.ruolo,
      }))
      .sort((a, b) => a.ruolo.localeCompare(b.ruolo));

    if (!detailsModal) {
      detailsModal = new Modal(document.getElementById('detailsModal'));
    }
    detailsModal.show();
  } catch (error) {
    console.error('Errore nel recupero dettagli classe:', error);
  }
};


onMounted(() => {
  fetchClassi()
})
</script>
