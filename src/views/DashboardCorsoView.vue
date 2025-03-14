<template>
  <div class="container mt-4">
    <h2 class="page-title">Elenco Corsi Disponibili</h2> <!-- Titolo allineato a sinistra -->

    <!-- Tabella dei corsi -->
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
            <button class="btn btn-danger btn-sm ms-2" @click="deleteCorso(corso.id)">Elimina</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bottone Aggiungi Nuovo Corso SOTTO la tabella -->
    <div class="mt-3">
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#createModal">
        Aggiungi Nuovo Corso
      </button>
    </div>

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
    corsi.value = await CorsoService.findAll();
  } catch (error) {
    console.error("Errore nel recupero dei corsi:", error);
  }
};

// Creazione di un nuovo corso
const createCorso = async () => {
  try {
    await CorsoService.save(newCorso.value);
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
    await CorsoService.update(editCorso.value.id, editCorso.value);
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

onMounted(fetchCorsi);
</script>

<style scoped>
/* Stile generale */
body {
  background-color: #f4f4f4;
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.container {
  max-width: 80%;
  margin: auto;
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  color: #222;
  text-align: left; /* Allineato a sinistra per coerenza */
  font-size: 22px;
  margin-bottom: 20px;
}

/* Tabelle */
.table, .table-striped {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table-striped th {
  background-color: #28a745;
  color: white;
  padding: 10px;
  text-align: left;
  font-size: 14px;
}

.table td, .table-striped td {
  background: #fff;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.table tbody tr:hover, .table-striped tbody tr:hover {
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
