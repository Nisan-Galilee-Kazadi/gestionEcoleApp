const mongoose = require('mongoose');

const eleveSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  postnom: { type: String },
  sexe: { type: String, enum: ['masculin', 'feminin'], required: true },
  nationalite: { type: String, required: true },
  date_naissance: { type: Date, required: true },
  telephone: { type: String, required: true },
  email_eleve: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ },
  niveau_etude: { type: String, required: true },
  section: { type: String, required: true },
  option_humanite: { type: String },
  nom_tuteur: { type: String, required: true },
  prenom_tuteur: { type: String, required: true },
  telephone_tuteur: { type: String, required: true },
  email_tuteur: { type: String, required: true, match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ },
  lien_eleve: { type: String, required: true },
  adresse_tuteur: { type: String, required: true },
  denomination_ecole: { type: String, required: true },
  adresse_ecole: { type: String, required: true },
  contact_ecole: { type: String, required: true },
  email_ecole: { type: String, required: true, match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ },
}, { timestamps: true });

const Eleve = mongoose.model('Eleve', eleveSchema);
module.exports = Eleve;
