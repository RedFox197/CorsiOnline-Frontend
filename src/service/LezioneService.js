/**
 * @typedef {Object} Lezione
 * @property {number} id
 * @property {string} titolo
 * @property {string} descrizione
 * @property {string} data
 * @property {Array<string>} materiali
 * @property {Classe} classe
 *
 * @typedef {Object} Classe
 * @property {number} id
 * @property {string} nome
 * @property {string} dataInizio
 * @property {string} dataFine
 * @property {Corso} corso
 * @property {Utente} docente
 * */

import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1/lezioni',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Recupera tutte le lezioni
 * @returns {Promise<Array<Lezione>>}
 */
async function findAll() {
  const response = await apiClient.get('')
  return response.data
}

/**
 * Recupera lezione per id
 * @param id {number}
 * @returns {Promise<Lezione>}
 */
async function findById(id) {
  const response = await apiClient.get('/' + id)
  return response.data
}

/**
 * @param {Lezione} lezione
 */
async function save(lezione) {
  return await apiClient.post('', lezione)
}

/**
 * @param {number} id
 * @param {Lezione} lezione
 */
async function update(id, lezione) {
  return await apiClient.put('/' + id, lezione)
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
}
