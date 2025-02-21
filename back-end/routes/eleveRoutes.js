const express = require('express');
const router = express.Router();
const eleveController = require('../controllers/eleveController');

// Obtenir tous les élèves
router.get('/eleves', eleveController.getEleves);

// Obtenir un élève par ID
router.get('/eleves/:id', eleveController.getEleveById);

// Ajouter un élève
router.post('/eleves', eleveController.addEleve);

// Modifier un élève
router.put('/eleves/:id', eleveController.modifyEleve);

// Supprimer un élève
router.delete('/eleves/:id', eleveController.deleteEleve);


module.exports = router;