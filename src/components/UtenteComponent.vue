<template>
  <div class="container">
    <div class="section">
      <h1>Utenti</h1>
      <p v-if="utenti.length === 0">Nessun utente presente</p>
      <p v-for="utente in utenti" :key="utente.id">
        {{ utente.nome }} {{ utente.cognome }}
        <button class="info" @click="mostraInfoStudente(utente)">
          Info
        </button>
      </p>
    </div>

    <div class="section">
      <h1>Ruolo</h1>
      <p v-if="utenti.length === 0">Nessun ruolo presente</p>
      <p v-for="utente in utenti" :key="utente.id">
        {{ formatRuolo(utente.ruolo) }}
      </p>
    </div>

    <div class="section">
      <h1>Classe</h1>
      <p v-if="utenti.length === 0">Nessuna classe presente</p>
      <p v-for="utente in utenti" :key="utente.id">
        {{ utente.classe?.nome || 'N/A' }}
      </p>
    </div>

    <div class="section">
      <h1>Corso</h1>
      <p v-if="utenti.length === 0">Nessun corso presente</p>
      <p v-for="utente in utenti" :key="utente.id">
        {{ utente.corso?.nome || 'N/A' }}
      </p>
    </div>
  </div>

  <table class="info-table" v-if="studenteSelezionato">
    <h1>Info</h1>
    <tr><td>ID:</td><td>{{ studenteSelezionato.id }}</td></tr>
    <tr><td>Nome:</td><td>{{ studenteSelezionato.nome }}</td></tr>
    <tr><td>Cognome:</td><td>{{ studenteSelezionato.cognome }}</td></tr>
    <tr><td>Email:</td><td>{{ studenteSelezionato.email }}</td></tr>
    <tr><td>Ruolo:</td><td>{{ formatRuolo(studenteSelezionato.ruolo) }}</td></tr>
    <tr><td>Classe:</td><td>{{ studenteSelezionato.classe?.nome || 'N/A' }}</td></tr>
    <tr><td>Corso:</td><td>{{ studenteSelezionato.corso?.nome || 'N/A' }}</td></tr>
  </table>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const utenti = ref([]);
const studenteSelezionato = ref(null);

const formatRuolo = (ruolo) => {
  return ruolo ? ruolo.charAt(0).toUpperCase() + ruolo.slice(1).toLowerCase() : 'N/A';
};

const mostraInfoStudente = (utente) => {
  studenteSelezionato.value = utente;
};

const init = async () => {
  try {
    const resUtenti = await axios.get('http://localhost:8080/api/v1/utenti');
    utenti.value = resUtenti.data;
  } catch (error) {
    console.error('Errore nel caricamento degli utenti:', error);
  }
};

onMounted(init);
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
}

.container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding: 20px;
  margin: 20px auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.info {
  border-radius: 5px;
}

.section {
  width: 22%;
  padding: 6px;

}

h1 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 3px 8px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.info-table {
  width: 60%;
  margin: 20px auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.info-table td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}
</style>
