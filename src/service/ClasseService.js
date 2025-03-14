// src/services/api.js

/**
 * @typedef {Object} Corso
 * @property {number} id
 * @property {string} titolo
 * @property {string} descrizione
 *
 *
 * @typedef {Object} Classe
 * @property {number} id
 * @property {string} nome
 * @property {string} dataInizio
 * @property {string} dataFine
 * @property {Corso} corso
 * @property {Utente} docente
 *
 * @typedef {Object} Utente
 * @property {number} id
 * @property {string} nome
 * @property {string} cognome
 * @property {string} email
 * @property {string} ruolo
 * */

import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1/classi',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Recupera tutte le classi
 * @returns {Promise<Array<Classe>>}
 */
async function findAll() {
  const response = await apiClient.get('')
  return response.data
}

/**
 * Recupera un classe per id
 * @param id {number}
 * @returns {Promise<Classe>}
 */
async function findById(id) {
  const response = await apiClient.get('/' + id)
  return response.data
}

/**
 * Recupera tutti le lezioni di una classe
 * @param id {number}
 */
async function getLezioni(id) {
  const response = await apiClient.get('/' + id + '/lezioni')
  return response.data
}

/**
 * Recupera tutti gli studenti di una classe
 * @param id {number}
 */
async function getStudenti(id) {
  const response = await apiClient.get('/' + id + '/studenti')
  return response.data
}

/**
 * @param {number} id
 * @param {Array<Utente>} studenti
 */
async function updateStudenti(id, studenti) {
  return await apiClient.put('/' + id + '/studenti' + id, studenti)
}

/**
 * @param {Classe} classe
 */
async function save(classe) {
  return await apiClient.post('', classe)
}

/**
 * @param {number} id
 * @param {Classe} classe
 */
async function update(id, classe) {
  return await apiClient.put('/' + id, classe)
}

/**
 * @param {number} id
 * @param {number} corsoId
 */
async function setCorso(id, corsoId) {
  return await apiClient.put('/' + id + '/corso?corsoId=' + corsoId)
}

/**
 * @param {number} id
 * @param {number} utenteId
 */
async function setDocente(id, utenteId) {
  return await apiClient.put('/' + id + '/docente?utenteId=' + utenteId)
}

/**
 * @param {number} id
 */
async function deleteu(id) {
  return await apiClient.delete('/' + id)
}

export default {
  findAll,
  findById,
  save,
  update,
  deleteu,
  getLezioni,
  getStudenti,
  setCorso,
  setDocente,
  updateStudenti,
}
