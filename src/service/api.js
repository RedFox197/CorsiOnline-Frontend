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
  baseURL: 'http://localhost:8080/api/v1', // Aggiungi l'URL base della tua API
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Recupera tutti gli utenti
 * @returns {Promise<Array<Utente>>}
 */
async function findAllUtenti() {
  const response = await apiClient.get("http://localhost:8080/api/v1/utenti");
  return response.data;
}

export default {
  findAllUtenti
}
