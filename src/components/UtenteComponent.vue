<template>
  <div class="container mt-4">
    <h2>Elenco Utenti</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Cognome</th>
          <th>Email</th>
          <th>Ruolo</th>
          <th>Classe</th>
          <th>Esami</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="utente in utenti" :key="utente.id">
          <td>{{ utente.id }}</td>
          <td>{{ utente.nome }}</td>
          <td>{{ utente.cognome }}</td>
          <td>{{ utente.email }}</td>
          <td>{{ utente.ruolo }}</td>
          <td>{{utente.classe.map(classe => classe.nome).join(', ')}}</td>
          <td>
            <ul>
              <li v-for="esame in utente.esami" :key="esame.id">{{ esame.titolo }}</li>
            </ul>
          </td>
          <td>
            <button class="btn btn-primary btn-sm" @click="editUtente(utente)">Modifica</button>
            <button class="btn btn-danger btn-sm ms-2" @click="deleteUtente(utente.id)">
              Elimina
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pulsante per aggiungere un nuovo utente -->
    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#createModal">
      Aggiungi Nuovo Utente
    </button>

    <!-- Modal Modifica Utente -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modifica Utente</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <label>Nome:</label>
            <input v-model="selectedUtente.nome" class="form-control" />
            <label>Cognome:</label>
            <input v-model="selectedUtente.cognome" class="form-control" />
            <label>Email:</label>
            <input v-model="selectedUtente.email" type="email" class="form-control" />
            <label>Ruolo:</label>
            <select v-model="selectedUtente.ruolo" class="form-control">
              <option value="STUDENTE">Studente</option>
              <option value="DOCENTE">Docente</option>
            </select>
            <label>Classe:</label>
            <select v-model="selectedUtente.classiIds" multiple class="form-control">
              <option v-for="classe in classi" :key="classe.id" :value="classe.id">
                {{ classe.nome }}
              </option>
            </select>
            <label>Esami:</label>
            <select v-model="newUtente.esamiIds" multiple class="form-control">
              <option v-for="esame in esami" :key="esame.id" :value="esame.id">
                {{ esame.titolo }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
            <button class="btn btn-primary" @click="saveUtente">Salva</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Creazione Utente -->
    <div class="modal fade" id="createModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Crea Nuovo Utente</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <label>Nome:</label>
            <input v-model="newUtente.nome" class="form-control" />
            <label>Cognome:</label>
            <input v-model="newUtente.cognome" class="form-control" />
            <label>Email:</label>
            <input v-model="newUtente.email" type="email" class="form-control" />
            <label>Ruolo:</label>
            <select v-model="newUtente.ruolo" class="form-control">
              <option value="STUDENTE">Studente</option>
              <option value="DOCENTE">Docente</option>
            </select>
            <label>Classe:</label>
            <select v-model="newUtente.classiIds" multiple class="form-control">
              <option v-for="classe in classi" :key="classe.id" :value="classe.id">
                {{ classe.nome }}
              </option>
            </select>
            <label>Esami:</label>
            <select v-model="newUtente.esamiIds" multiple class="form-control">
              <option v-for="esame in esami" :key="esame.id" :value="esame.id">
                {{ esame.titolo }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
            <button class="btn btn-success" @click="createUtente">Crea</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import utenteService from '@/service/UtenteService.js'
import { Modal } from 'bootstrap'
import EsameService from '@/service/EsameService'

const esami = ref([])
const classi = ref([])
const utenti = ref([])
const selectedUtente = ref({
  id: null,
  nome: '',
  cognome: '',
  email: '',
  ruolo: '',
  classiIds: [],
  esamiIds: [],
})
const newUtente = ref({
  nome: '',
  cognome: '',
  email: '',
  ruolo: '',
  classiIds: [],
  esamiIds: [],
})

let modalInstance = null
let createModalInstance = null

const fetchUtenti = async () => {
  try {
    utenti.value = await utenteService.findAll()
    for (let utente of utenti.value) {
      utente.classe = await utenteService.getClassi(utente.id)
      utente.esami = await utenteService.getEsami(utente.id)
    }
  } catch (error) {
    console.error('Errore nel recupero utenti:', error)
  }
}

const fetchClassi = async () => {
  try {
    classi.value = await utenteService.findAllClassi()
  } catch (error) {
    console.error('Errore nel recupero classi:', error)
  }
}

const fetchEsami = async () => {
  try {
    esami.value = await EsameService.findAll()
  } catch (error) {
    console.error('Errore nel recupero esami:', error)
  }
}

const editUtente = (utente) => {
  selectedUtente.value = { ...utente }
  if (!modalInstance) {
    modalInstance = new Modal(document.getElementById('editModal'))
  }
  modalInstance.show()
}

const saveUtente = async () => {
  try {
    await utenteService.update(selectedUtente.value.id, selectedUtente.value)
    await utenteService.updateClassi(
      selectedUtente.value.id,
      selectedUtente.value.classiIds,
      selectedUtente.value.esamiIds,
      false,
    )
    fetchUtenti()
    modalInstance.hide()
  } catch (error) {
    console.error('Errore nel salvataggio:', error)
  }
}

const createUtente = async () => {
  try {
    await utenteService.save(newUtente.value)
    await fetchUtenti()
    createModalInstance.hide()
    newUtente.value = { nome: '', cognome: '', email: '', ruolo: '', classiIds: [], esamiIds: [] }
    window.location.reload()
  } catch (error) {
    console.error("Errore nella creazione dell'utente:", error)
  }
}

const deleteUtente = async (id) => {
  if (confirm('Sei sicuro di voler eliminare questo utente?')) {
    try {
      await utenteService.deleteu(id)
      fetchUtenti()
    } catch (error) {
      console.error("Errore nell'eliminazione:", error)
    }
  }
}

onMounted(() => {
  fetchUtenti()
  fetchClassi()
  fetchEsami()
  createModalInstance = new Modal(document.getElementById('createModal'))
})
</script>
