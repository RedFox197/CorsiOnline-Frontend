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
          <td>{{ utente.classe ? utente.classe.nome : 'N/A' }}</td>
          <td>
            <ul>
              <li v-for="esame in utente.esami" :key="esame.id">{{ esame.titolo }}</li>
            </ul>
          </td>
          <td>
            <button class="btn btn-primary btn-sm" @click="editUtente(utente)">Modifica</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Modifica -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modifica Utente</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label>Nome:</label>
            <input v-model="selectedUtente.nome" class="form-control" />
            <label>Cognome:</label>
            <input v-model="selectedUtente.cognome" class="form-control" />
            <label>Email:</label>
            <input v-model="selectedUtente.email" type="email" class="form-control" />
            <label>Ruolo:</label>
            <input v-model="selectedUtente.ruolo" class="form-control" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
            <button class="btn btn-success" @click="saveUtente">Salva</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import utenteService from '@/service/UtenteService.js'
import { Modal } from 'bootstrap';

const utenti = ref([]);
const selectedUtente = ref({});
let modalInstance = null;

const fetchUtenti = async () => {
  try {
    utenti.value = await utenteService.findAll();
    for (let utente of utenti.value) {
      utente.classe = await utenteService.getClassi(utente.id);
      utente.esami = await utenteService.getEsami(utente.id);
    }
  } catch (error) {
    console.error('Errore nel recupero utenti:', error);
  }
};

const editUtente = (utente) => {
  selectedUtente.value = { ...utente };
  if (!modalInstance) {
    modalInstance = new Modal(document.getElementById('editModal'));
  }
  modalInstance.show();
};

const saveUtente = async () => {
  try {
    await utenteService.update(selectedUtente.value.id, selectedUtente.value);
    fetchUtenti();
    modalInstance.hide();
  } catch (error) {
    console.error('Errore nel salvataggio:', error);
  }
};

onMounted(() => {
  fetchUtenti();
});
</script>
