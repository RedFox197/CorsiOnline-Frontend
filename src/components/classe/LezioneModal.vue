<template>
  <div class="modal fade show" tabindex="-1" style="display: block">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Calendario Lezioni - Classe {{ classeId }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <!-- Pulsante Aggiungi Lezione -->
          <button class="btn btn-primary mb-3" @click="openForm">
            <i class="bi bi-plus-circle"></i> Aggiungi Lezione
          </button>

          <!-- Form Aggiungi/Modifica -->
          <div v-if="showForm" class="card mb-3">
            <div class="card-body">
              <h5>{{ editingLesson.id ? 'Modifica Lezione' : 'Nuova Lezione' }}</h5>
              <div class="mb-3">
                <label>Titolo</label>
                <input v-model="form.title" class="form-control" required />
              </div>
              <div class="mb-3">
                <label>Descrizione</label>
                <textarea v-model="form.description" class="form-control" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label>Orario</label>
                <input v-model="form.schedule" type="datetime-local" class="form-control" required />
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-success" @click="saveLesson">
                  {{ editingLesson.id ? 'Aggiorna' : 'Crea' }}
                </button>
                <button class="btn btn-secondary" @click="cancelEdit">Annulla</button>
              </div>
            </div>
          </div>

          <!-- Calendario Giornaliero -->
          <div v-else>
            <div v-if="groupedLessons.length === 0" class="alert alert-info">
              Nessuna lezione pianificata
            </div>

            <div v-for="day in groupedLessons" :key="day.date" class="mb-4">
              <!-- Header Giorno -->
              <div
                class="d-flex justify-content-between align-items-center bg-light p-3 rounded-top cursor-pointer"
                @click="toggleDay(day.date)"
              >
                <h6 class="m-0">{{ formatDayHeader(day.date) }}</h6>
                <i class="bi" :class="day.open ? 'bi-caret-down' : 'bi-caret-right'"></i>
              </div>

              <!-- Contenuto Giorno -->
              <div v-show="day.open" class="border border-top-0 p-3 rounded-bottom">
                <div
                  v-for="lesson in day.lessons"
                  :key="lesson.id"
                  class="card mb-2 shadow-sm"
                >
                  <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 class="card-title mb-1">{{ lesson.title }}</h6>
                        <small class="text-muted">{{ lesson.schedule }}</small>
                      </div>
                      <div class="d-flex gap-2">
                        <button class="btn btn-warning btn-sm" @click="editLesson(lesson)">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" @click="deleteLesson(lesson.id)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p class="card-text mt-2 mb-0">{{ lesson.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  classeId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close'])

const lessons = ref([])
const groupedLessons = ref([])
const showForm = ref(false)
const form = ref({
  title: '',
  description: '',
  schedule: ''
})
const editingLesson = ref({})

// Raggruppa le lezioni per giorno
const groupLessonsByDay = () => {
  const groups = {}
  lessons.value.forEach(lesson => {
    const dateKey = lesson.schedule.split('T')[0]
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: dateKey,
        open: false,
        lessons: []
      }
    }
    groups[dateKey].lessons.push(lesson)
  })
  groupedLessons.value = Object.values(groups)
}

// Formatta l'header del giorno
const formatDayHeader = (dateString) => {
  const date = new Date(dateString)
  const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
  return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth()+1}`
}

// Toggle espansione giorno
const toggleDay = (date) => {
  const day = groupedLessons.value.find(d => d.date === date)
  if (day) day.open = !day.open
}

// Recupera le lezioni della classe
const fetchLessons = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/v1/classi/${props.classeId}/lezioni`)
    lessons.value = res.data
    groupLessonsByDay()
  } catch (error) {
    console.error('Errore nel caricamento:', error)
  }
}

// Salva/aggiorna lezione
const saveLesson = async () => {
  try {
    if (editingLesson.value.id) {
      await axios.put(
        `http://localhost:8080/api/v1/lezioni/${editingLesson.value.id}`,
        form.value
      )
    } else {
      await axios.post(
        `http://localhost:8080/api/v1/classi/${props.classeId}/lezioni`,
        form.value
      )
    }
    await fetchLessons()
    cancelEdit()
  } catch (error) {
    console.error('Errore durante il salvataggio:', error)
  }
}

// Avvia modifica lezione
const editLesson = (lesson) => {
  editingLesson.value = { ...lesson }
  form.value = {
    title: lesson.title,
    description: lesson.description,
    schedule: lesson.schedule.slice(0, 16)
  }
  showForm.value = true
}

// Elimina lezione
const deleteLesson = async (id) => {
  if (confirm('Confermi l\'eliminazione?')) {
    try {
      await axios.delete(`http://localhost:8080/api/v1/lezioni/${id}`)
      await fetchLessons()
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error)
    }
  }
}

// Reset form
const cancelEdit = () => {
  form.value = { title: '', description: '', schedule: '' }
  editingLesson.value = {}
  showForm.value = false
}

// Chiude il modal
const closeModal = () => {
  emit('close')
  cancelEdit()
}

// Apre il form
const openForm = () => {
  showForm.value = true
}

// Aggiorna quando cambia la classe
watch(() => props.classeId, (newVal) => {
  if (newVal) {
    fetchLessons()
    cancelEdit()
  }
}, { immediate: true })
</script>
