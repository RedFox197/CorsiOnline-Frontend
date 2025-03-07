<template>
  <div class = "container">
    <table>
      <h1>Utenti</h1>
      <p v-if="utenti.length == 0">Nessun utente presente</p>
      <p v-for="utente in utenti" :key="utente.id">
        {{utente.nome}} {{utente.cognome}}</p>
    </table>
    <table>
      <h1>Classe</h1>
      <p v-if="utenti.length == 0">Nessuna classe presente</p>
      <p v-for = "utente in utenti" :key="utente.id">
        {{ utente.classe.nome }}
      </p>
    </table>
    <table>
      <h1>Corso</h1>
      <p v-if="utenti.length == 0">Nessun corso presente</p>
      <p v-for = "utente in utenti" :key="utente.id">
        {{ utente.corso.nome }}
      </p>
    </table>


  </div>
</template>

<script setup>
//script//
import { onMounted, ref } from 'vue'
import axios from 'axios'

const utenti = ref([])
const classi = ref([])


const init = async () => {
  try {
    const resUtenti = await axios.get('http://localhost:8080/utente/all')
    console.log('Risposta API per gli utenti:', resUtenti.data)
    utenti.value = resUtenti.data
    console.log('Utenti ricevuti:', utenti.value)

    const resClassi = await axios.get('http://localhost:8080/classe')
    console.log('Risposta API per i brand:', resClassi)
    classi.value = resClassi.data
    console.log('Classi ricevute:', classi.value)
  } catch (error) {
    console.error('Errore nel caricamento degli utenti o delle classi:', error)
  }
}

onMounted(init)

/*import { onMounted, ref } from 'vue'

const utenti = ref([])
const classi = ref([])

// Dati di test JSON
const testUtenti = [
  {
    "id": 1,
    "nome": "Mario",
    "cognome": "Rossi",
    "classe": { "id": 1, "nome": "MA001" },
    "corso" : { "id": 1, "nome": "Matematica" }
  },
  {
    "id": 2,
    "nome": "Giulia",
    "cognome": "Bianchi",
    "classe": { "id": 2, "nome": "JA001" },
    "corso": { "id": 1, "nome": "Java" }
  }
]

const init = () => {
  utenti.value = testUtenti
}

onMounted(init)*/
</script>

<style>
body{
  margin : 0;
}

.container{
  display: flex;;
  border: 1px solid black;
  border-radius: 5px;
  width: 28%;
  height: auto;
}

table{
  margin: 10px;
  padding: 10px;
}
</style>


