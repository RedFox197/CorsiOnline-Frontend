<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ isEditing ? "Modifica Corso" : "Nuovo Corso" }}</h1>

    <FormCorso :corso="corso" :isEditing="isEditing" @salva="salvaCorso" @chiudi="tornaIndietro" />
  </div>
</template>

<script>
import FormCorso from "@/components/FormCorso.vue";

//cose a caso

export default {
  components: { FormCorso },
  data() {
    return {
      corso: { titolo: "", descrizione: "" },
      isEditing: false
    };
  },
  methods: {
    salvaCorso(corso) {
      console.log("Salvato corso:", corso);
      this.$router.push("/dashboard");
    },
    tornaIndietro() {
      this.$router.push("/dashboard");
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
