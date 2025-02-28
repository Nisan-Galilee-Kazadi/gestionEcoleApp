// const express = require('express');
// const router = express.Router();
// const adminController = require('../controllers/adminController');
// const auth = require('../middleware/auth');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/avatars/' });
// const Admin = require('../models/Admin');

// // Routes protégées par authentification
// router.use(auth);

// router.put('/profile', upload.single('photo'), adminController.updateProfile);
// router.put('/password', adminController.updatePassword);


// // Route pour obtenir les informations de l'admin
// router.get('/info', adminController.getAdminInfo);

// // Route pour mettre à jour les informations de l'admin
// router.put('/info', adminController.updateAdminInfo);


// // Route pour obtenir les informations de l'admin
// router.get('/info', adminController.getAdminInfo);

// // Route pour récupérer le profil admin
// router.get('/profile', async (req, res) => {
//     try {
//         // Récupérer l'admin depuis la base de données
//         const admin = await Admin.findById(req.admin.id).select('-password');
        
//         if (!admin) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Admin non trouvé'
//             });
//         }

//         res.json({
//             success: true,
//             data: admin
//         });
//     } catch (error) {
//         console.error('Erreur serveur:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur serveur'
//         });
//     }
// });

// // Route pour mettre à jour les infos
// router.put('/profile', async (req, res) => {
//     try {
//         const updatedAdmin = await Admin.findByIdAndUpdate(
//             req.admin.id,
//             {
//                 fullname: req.body.fullname,
//                 email: req.body.email,
//                 phone: req.body.phone,
//                 address: req.body.address
//             },
//             { new: true }
//         ).select('-password');

//         res.json({
//             success: true,
//             data: updatedAdmin
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });

// module.exports = router; 