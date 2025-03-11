<template>
  <div class="container">
    <h1 class="title">Aggiungi un Nuovo Corso</h1>

    <!-- Form per aggiungere un corso -->
    <form @submit.prevent="salvaCorso">
      <!-- Nome del Corso -->
      <div class="form-group">
        <label for="titolo">Nome del Corso:</label>
        <input id="titolo" v-model="corso.titolo" type="text" required />
      </div>

      <!-- Descrizione del Corso -->
      <div class="form-group">
        <label for="descrizione">Descrizione:</label>
        <textarea id="descrizione" v-model="corso.descrizione" required></textarea>
      </div>

      <!-- Selezione Docenti -->
      <div class="form-group">
        <label for="docenti">Seleziona i Docenti:</label>
        <select id="docenti" v-model="docentiSelezionati" multiple>
          <option v-for="docente in docenti" :key="docente.id" :value="docente.id">
            {{ docente.nome }} {{ docente.cognome }}
          </option>
        </select>
      </div>

      <!-- Selezione Studenti -->
      <div class="form-group">
        <label for="studenti">Seleziona gli Studenti:</label>
        <select id="studenti" v-model="studentiSelezionati" multiple>
          <option v-for="studente in studenti" :key="studente.id" :value="studente.id">
            {{ studente.nome }} {{ studente.cognome }}
          </option>
        </select>
      </div>

      <!-- Pulsanti -->
      <div class="button-container">
        <button type="submit" class="save-button">Salva</button>
        <button type="button" @click="annulla" class="cancel-button">Annulla</button>
      </div>
    </form>

    <!-- Messaggio di conferma -->
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const router = useRouter();

    const corso = ref({
      titolo: "",
      descrizione: "",
      docenti: [],
      studenti: []
    });

    const docenti = ref([]);
    const studenti = ref([]);
    const docentiSelezionati = ref([]);
    const studentiSelezionati = ref([]);
    const successMessage = ref("");

    // 🔹 Recupera tutti gli utenti e filtra per ruolo DOCENTE o STUDENTE
    const fetchUtenti = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/utenti");
        const utenti = response.data;

        docenti.value = utenti.filter(user => user.ruolo === "DOCENTE");
        studenti.value = utenti.filter(user => user.ruolo === "STUDENTE");
      } catch (error) {
        console.error("Errore nel recupero utenti:", error);
      }
    };

    // 🔹 Salva il nuovo corso con i docenti e gli studenti selezionati
    const salvaCorso = async () => {
      try {
        const nuovoCorso = {
          titolo: corso.value.titolo,
          descrizione: corso.value.descrizione,
          docenti: docentiSelezionati.value,
          studenti: studentiSelezionati.value
        };

        await axios.post("http://localhost:8080/api/v1/corsi", nuovoCorso);
        successMessage.value = "Corso aggiunto con successo!";

        // Dopo 2 secondi, reindirizza alla Dashboard Corsi
        setTimeout(() => {
          successMessage.value = "";
          router.push("/corso");
        }, 2000);
      } catch (error) {
        console.error("Errore nel salvataggio del corso:", error);
      }
    };

    const annulla = () => {
      router.push("/corso");
    };

    onMounted(fetchUtenti);

    return {
      corso,
      docenti,
      studenti,
      docentiSelezionati,
      studentiSelezionati,
      successMessage,
      salvaCorso,
      annulla
    };
  }
};
</script>

<style scoped>
/* Contenitore principale */
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Titolo centrato */
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

/* Form centrato */
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Form-group per centrare gli elementi */
.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  align-self: flex-start;
  margin-left: 5%;
}

/* Input, textarea e select centrati */
input, textarea, select {
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  text-align: center;
}

/* Pulsanti centrati */
.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
}

.save-button {
  background-color: #28a745;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.save-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #c82333;
}

/* Messaggio di conferma centrato */
.success-message {
  color: green;
  font-weight: bold;
  margin-top: 15px;
  text-align: center;
}
</style>
