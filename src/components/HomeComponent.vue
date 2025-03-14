<template>
  <div class="container">
    <h1>Benvenuto nel Gestionale Corsi Quackademy</h1>
    <p class="intro-text">Qui puoi gestire utenti, classi, corsi ed esami. Clicca su una delle voci per scoprire come fare.</p>

    <div class="sections">
      <div class="section" v-for="(item, index) in sections" :key="index">
        <button class="toggle-btn" @click="toggleSection(index)">
          {{ item.title }}
          <span class="arrow" :class="{ 'rotated': item.open }">▼</span>
        </button>
        <div v-if="item.open" class="content">
          <p>{{ item.description }}</p>
          <p class="note">Tutte le operazioni sono modificabili o eliminabili tramite gli appositi bottoni a destra di ogni sezione.</p>
        </div>
      </div>
    </div>
  </div>
  <img src="@/assets/logo.png" alt="Descrizione immagine" class="home-image">
</template>

<script>
export default {
  data() {
    return {
      sections: [
        {
          title: 'Gestione Utenti',
          description: 'Per aggiungere un utente vai su "Utente" e clicca su "Aggiungi nuovo utente". Dovrai inserire Nome, Cognome, Email, Ruolo e Classi associate.',
          open: false
        },
        {
          title: 'Gestione Classi',
          description: 'Per creare una nuova classe vai su "Classe" e clicca "Aggiungi nuova classe". Dovrai inserire Nome, Data Inizio, Data Fine, Corso associato e Docente.',
          open: false
        },
        {
          title: 'Gestione Esami',
          description: 'Per creare un esame vai su "Esame" e clicca "Aggiungi nuovo esame". Dovrai inserire il Tipo (orale, scritto, etc.), Descrizione, Punteggio ottenuto dallo studente, Studente associato e Data.',
          open: false
        },
        {
          title: 'Gestione Corsi',
          description: 'Per creare un corso vai su "Corso" e clicca "Aggiungi nuovo corso". Dovrai inserire il Nome, una Descrizione e selezionare la Classe associata.',
          open: false
        }
      ]
    };
  },
  methods: {
    toggleSection(index) {
      this.sections[index].open = !this.sections[index].open;
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  text-align: center;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.intro-text {
  font-size: 18px;
  color: #555;
}
.sections {
  margin-top: 20px;
}

.home-image {
  display: block;
  margin: 20px auto;
  max-width: 10%;
  border-radius: 10px;
}

.section {
  margin-bottom: 10px;
}
.toggle-btn {
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.toggle-btn:hover {
  background-color: #218838;
}
.arrow {
  transition: transform 0.3s ease;
}
.rotated {
  transform: rotate(180deg);
}
.content {
  background: #f8f9fa;
  padding: 15px;
  border-left: 4px solid #28a745;
  border-radius: 5px;
  margin-top: 5px;
}
.note {
  font-size: 14px;
  color: #888;
  margin-top: 10px;
}
</style>
