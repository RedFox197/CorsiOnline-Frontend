<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Gestione Classi</h2>

    <div v-if="isLoading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
      <p class="mt-2">Caricamento dati in corso...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      <h4 class="alert-heading">Errore!</h4>
      <p>{{ error }}</p>
      <hr>
      <button class="btn btn-danger" @click="fetchClassi">Riprova</button>
    </div>

    <div v-else>
      <!-- Filtri -->
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <h5 class="card-title mb-3">Filtri</h5>
          <div class="row g-3">
            <div class="col-md-4">
              <div class="form-floating">
                <input type="text" class="form-control" id="filtroNome" v-model="filtro.nome" placeholder="Nome">
                <label for="filtroNome">Nome classe</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <select class="form-select" id="filtroCorso" v-model="filtro.corso">
                  <option value="">Tutti i corsi</option>
                  <option v-for="corso in corsiUnici" :key="corso.id" :value="corso.titolo">
                    {{ corso.titolo }}
                  </option>
                </select>
                <label for="filtroCorso">Corso</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-floating">
                <select class="form-select" id="filtroDocente" v-model="filtro.docente">
                  <option value="">Tutti i docenti</option>
                  <option v-for="docente in docentiUnici" :key="docente.id" :value="docente.nome + ' ' + docente.cognome">
                    {{ docente.nome }} {{ docente.cognome }}
                  </option>
                </select>
                <label for="filtroDocente">Docente</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Visualizzazione classi -->
      <div class="row">
        <div v-for="classe in classiFiltrate" :key="classe.id" class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 shadow hover-shadow border-0">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0">{{ classe.nome }}</h5>
              <span class="badge bg-light text-primary">ID: {{ classe.id }}</span>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <h6 class="card-subtitle mb-2 text-muted">Corso</h6>
                <p class="card-text">{{ classe.corso.titolo }}</p>
                <small class="text-muted">{{ classe.corso.descrizione }}</small>
              </div>

              <div class="mb-3">
                <h6 class="card-subtitle mb-2 text-muted">Periodo</h6>
                <div class="d-flex align-items-center">
                  <i class="bi bi-calendar-event me-2"></i>
                  <span>Dal {{ formatDate(classe.dataInizio) }} al {{ formatDate(classe.dataFine) }}</span>
                </div>
              </div>

              <div>
                <h6 class="card-subtitle mb-2 text-muted">Docente</h6>
                <div class="d-flex align-items-center">
                  <div class="avatar me-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    {{ getInitials(classe.docente.nome, classe.docente.cognome) }}
                  </div>
                  <div>
                    <strong>{{ classe.docente.nome }} {{ classe.docente.cognome }}</strong>
                    <div class="small text-muted">{{ classe.docente.email }}</div>
                    <div class="small">
                      <span class="badge bg-secondary">{{ classe.docente.ruolo }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer bg-white border-top-0">
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="apreModificaClasse(classe)">
                  <i class="bi bi-pencil-square me-1"></i> Modifica
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm">
                  <i class="bi bi-trash me-1"></i> Elimina
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="classiFiltrate.length === 0" class="col-12">
          <div class="alert alert-info text-center" role="alert">
            <i class="bi bi-info-circle me-2"></i> Nessuna classe trovata con i filtri selezionati.
          </div>
        </div>
      </div>
    </div>

    <!-- Modal per modifica classe -->
    <div class="modal fade" id="modificaClasseModal" tabindex="-1" aria-labelledby="modificaClasseModalLabel" aria-hidden="true" ref="modificaClasseModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="modificaClasseModalLabel">Modifica Classe</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="salvaModifiche">
              <div class="row g-3">
                <!-- Informazioni base -->
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="classeNome" v-model="classeInModifica.nome" required>
                    <label for="classeNome">Nome Classe</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="classeId" v-model="classeInModifica.id" disabled>
                    <label for="classeId">ID Classe</label>
                  </div>
                </div>

                <!-- Date -->
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input type="date" class="form-control" id="dataInizio" v-model="classeInModifica.dataInizio" required>
                    <label for="dataInizio">Data Inizio</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input type="date" class="form-control" id="dataFine" v-model="classeInModifica.dataFine" required>
                    <label for="dataFine">Data Fine</label>
                  </div>
                </div>

                <!-- Corso -->
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">Informazioni sul Corso</h5>
                </div>

                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="form-select" id="corsoSelect" v-model="classeInModifica.corso" required>
                      <option v-for="corso in corsiUnici" :key="corso.id" :value="corso">
                        {{ corso.titolo }}
                      </option>
                    </select>
                    <label for="corsoSelect">Corso</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="corsoId" v-model="classeInModifica.corso.id" disabled>
                    <label for="corsoId">ID Corso</label>
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-floating mb-3">
                    <textarea class="form-control" id="corsoDescrizione" v-model="classeInModifica.corso.descrizione" style="height: 100px"></textarea>
                    <label for="corsoDescrizione">Descrizione Corso</label>
                  </div>
                </div>

                <!-- Docente -->
                <div class="col-12">
                  <h5 class="border-bottom pb-2 mb-3">Informazioni sul Docente</h5>
                </div>

                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="form-select" id="docenteSelect" v-model="classeInModifica.docente" required>
                      <option v-for="docente in docentiUnici" :key="docente.id" :value="docente">
                        {{ docente.nome }} {{ docente.cognome }}
                      </option>
                    </select>
                    <label for="docenteSelect">Docente</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="docenteEmail" v-model="classeInModifica.docente.email" disabled>
                    <label for="docenteEmail">Email Docente</label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annulla</button>
            <button type="button" class="btn btn-primary" @click="salvaModifiche">
              <i class="bi bi-check-circle me-1"></i> Salva Modifiche
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast per notifiche -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5">
      <div id="notificaToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="notificaToast">
        <div class="toast-header" :class="[notifica.tipo === 'success' ? 'bg-success text-white' : 'bg-danger text-white']">
          <i class="bi" :class="[notifica.tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill']"></i>
          <strong class="ms-2 me-auto">{{ notifica.titolo }}</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ notifica.messaggio }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClassiList',
  data() {
    return {
      classi: [],
      isLoading: true,
      error: null,
      filtro: {
        nome: '',
        corso: '',
        docente: ''
      },
      classeInModifica: {
        id: null,
        nome: '',
        dataInizio: '',
        dataFine: '',
        corso: {
          id: null,
          titolo: '',
          descrizione: ''
        },
        docente: {
          id: null,
          nome: '',
          cognome: '',
          email: '',
          ruolo: ''
        }
      },
      modalInstance: null,
      toastInstance: null,
      notifica: {
        tipo: 'success',
        titolo: '',
        messaggio: ''
      }
    };
  },
  computed: {
    classiFiltrate() {
      return this.classi.filter(classe => {
        const nomeMatch = this.filtro.nome === '' ||
          classe.nome.toLowerCase().includes(this.filtro.nome.toLowerCase());

        const corsoMatch = this.filtro.corso === '' ||
          classe.corso.titolo === this.filtro.corso;

        const docenteNomeCompleto = `${classe.docente.nome} ${classe.docente.cognome}`;
        const docenteMatch = this.filtro.docente === '' ||
          docenteNomeCompleto === this.filtro.docente;

        return nomeMatch && corsoMatch && docenteMatch;
      });
    },
    corsiUnici() {
      const corsiMap = new Map();
      this.classi.forEach(classe => {
        if (!corsiMap.has(classe.corso.id)) {
          corsiMap.set(classe.corso.id, classe.corso);
        }
      });
      return Array.from(corsiMap.values());
    },
    docentiUnici() {
      const docentiMap = new Map();
      this.classi.forEach(classe => {
        if (!docentiMap.has(classe.docente.id)) {
          docentiMap.set(classe.docente.id, classe.docente);
        }
      });
      return Array.from(docentiMap.values());
    }
  },
  methods: {
    async fetchClassi() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch('http://localhost:8080/api/v1/classi');
        if (!response.ok) {
          throw new Error(`Errore di rete: ${response.status} ${response.statusText}`);
        }

        this.classi = await response.json();
      } catch (err) {
        this.error = `Si è verificato un errore durante il recupero dei dati: ${err.message}`;
        console.error('Errore nel recupero delle classi:', err);
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/D';

      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const date = new Date(dateString);

      // Verifica che la data sia valida
      if (isNaN(date.getTime())) {
        return 'Data non valida';
      }

      return date.toLocaleDateString('it-IT', options);
    },
    getInitials(nome, cognome) {
      if (!nome || !cognome) return '??';
      return `${nome.charAt(0)}${cognome.charAt(0)}`;
    },
    apreModificaClasse(classe) {
      // Crea una copia profonda dell'oggetto classe per evitare modifiche accidentali prima del salvataggio
      this.classeInModifica = JSON.parse(JSON.stringify(classe));
      this.modalInstance.show();
    },
    async salvaModifiche() {
      try {
        // Chiamata all'API per aggiornare la classe
        const response = await fetch(`http://localhost:8080/api/v1/classi/${this.classeInModifica.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.classeInModifica)
        });

        if (!response.ok) {
          throw new Error(`Errore durante l'aggiornamento: ${response.status} ${response.statusText}`);
        }

        // Aggiorna la classe nella lista locale
        const classeAggiornata = await response.json();
        const index = this.classi.findIndex(c => c.id === classeAggiornata.id);
        if (index !== -1) {
          this.classi[index] = classeAggiornata;
        }

        // Chiudi la modal
        this.modalInstance.hide();

        // Mostra notifica di successo
        this.mostraNotifica('success', 'Aggiornamento riuscito', 'La classe è stata aggiornata con successo.');
      } catch (err) {
        console.error('Errore durante il salvataggio delle modifiche:', err);
        this.mostraNotifica('error', 'Errore di aggiornamento', `Si è verificato un errore: ${err.message}`);
      }
    },
    mostraNotifica(tipo, titolo, messaggio) {
      this.notifica = {
        tipo,
        titolo,
        messaggio
      };
      this.toastInstance.show();
    },
    inizializzaComponentiBootstrap() {
      // Importa dinamicamente Bootstrap JS
      import('bootstrap/dist/js/bootstrap.bundle.min.js').then(bootstrap => {
        // Inizializza il modal
        this.modalInstance = new bootstrap.Modal(this.$refs.modificaClasseModal);

        // Inizializza il toast
        this.toastInstance = new bootstrap.Toast(this.$refs.notificaToast, {
          delay: 5000 // Durata 5 secondi
        });
      }).catch(error => {
        console.error('Errore nel caricamento di Bootstrap JS:', error);
      });
    }
  },
  mounted() {
    this.fetchClassi();

    // Aggiunta di Bootstrap Icons via CDN
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Inizializza componenti Bootstrap
    this.inizializzaComponentiBootstrap();
  }
};
</script>

<style scoped>
.hover-shadow {
  transition: all 0.3s ease;
}

.hover-shadow:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.avatar {
  font-weight: bold;
  font-size: 14px;
}

/* Stile per il modal */
.modal-header.bg-primary button.btn-close-white:focus {
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.form-floating > .form-control:disabled,
.form-floating > .form-control[readonly] {
  background-color: #f8f9fa;
}
</style>
