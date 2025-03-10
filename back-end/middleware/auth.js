const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');


// const auth = async (req, res, next) => {
//     try {
//         // Récupérer le token du header Authorization
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Token d\'authentification manquant'
//             });
//         }

//         // Extraire le token
//         const token = authHeader.split(' ')[1];

//         // Vérifier le token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Trouver l'admin correspondant
//         const admin = await Admin.findById(decoded.id).select('-password');
//         if (!admin) {
//             throw new Error('Admin non trouvé');
//         }

//         // Ajouter l'admin à la requête
//         req.admin = admin;
//         next();
//     } catch (error) {
//         console.error('Erreur d\'authentification:', error);
//         res.status(401).json({
//             success: false,
//             message: 'Non autorisé'
//         });
//     }
// };


const auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: '❌ Accès refusé. Aucun token fourni.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: '❌ Token invalide.' });
  }
};

module.exports = auth;

module.exports = auth; 