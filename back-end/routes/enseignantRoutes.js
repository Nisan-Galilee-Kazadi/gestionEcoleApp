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

module.exports = router;