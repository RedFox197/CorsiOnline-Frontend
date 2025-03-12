<template>
  <div class="container mt-4">
    <h2 class="page-title">Elenco Corsi Disponibili</h2>
    <div class="d-flex justify-content-start mb-3">
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#createModal">
        Aggiungi Nuovo Corso
      </button>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome Corso</th>
          <th>Descrizione</th>
          <th>Classi Associate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="corso in corsi" :key="corso.id">
          <td>{{ corso.id }}</td>
          <td>{{ corso.titolo }}</td>
          <td>{{ corso.descrizione }}</td>
          <td>
            <ul v-if="corso.classi && corso.classi.length">
              <li v-for="classe in corso.classi" :key="classe.id">{{ classe.nome }}</li>
            </ul>
            <span v-else>Nessuna classe associata</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal per Creare un Corso -->
    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createModalLabel">Crea Nuovo Corso</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label>Nome Corso:</label>
            <input v-model="newCorso.titolo" class="form-control" />

            <label>Descrizione:</label>
            <textarea v-model="newCorso.descrizione" class="form-control"></textarea>

            <label>Seleziona Classe:</label>
            <select v-model="newCorso.classeId" class="form-control">
              <option v-for="classe in classi" :key="classe.id" :value="classe.id">
                {{ classe.nome }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
            <button class="btn btn-success" @click="createCorso">Crea Corso</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CorsoService from "@/service/CorsoService";
import ClasseService from "@/service/ClasseService";
import { Modal } from "bootstrap";

const corsi = ref([]);
const classi = ref([]);
const newCorso = ref({
  titolo: "",
  descrizione: "",
  classeId: null,
});

// Recupera i corsi e le classi al caricamento
const fetchCorsi = async () => {
  try {
    const response = await CorsoService.findAll();
    corsi.value = response;
  } catch (error) {
    console.error("Errore nel recupero dei corsi:", error);
  }
};

const fetchClassi = async () => {
  try {
    const response = await ClasseService.findAll();
    classi.value = response;
  } catch (error) {
    console.error("Errore nel recupero delle classi:", error);
  }
};

// Creazione di un nuovo corso
const createCorso = async () => {
  try {
    const corsoData = {
      titolo: newCorso.value.titolo,
      descrizione: newCorso.value.descrizione,
      classi: [{ id: newCorso.value.classeId }],
    };
    await CorsoService.save(corsoData);
    fetchCorsi();
    closeModal(); // Chiude il modal dopo il salvataggio
    newCorso.value = { titolo: "", descrizione: "", classeId: null };
  } catch (error) {
    console.error("Errore nella creazione del corso", error);
  }
};

// Chiude il modal
const closeModal = () => {
  const modalElement = document.getElementById("createModal");
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
  }
};

onMounted(() => {
  fetchCorsi();
  fetchClassi();
});
</script>

<style scoped>
.container {
  max-width: 80%;
  margin: auto;
}

.page-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.btn-success {
  background-color: #198754;
  border-color: #198754;
}
</style>
