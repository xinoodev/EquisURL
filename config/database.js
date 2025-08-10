const mongoose = require('mongoose');
require('dotenv').config();

// Modificar la URI para incluir el nombre de la base de datos
const dbURI = `${process.env.MONGODB_URI}/equisurl_links`;

mongoose.connect(dbURI)
  .then(() => console.log('[BASE DE DATOS] Conectado a la base de datos con éxito.'))
  .catch(err => console.error('[BASE DE DATOS] Error de conexión:', err))

const urlSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  url: { type: String, required: true },
}, { collection: 'created_urls' });

const Url = mongoose.model('Url', urlSchema);

module.exports = {
  Url
};