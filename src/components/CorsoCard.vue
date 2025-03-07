<template>
  <div class="border p-4 mb-4 rounded-lg shadow">
    <h2 class="text-xl font-semibold">{{ corso.titolo }}</h2>
    <p class="text-gray-600">{{ corso.descrizione }}</p>
    <p class="text-gray-800"><strong>Programma:</strong> {{ corso.programma }}</p>

    <div class="mt-4 flex gap-2">
      <button @click="$emit('modifica', corso.id)" class="bg-yellow-500 text-white px-4 py-2 rounded">
        Modifica
      </button>
      <button @click="$emit('elimina', corso.id)" class="bg-red-500 text-white px-4 py-2 rounded">
        Elimina
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    corso: Object,
  }
};
</script>

<style scoped>
</style>
