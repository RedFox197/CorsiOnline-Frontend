<template>
  <div class="container">
    <h2 class="title">Dettagli Corso</h2>
    <p><strong>Titolo:</strong> {{ corso?.titolo }}</p>
    <p><strong>Descrizione:</strong> {{ corso?.descrizione }}</p>

    <h3>Docenti</h3>
    <ul>
      <li v-for="docente in corso?.docenti" :key="docente.id">
        {{ docente.nome }} {{ docente.cognome }}
        <button @click="rimuoviDocente(docente.id)" class="remove-button">✖</button>
      </li>
    </ul>

    <h3>Studenti</h3>
    <ul>
      <li v-for="studente in corso?.studenti" :key="studente.id">
        {{ studente.nome }} {{ studente.cognome }}
        <button @click="rimuoviStudente(studente.id)" class="remove-button">✖</button>
      </li>
    </ul>

    <div class="button-container">
      <button @click="$router.push(`/corso/${corso.id}/modifica`)" class="edit-button">
  Modifica Corso
</button>

      <button @click="$router.push('/corso')" class="back-button">Torna ai Corsi</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      corsi: [
        { id: 1, titolo: "Corso di Vue", descrizione: "Impara Vue.js da zero", docenti: [{ id: 1, nome: "Mario", cognome: "Rossi" }], studenti: [{ id: 3, nome: "Anna", cognome: "Verdi" }] },
        { id: 2, titolo: "Corso di JavaScript", descrizione: "JS moderno e avanzato", docenti: [{ id: 2, nome: "Laura", cognome: "Bianchi" }], studenti: [{ id: 4, nome: "Luca", cognome: "Neri" }] }
      ],
      corso: null
    };
  },
  mounted() {
    const id = this.$route.params.id;
    this.corso = this.corsi.find(corso => corso.id == id);
  },
  methods: {
    rimuoviDocente(id) {
      this.corso.docenti = this.corso.docenti.filter(docente => docente.id !== id);
    },
    rimuoviStudente(id) {
      this.corso.studenti = this.corso.studenti.filter(studente => studente.id !== id);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.edit-button {
  background-color: #ffc107;
  color: black;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.edit-button:hover {
  background-color: #e0a800;
}
.back-button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.back-button:hover {
  background-color: #0056b3;
}
.remove-button {
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}
.remove-button:hover {
  background-color: darkred;
}
</style>
