<template>
  <div>
    <!-- Modal per la creazione -->
    <div
      class="modal fade"
      id="createModal"
      tabindex="-1"
      aria-labelledby="createModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createModalLabel">Crea Nuova Classe</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <label>Nome:</label>
            <input v-model="newClasse.nome" class="form-control" />

            <label>Data Inizio:</label>
            <input v-model="newClasse.dataInizio" type="date" class="form-control" />

            <label>Data Fine:</label>
            <input v-model="newClasse.dataFine" type="date" class="form-control" />

            <label>Corso:</label>
            <select v-model="newClasse.corso.id" class="form-control">
              <option v-for="corso in corsi" :key="corso.id" :value="corso.id">
                {{ corso.titolo }}
              </option>
            </select>

            <label>Docente:</label>
            <select v-model="newClasse.docente.id" class="form-control">
              <option v-for="docente in docenti" :key="docente.id" :value="docente.id">
                {{ docente.nome }} {{ docente.cognome }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
            <button class="btn btn-success" @click="createClasse">Crea Classe</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pulsante per aprire il Modal -->
    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#createModal">
      Aggiungi Nuova Classe
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import utenteService from '@/service/UtenteService.js'
import corsoService from '@/service/CorsoService.js'
import classeService from '@/service/ClasseService.js'

const newClasse = ref({
  nome: '',
  dataInizio: '',
  dataFine: '',
  corso: {
    id: null,
  },
  docente: {
    id: null,
  },
})

const corsi = ref([])
const docenti = ref([])

const emit = defineEmits('classi-created')

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
    console.log(docenti.value)
  } catch (error) {
    console.error('Errore nel recupero docenti:', error)
  }
}

const createClasse = async () => {
  try {
    const classeData = {
      ...newClasse.value,
      corso: { id: newClasse.value.corso.id },
      docente: { id: newClasse.value.docente.id },
    }
    const response = await classeService.save(classeData)
    emit('classi-created')
    console.log('Classe creata', response.data)

    newClasse.value = {
      nome: '',
      dataInizio: '',
      dataFine: '',
      corso: { id: null },
      docente: { id: null },
    }
  } catch (error) {
    console.error('Errore nella creazione della classe', error)
  }
}

onMounted(() => {
  fetchCorsi()
  fetchDocenti()
})
</script>

<style scoped>

.btn-success {
  background-color: #0dbc2d;
  border-color: #0dbc2d;
}

.btn-success:hover {
  background-color: #0a9a24;
  border-color: #0a9a24;
}

</style>
