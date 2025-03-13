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
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="corso in corsi" :key="corso.id">
          <td>{{ corso.id }}</td>
          <td>{{ corso.titolo }}</td>
          <td>{{ corso.descrizione }}</td>
          <td>
            <button class="btn btn-primary btn-sm" @click="openEditModal(corso)">Modifica</button>
            <button class="btn btn-danger btn-sm" @click="deleteCorso(corso.id)">Elimina</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal per Creare un Corso -->
    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Crea Nuovo Corso</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label>Nome Corso:</label>
            <input v-model="newCorso.titolo" class="form-control" />

            <label>Descrizione:</label>
            <textarea v-model="newCorso.descrizione" class="form-control"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
            <button class="btn btn-success" @click="createCorso">Crea Corso</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal per Modificare un Corso -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modifica Corso</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label>Nome Corso:</label>
            <input v-model="editCorso.titolo" class="form-control" />

            <label>Descrizione:</label>
            <textarea v-model="editCorso.descrizione" class="form-control"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
            <button class="btn btn-success" @click="updateCorso">Salva Modifiche</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CorsoService from "@/service/CorsoService";
import { Modal } from "bootstrap";

const corsi = ref([]);
const newCorso = ref({ titolo: "", descrizione: "" });
const editCorso = ref({ id: null, titolo: "", descrizione: "" });

// Recupera i corsi al caricamento
const fetchCorsi = async () => {
  try {
    const response = await CorsoService.findAll();
    corsi.value = response;
  } catch (error) {
    console.error("Errore nel recupero dei corsi:", error);
  }
};

// Creazione di un nuovo corso
const createCorso = async () => {
  try {
    const corsoData = {
      titolo: newCorso.value.titolo,
      descrizione: newCorso.value.descrizione,
    };
    await CorsoService.save(corsoData);
    window.location.reload(); // Ricarica la pagina dopo la creazione
  } catch (error) {
    console.error("Errore nella creazione del corso", error);
  }
};

// Apertura modale modifica
const openEditModal = (corso) => {
  editCorso.value = { ...corso };
  const modalElement = document.getElementById("editModal");
  new Modal(modalElement).show();
};

// Modifica di un corso
const updateCorso = async () => {
  try {
    const corsoData = {
      titolo: editCorso.value.titolo,
      descrizione: editCorso.value.descrizione,
    };
    await CorsoService.update(editCorso.value.id, corsoData);
    window.location.reload(); // Ricarica la pagina dopo la modifica
  } catch (error) {
    console.error("Errore nella modifica del corso:", error);
  }
};

// Eliminazione di un corso
const deleteCorso = async (id) => {
  if (confirm("Sei sicuro di voler eliminare questo corso?")) {
    try {
      await CorsoService.deleteu(id);
      window.location.reload(); // Ricarica la pagina dopo l'eliminazione
    } catch (error) {
      console.error("Errore nella cancellazione del corso:", error);
    }
  }
};

onMounted(() => {
  fetchCorsi();
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
