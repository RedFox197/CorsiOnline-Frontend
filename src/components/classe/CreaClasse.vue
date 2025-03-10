<template>
  <div>
    <!-- Modal per la creazione -->
    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createModalLabel">Crea Nuova Classe</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label>Nome:</label>
            <input v-model="newClasse.nome" class="form-control" />
            <label>Data Inizio:</label>
            <input v-model="newClasse.dataInizio" type="date" class="form-control" />
            <label>Data Fine:</label>
            <input v-model="newClasse.dataFine" type="date" class="form-control" />
            <label>Corso:</label>
            <input v-model="newClasse.corso.titolo" class="form-control" />
            <label>Docente:</label>
            <input v-model="newClasse.docente.nome" class="form-control" />
            <input v-model="newClasse.docente.cognome" class="form-control" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
            <button class="btn btn-success" @click="createClasse">Crea Classe</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pulsante per aprire il Modal -->
    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#createModal">Aggiungi Nuova Classe</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const newClasse = ref({
  nome: '',
  dataInizio: '',
  dataFine: '',
  corso: {
    titolo: '',
  },
  docente: {
    nome: '',
    cognome: '',
  },
})

const emit = defineEmits('classi-created')

const createClasse = async () => {
  try {
    const response = await axios.post('http://localhost:8080/classi', newClasse.value)
    emit('classi-created')  // Emit l'evento per notificare il componente genitore
    console.log('Classe creata', response.data)
    // Reset the form after creating a class
    newClasse.value = {
      nome: '',
      dataInizio: '',
      dataFine: '',
      corso: {
        titolo: '',
      },
      docente: {
        nome: '',
        cognome: '',
      },
    }
  } catch (error) {
    console.error('Errore nella creazione della classe', error)
  }
}
</script>
