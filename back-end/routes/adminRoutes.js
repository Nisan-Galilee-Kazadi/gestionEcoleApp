const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/avatars/' });

// Routes protégées par authentification
router.use(auth);

router.put('/profile', upload.single('photo'), adminController.updateProfile);
router.put('/password', adminController.updatePassword);

module.exports = router; 