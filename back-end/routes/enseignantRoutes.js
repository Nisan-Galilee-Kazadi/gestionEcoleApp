const express = require('express');
const router = express.Router();
const enseignantController = require('../controllers/enseignantController');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour les uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

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

// Nouvelle route pour l'upload de photo
router.post('/upload-photo', upload.single('photo'), enseignantController.uploadPhoto);

// Routes pour le dashboard professeur
// router.get('/dashboard/:id', enseignantController.getDashboardData);
// router.get('/horaire/:id', enseignantController.getHoraire);
// router.post('/absences/:id', enseignantController.signlalerAbsence);
// router.post('/evaluations/:id', enseignantController.planifierEvaluation);
// router.get('/classes/:id', enseignantController.getClasses);
// router.put('/disponibilites/:id', enseignantController.updateDisponibilites);

// // Corriger la route POST qui cause l'erreur
// router.post('/api/documents/upload', upload.array('documents', 5), enseignantController.uploadDocument);

module.exports = router;