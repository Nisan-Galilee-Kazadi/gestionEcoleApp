const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Pour enregistrer un nouvel admin, en traitant aussi l'upload de la photo
router.post('/register', adminController.uploadAvatar, adminController.registerAdmin);

// Route pour récupérer les informations de l'admin
router.get('/info', adminController.getAdminInfo);

// Route de connexion de l'admin
router.post('/login', adminController.loginAdmin);

// Route pour mettre à jour la photo
router.post('/update-photo', auth, adminController.uploadAvatar, adminController.updatePhoto);

module.exports = router;