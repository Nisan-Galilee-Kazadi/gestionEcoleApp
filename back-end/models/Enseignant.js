const mongoose = require('mongoose');

const enseignantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }
}, { timestamps: true }); // Ajoute createdAt et updatedAt

module.exports = mongoose.model('Enseignant', enseignantSchema);
