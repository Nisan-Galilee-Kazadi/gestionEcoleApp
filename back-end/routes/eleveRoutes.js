const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const eleveController = require('../controllers/eleveController');

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

// Route pour l'upload de photo
router.post('/upload-photo', upload.single('photo'), eleveController.uploadPhoto);

module.exports = router;