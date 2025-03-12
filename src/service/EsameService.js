// src/services/api.js

/**
 * @typedef {Object} Esame
 * @property {number} id
 * @property {string} tipo
 * @property {string} descrizione
 * @property {number} punteggio
 * @property {string} data
 * @property {Classe} classe
 * @property {Utente} studente
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
 *
 * @typedef {Object} Corso
 * @property {number} id
 * @property {string} titolo
 * @property {string} descrizione
 * */

import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1/esami',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Recupera tutti gli esami
 * @returns {Promise<Array<Esame>>}
 */
async function findAll() {
  const response = await apiClient.get("");
  return response.data;
}

/**
 * Recupera tutti gli esami di un utente con un determinato nome
 * @param nome {string}
 * @param like {boolean} se cercare o meno in modo preciso
 * @returns {Promise<Array<Esame>>}
 */
async function findAllWithNome(nome, like) {
  const response = await apiClient.get("?nome=" + nome + "&like=" + like);
  return response.data;
}

/**
 * Recupera esame per id
 * @param id {number}
 * @returns {Promise<Esame>}
 */
async function findById(id) {
  const response = await apiClient.get("/"+id);
  return response.data;
}

/**
 * @param {Esame} esame
 */
async function save(esame) {
  return await apiClient.post("", esame);
}

/**
 * @param {number} id
 * @param {Esame} esame
 */
async function update(id, esame) {
  return await apiClient.put("/"+id, esame);
}

/**
 * @param {number} id
 */
async function deleteu(id) {
  return await apiClient.delete("/"+id);
}


export default {
  findAll, findById, save, update, deleteu, findAllWithNome
};
