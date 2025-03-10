const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Routes
router.post('/register', adminController.uploadAvatar, adminController.registerAdmin);
router.get('/info', auth, adminController.getAdminInfo);
router.post('/login', adminController.loginAdmin);
router.post('/update-photo', auth, adminController.uploadAvatar, adminController.updatePhoto);

module.exports = router;  // Important: exporter le router