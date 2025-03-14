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
  <span v-for="(esame, index) in utente.esami" :key="esame.id">
    {{ esame.descrizione }}<span v-if="index !== utente.esami.length - 1">, </span>
  </span>
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
            <label>Classi:</label>
<div v-for="classe in classi" :key="classe.id" class="form-check">
  <input
    type="checkbox"
    class="form-check-input"
    :id="'classe-' + classe.id"
    :value="classe.id"
    v-model="selectedUtente.classiIds"
  />
  <label class="form-check-label" :for="'classe-' + classe.id">
    {{ classe.nome }}
  </label>
</div>

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

const classi = ref([])
const utenti = ref([])
const selectedUtente = ref({
  id: null,
  nome: '',
  cognome: '',
  email: '',
  ruolo: '',
  classiIds: [],
})
const newUtente = ref({
  nome: '',
  cognome: '',
  email: '',
  ruolo: '',
  classiIds: [],
})

let modalInstance = null
let createModalInstance = null

const fetchUtenti = async () => {
  try {
    utenti.value = await utenteService.findAll()
    for (let utente of utenti.value) {
      utente.classe = await utenteService.getClassi(utente.id)
      utente.esami = await utenteService.getEsami(utente.id)
      console.log(`Esami per utente ${utente.id}:`, utente.esami)
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

const editUtente = async (utente) => {
  selectedUtente.value = { ...utente }
  const classiUtente = await utenteService.getClassi(utente.id)
  selectedUtente.value.classiIds = classiUtente.map(cl => cl.id) || []

  if (!modalInstance) {
    modalInstance = new Modal(document.getElementById('editModal'))
  }
  modalInstance.show()
}



const saveUtente = async () => {
  try {
    await utenteService.update(selectedUtente.value.id, selectedUtente.value);


    const classiUtente = await utenteService.getClassi(selectedUtente.value.id);
    const classiUtenteIds = classiUtente.map(cl => cl.id);


    const classiDaRimuovere = classiUtenteIds.filter(id => !selectedUtente.value.classiIds.includes(id));

    const classiDaAggiungere = selectedUtente.value.classiIds.filter(id => !classiUtenteIds.includes(id));


    if (classiDaRimuovere.length > 0) {
      await utenteService.updateClassi(selectedUtente.value.id, classiDaRimuovere, true);
    }


    if (classiDaAggiungere.length > 0) {
      await utenteService.updateClassi(selectedUtente.value.id, classiDaAggiungere, false);
    }

    await fetchUtenti();
    modalInstance.hide();
  } catch (error) {
    console.error('Errore nel salvataggio:', error);
  }
};



const createUtente = async () => {
  try {
    await utenteService.save(newUtente.value)
    await fetchUtenti()
    createModalInstance.hide()
    newUtente.value = { nome: '', cognome: '', email: '', ruolo: '', classiIds: [] }
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
  createModalInstance = new Modal(document.getElementById('createModal'))
})
</script>

<style scoped>
/* Stile generale */
body {
  background-color: #f4f4f4;
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.container {
  max-width: 85%;
  margin: auto;
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  color: #222;
  text-align: center;
  font-size: 22px;
  margin-bottom: 20px;
}

/* Tabella */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background-color: #0dbc2d;
  color: white;
  padding: 10px;
  text-align: left;
  font-size: 14px;
}

.table td {
  background: #fff;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.table tbody tr:hover {
  background: #f1f1f1;
}

/* Pulsanti */
.btn {
  border-radius: 4px;
  padding: 8px 12px;
  font-weight: 500;
  transition: background 0.2s ease-in-out;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
  color: white;
}

.btn-success {
  background-color: #28a745;
  border: none;
  color: white;
}

/* Modali */
.modal-content {
  border-radius: 8px;
  padding: 15px;
}

.modal-header {
  background: #007bff;
  color: white;
  border-radius: 8px 8px 0 0;
  font-weight: bold;
}

/* Input e Select */
.form-control {
  border-radius: 4px;
  padding: 10px;
  border: 1px solid #ced4da;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 3px rgba(0, 123, 255, 0.3);
}

/* Checkbox */
.form-check-input:checked {
  background-color: #007bff;
  border-color: #007bff;
}
</style>
