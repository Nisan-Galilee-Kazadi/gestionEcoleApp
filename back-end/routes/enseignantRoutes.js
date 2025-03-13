const express = require('express');
const router = express.Router();
const enseignantController = require('../controllers/enseignantController');

// Obtenir tous les enseignants
router.get('/enseignants', enseignantController.getEnseignant);

// Obtenir un enseignant par ID
router.get('/enseignants/:id', enseignantController.getEnseignantById);

// Ajouter un enseignant
router.post('/enseignants', enseignantController.addEnseignant);

// Modifier un enseignant
router.put('/enseignants/:id', enseignantController.modifyEnseignant);

// Supprimer un enseignant
router.delete('/enseignants/:id', enseignantController.deleteEnseignant);

// Routes pour le dashboard professeur
router.get('/dashboard/:id', enseignantController.getDashboardData);
router.get('/horaire/:id', enseignantController.getHoraire);
router.post('/absences/:id', enseignantController.signlalerAbsence);
router.post('/evaluations/:id', enseignantController.planifierEvaluation);
router.get('/classes/:id', enseignantController.getClasses);
router.put('/disponibilites/:id', enseignantController.updateDisponibilites);

module.exports = router;