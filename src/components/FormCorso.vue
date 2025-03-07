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
      // Dati statici per ora (da sostituire con API in futuro)
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
