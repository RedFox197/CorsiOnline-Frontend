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
  baseURL: 'http://localhost:8080/api/v1/utenti', // Aggiungi l'URL base della tua API
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Recupera tutti gli utenti
 * @returns {Promise<Array<Utente>>}
 */
async function findAll() {
  const response = await apiClient.get();
  return response.data;
}

/**
 * Recupera tutti gli utenti
 * @param id {number}
 * @returns {Promise<Utente>}
 */
async function findById(id) {
  const response = await apiClient.get("/"+id);
  return response.data;
}

/**
 * Recupera tutti gli utenti
 * @param id {number}
 * @returns {Promise<Array<Classe>>}
 */
async function getClassi(id) {
  const response = await apiClient.get("/"+id+"/classi");
  return response.data;
}

/**
 * Recupera tutti gli utenti
 * @param id {number}
 * @returns {Promise<Array<Classe>>}
 */
async function getEsami(id) {
  const response = await apiClient.get("/"+id+"/esami");
  return response.data;
}

/**
 * @param {Utente} utente
 */
async function save(utente) {
  return await apiClient.post("", utente);
}

//update con un path /utenti/id put poi simile al save anche con jsdoc
/**
 * @param {number} id
 * @param {Utente} utente
 */
async function update(id, utente) {
  return await apiClient.put("/"+id, utente);
}

/**
 * @param {number} id
 */
async function deleteu(id) {
  return await apiClient.delete("/"+id);
}

/**
 * Recupera tutte le classi
 * @returns {Promise<Array<Classe>>}
 */
async function findAllClassi() {
  const response = await axios.get('http://localhost:8080/api/v1/classi');
  return response.data;
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
  findAll, findById, getClassi, getEsami, save, update, deleteu, findAllClassi, updateClassi
};
