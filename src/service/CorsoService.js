// src/services/api.js

/**
 * @typedef {Object} Corso
 * @property {number} id
 * @property {string} titolo
 * @property {string} descrizione
 * */

import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1/corsi',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Recupera tutte i corsi
 * @returns {Promise<Array<Corso>>}
 */
async function findAll() {
  const response = await apiClient.get()
  return response.data
}

/**
 * Recupera un corso per id
 * @param id {number}
 * @returns {Promise<Corso>}
 */
async function findById(id) {
  const response = await apiClient.get('/' + id)
  return response.data
}

/**
 * Recupera tutti le classi di un corso
 * @param id {number}
 * @returns {Promise<Array<Classe>>}
 */
async function getClassi(id) {
  const response = await apiClient.get('/' + id + '/classi')
  return response.data
}

/**
 * @param {Corso} corso
 */
async function save(corso) {
  return await apiClient.post('', corso)
}

//update con un path /utenti/id put poi simile al save anche con jsdoc
/**
 * @param {number} id
 * @param {corso} corso
 */
async function update(id, corso) {
  return await apiClient.put('/' + id, corso)
}

/**
 * @param {number} id
 */
async function deleteu(id) {
  return await apiClient.delete('/' + id)
}

/**
 * @param {number} id utente id
 * @param {Array<number>} classiIds array classi id
 * @param {boolean} booldel se cancellare o meno
 */
async function updateClassi(id, classiIds, booldel) {
  return await apiClient.put('/' + id + '/classi?delete=' + booldel, classiIds)
}

export default {
  findAll,
  findById,
  getClassi,
  save,
  update,
  deleteu,
  updateClassi,
}
