<template>
  <div class="container">
    <h2 class="title">{{ isEditing ? "Modifica Corso" : "Nuovo Corso" }}</h2>

    <form @submit.prevent="salva">
      <!-- nome del Corso -->
      <label for="nome">Nome del Corso</label>
      <input id="nome" v-model="corsoLocal.nome" type="text" class="input" placeholder="Inserisci il nome" required>

      <!-- Descrizione -->
      <label for="descrizione">Descrizione</label>
      <textarea id="descrizione" v-model="corsoLocal.descrizione" class="textarea" placeholder="Descrizione..." required></textarea>

      <!-- Selezione Docenti -->
      <label for="docenti">Docenti</label>
      <select id="docenti" v-model="docenteSelezionato" class="select" @change="aggiungiDocente">
        <option value="" disabled selected>Seleziona un docente</option>
        <option v-for="docente in docentiDisponibili" :key="docente.id" :value="docente">
          {{ docente.nome }} {{ docente.cognome }}
        </option>
      </select>

      <ul class="list">
        <li v-for="docente in corsoLocal.docenti" :key="docente.id">
          {{ docente.nome }} {{ docente.cognome }}
          <button type="button" @click="rimuoviDocente(docente.id)" class="remove-btn">✖</button>
        </li>
      </ul>

      <!-- Selezione Studenti -->
      <label for="studenti">Studenti</label>
      <select id="studenti" v-model="studenteSelezionato" class="select" @change="aggiungiStudente">
        <option value="" disabled selected>Seleziona uno studente</option>
        <option v-for="studente in studentiDisponibili" :key="studente.id" :value="studente">
          {{ studente.nome }} {{ studente.cognome }}
        </option>
      </select>

      <ul class="list">
        <li v-for="studente in corsoLocal.studenti" :key="studente.id">
          {{ studente.nome }} {{ studente.cognome }}
          <button type="button" @click="rimuoviStudente(studente.id)" class="remove-btn">✖</button>
        </li>
      </ul>

      <!-- Pulsanti -->
      <div class="button-container">
        <button type="submit" class="save-btn">Salva</button>
        <button type="button" @click="$emit('chiudi')" class="cancel-btn">Annulla</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    corso: Object,
    isEditing: Boolean
  },
  data() {
    return {
      corsoLocal: { ...this.corso, docenti: [], studenti: [] },
      docenteSelezionato: "",
      studenteSelezionato: "",
      docentiDisponibili: [
        { id: 1, nome: "Mario", cognome: "Rossi" },
        { id: 2, nome: "Laura", cognome: "Bianchi" }
      ],
      studentiDisponibili: [
        { id: 3, nome: "Anna", cognome: "Verdi" },
        { id: 4, nome: "Luca", cognome: "Neri" }
      ]
    };
  },
  methods: {
    aggiungiDocente() {
      if (this.docenteSelezionato && !this.corsoLocal.docenti.includes(this.docenteSelezionato)) {
        this.corsoLocal.docenti.push(this.docenteSelezionato);
      }
      this.docenteSelezionato = "";
    },
    rimuoviDocente(id) {
      this.corsoLocal.docenti = this.corsoLocal.docenti.filter(d => d.id !== id);
    },
    aggiungiStudente() {
      if (this.studenteSelezionato && !this.corsoLocal.studenti.includes(this.studenteSelezionato)) {
        this.corsoLocal.studenti.push(this.studenteSelezionato);
      }
      this.studenteSelezionato = "";
    },
    rimuoviStudente(id) {
      this.corsoLocal.studenti = this.corsoLocal.studenti.filter(s => s.id !== id);
    },
    salva() {
      console.log("Dati inviati:", this.corsoLocal);
      this.$emit("salva", this.corsoLocal);
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
.input, .textarea, .select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.list {
  list-style: none;
  padding: 0;
}
.list li {
  display: flex;
  justify-content: space-between;
  background: #e9ecef;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 5px;
}
.remove-btn {
  background: transparent;
  border: none;
  color: red;
  font-weight: bold;
  cursor: pointer;
}
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.save-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
}
.cancel-btn {
  background-color: #dc3545;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
}
</style>
