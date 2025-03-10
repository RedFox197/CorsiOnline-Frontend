<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import FormCorso from '@/components/FormCorso.vue'

/* object format
[
  {
    "id": 1,
    "nome": "TEST",
    "dataInizio": "2025-03-06",
    "dataFine": "2025-03-05",
    "corso": {
      "id": 1,
      "titolo": "Java junior developoer",
      "descrizione": "Boh java juneior dev"
    },
    "docente": {
      "id": 1,
      "nome": "Luigi",
      "cognome": "Matrone",
      "email": "luigimatrone@hotmail.com",
      "ruolo": "STUDENTE"
    }
  }
]
 */
const classi = ref([])

async function init() {
  const resClasses = await axios.get('http://localhost:8080/api/v1/classi')

  classi.value = resClasses.data
}

onMounted(init)
</script>

<template>
  <div v-for="classe in classi" :key="classe.id">
    <p>ID: {{classe.id}}</p>
    <p>Nome: {{classe.nome}}</p>
    <p>Data Inizio: {{classe.dataInizio}}</p>
    <p>Data Fine: {{classe.dataFine}}</p>
    <p>Corso: {{classe.corso.titolo}}</p>
    <p>Docente: {{classe.docente.nome}} {{classe.docente.cognome}}</p>
  </div>
</template>

<style scoped></style>
