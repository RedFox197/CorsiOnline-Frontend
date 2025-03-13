<template>
  <div class="modal fade" id="lezioniModal" tabindex="-1" aria-labelledby="lezioniModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Calendario Lezioni - Classe {{ classeId }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <button class="btn btn-primary mb-3" @click="openForm">
            <i class="bi bi-plus-circle"></i> Aggiungi Lezione
          </button>

          <div v-if="showForm" class="card mb-3">
            <div class="card-body">
              <h5>{{ editingLesson.id ? 'Modifica Lezione' : 'Nuova Lezione' }}</h5>
              <div class="mb-3">
                <label>Titolo</label>
                <input v-model="form.titolo" class="form-control" required />
              </div>
              <div class="mb-3">
                <label>Descrizione</label>
                <textarea v-model="form.descrizione" class="form-control" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label>Orario</label>
                <input v-model="form.data" type="datetime-local" class="form-control" required />
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-success" @click="saveLesson">{{ editingLesson.id ? 'Aggiorna' : 'Crea' }}</button>
                <button class="btn btn-secondary" @click="cancelEdit">Annulla</button>
              </div>
            </div>
          </div>

          <div v-else>
            <div v-if="groupedLessons.length === 0" class="alert alert-info">Nessuna lezione pianificata</div>

            <div v-for="day in groupedLessons" :key="day.date" class="mb-4">
              <div class="d-flex justify-content-between align-items-center bg-light p-3 rounded-top cursor-pointer" @click="toggleDay(day.date)">
                <h6 class="m-0">{{ formatDayHeader(day.date) }}</h6>
                <i class="bi" :class="day.open ? 'bi-caret-down' : 'bi-caret-right'"></i>
              </div>
              <div v-show="day.open" class="border border-top-0 p-3 rounded-bottom">
                <div v-for="lesson in day.lessons" :key="lesson.id" class="card mb-2 shadow-sm">
                  <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 class="card-title mb-1">{{ lesson.titolo }}</h6>
                        <small class="text-muted">{{ lesson.data }}</small>
                      </div>
                      <div class="d-flex gap-2">
                        <button class="btn btn-warning btn-sm" @click="editLesson(lesson)"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-danger btn-sm" @click="deleteLesson(lesson.id)"><i class="bi bi-trash"></i></button>
                      </div>
                    </div>
                    <p class="card-text mt-2 mb-0">{{ lesson.descrizione }}</p>
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
import { Modal } from 'bootstrap'
import lezioneService from '@/service/LezioneService.js'
import classeService from '@/service/ClasseService.js'

const props = defineProps({ classeId: Number })
const emit = defineEmits(['close'])

const lessons = ref([])
const groupedLessons = ref([])
const showForm = ref(false)
const editingLesson = ref({})
const form = ref({ id: null, titolo: '', descrizione: '', data: '', classe: { id: props.classeId } })

const open = () => new Modal(document.getElementById('lezioniModal')).show()
defineExpose({ open })

const groupLessonsByDay = () => {
  const groups = {}
  lessons.value.forEach(lesson => {
    const dateKey = lesson.data.split('T')[0]
    if (!groups[dateKey]) groups[dateKey] = { date: dateKey, open: false, lessons: [] }
    groups[dateKey].lessons.push(lesson)
  })
  groupedLessons.value = Object.values(groups)
}

const formatDayHeader = dateString => {
  const date = new Date(dateString)
  const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
  return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`
}

const toggleDay = date => {
  const day = groupedLessons.value.find(d => d.date === date)
  if (day) day.open = !day.open
}

const fetchLessons = async () => {
  try {
    lessons.value = await classeService.getLezioni(props.classeId)
    groupLessonsByDay()
  } catch (error) {
    console.error('Errore nel caricamento:', error)
  }
}

const saveLesson = async () => {
  try {
    editingLesson.value.id ? await lezioneService.update(editingLesson.value.id, form.value) : await lezioneService.save(form.value)
    await fetchLessons()
    cancelEdit()
  } catch (error) {
    console.error('Errore durante il salvataggio:', error)
  }
}

const editLesson = lesson => {
  editingLesson.value = { ...lesson }
  form.value = { id: lesson.id, titolo: lesson.titolo, descrizione: lesson.descrizione, data: lesson.data, classe: { id: props.classeId } }
  showForm.value = true
}

const deleteLesson = async id => {
  if (confirm('Confermi l\'eliminazione?')) {
    try {
      await lezioneService.deleteu(id)
      await fetchLessons()
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error)
    }
  }
}

const cancelEdit = () => {
  form.value = { id: null, titolo: '', descrizione: '', data: '', classe: { id: props.classeId } }
  editingLesson.value = {}
  showForm.value = false
}

const closeModal = () => {
  emit('close')
  cancelEdit()
}

const openForm = () => (showForm.value = true)

watch(() => props.classeId, fetchLessons, { immediate: true })
</script>
