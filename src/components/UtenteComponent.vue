<template>
  <div class = "container">
    <table>
      <h1>Utenti</h1>
      <p v-if="utenti.length == 0">Nessun utente presente</p>
      <p v-for="utente in utenti" :key="utente.id">
        {{utente.nome}} {{utente.cognome}}</p>
    </table>
    <table>
      <h1>Ruolo</h1>
      <p v-if="utenti.length == 0">Nessun ruolo presente</p>
      <p v-for="utente in utenti" :key="utente.id">
        {{ formatRuolo(utente.ruolo) }} </p>
    </table>
    <table>
      <h1>Classe</h1>
      <p v-if="utenti.length == 0">Nessuna classe presente</p>
      <p v-for = "utente in utenti" :key="utente.id">
        {{ utente.classe?.nome }}
      </p>
    </table>
    <table>
      <h1>Corso</h1>
      <p v-if="utenti.length == 0">Nessun corso presente</p>
      <p v-for = "utente in utenti" :key="utente.id">
        {{ utente.corso?.nome }}
      </p>
    </table>


  </div>
</template>

<script setup>
//script//
import { onMounted, ref } from 'vue'
import axios from 'axios'

const utenti = ref([
  { id: 1, ruolo: 'ADMIN' },
  { id: 2, ruolo: 'USER' },
  { id: 3, ruolo: 'GUEST' }
])

//formatto il carattere di ruolo

const formatRuolo = (ruolo) => {
  return ruolo.charAt(0).toUpperCase() + ruolo.slice(1).toLowerCase();
}

const classi = ref([])


const init = async () => {
  try {
    const resUtenti = await axios.get('http://localhost:8080/utente/all')
    console.log('Risposta API per gli utenti:', resUtenti.data)
    utenti.value = resUtenti.data
    console.log('Utenti ricevuti:', utenti.value)

    const resClassi = await axios.get('http://localhost:8080/classe/all')
    console.log('Risposta API per i brand:', resClassi)
    classi.value = resClassi.data
    console.log('Classi ricevute:', classi.value)
  } catch (error) {
    console.error('Errore nel caricamento degli utenti o delle classi:', error)
  }
}

onMounted(init)

</script>

<style>
body{
  margin : 0;
}

.container{
  display: flex;;
  border: 1px solid black;
  border-radius: 5px;
  width: 35%;
  height: auto;
}

table{
  margin: 10px;
  padding: 10px;
}
</style>


