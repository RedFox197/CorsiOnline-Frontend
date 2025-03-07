<template>
  <div class="p-4 border rounded-lg shadow">
    <label class="block mb-2">Titolo</label>
    <input v-model="corsoLocal.titolo" class="border p-2 w-full mb-2" placeholder="Titolo del corso">

    <label class="block mb-2">Descrizione</label>
    <textarea v-model="corsoLocal.descrizione" class="border p-2 w-full mb-2" placeholder="Descrizione"></textarea>

    <div class="mt-4 flex gap-2">
      <button @click="salva" class="bg-green-500 text-white px-4 py-2 rounded">
        Salva
      </button>
      <button @click="$emit('chiudi')" class="bg-gray-500 text-white px-4 py-2 rounded">
        Annulla
      </button>
    </div>
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
      corsoLocal: { ...this.corso }
    };
  },
  methods: {
    salva() {
      this.$emit("salva", this.corsoLocal);
    }
  }
};
</script>

<style scoped>
</style>
