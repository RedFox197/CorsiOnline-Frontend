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
            <button class="btn btn-primary btn-sm" @click="editClasse(classe)">Modifica</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Modifica -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modifica Classe</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <label>Nome:</label>
            <input v-model="selectedClasse.nome" class="form-control" />
            <label>Data Inizio:</label>
            <input v-model="selectedClasse.dataInizio" type="date" class="form-control" />
            <label>Data Fine:</label>
            <input v-model="selectedClasse.dataFine" type="date" class="form-control" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
            <button class="btn btn-success" @click="saveClasse">Salva</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Modal } from 'bootstrap'

export default {
  data() {
    return {
      classi: [],
      selectedClasse: {},
    }
  },
  mounted() {
    this.fetchClassi()
  },
  methods: {
    async fetchClassi() {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/classi')
        this.classi = response.data
      } catch (error) {
        console.error('Errore nel recupero classi:', error)
      }
    },
    editClasse(classe) {
      this.selectedClasse = { ...classe }
      new Modal(document.getElementById('editModal')).show()
    },
    async saveClasse() {
      try {
        await axios.put(
          `http://localhost:8080/api/v1/classi/${this.selectedClasse.id}`,
          this.selectedClasse,
        )
        this.fetchClassi()
        document.querySelector('#editModal .btn-close').click()
      } catch (error) {
        console.error('Errore nel salvataggio:', error)
      }
    },
  },
}
</script>
