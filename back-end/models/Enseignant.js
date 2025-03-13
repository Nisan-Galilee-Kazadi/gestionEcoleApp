const mongoose = require('mongoose');

const enseignantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  
  // Ajout de nouveaux champs
  matieres: [{
    nom: String,
    niveau: String,
    heures_semaine: Number
  }],
  classes: [{
    nom: String,
    niveau: String,
    annee_scolaire: String
  }],
  horaire: [{
    jour: String,
    debut: String,
    fin: String,
    classe: String,
    matiere: String
  }],
  disponibilites: [{
    jour: String,
    heures: [{
      debut: String,
      fin: String
    }]
  }],
  absences: [{
    date: Date,
    motif: String,
    justifie: Boolean
  }],
  evaluations: [{
    date: Date,
    classe: String,
    matiere: String,
    type: String,
    description: String
  }]
}, { timestamps: true }); // Ajoute createdAt et updatedAt

module.exports = mongoose.model('Enseignant', enseignantSchema);
