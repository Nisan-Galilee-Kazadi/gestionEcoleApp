const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

// Configuration de multer pour l'upload d'images (pour la photo de profil)
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function(req, file, cb) {
    cb(null, 'admin-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Exporter le middleware d'upload
exports.uploadAvatar = upload.single('photo');

// Fonction d'enregistrement d'un admin
exports.registerAdmin = async (req, res) => {
  try {
    const { username, fullname, email, phone, address, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Les champs username, email et password sont obligatoires'
      });
    }

    // Vérifier si l'admin existe déjà (selon email ou username)
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Un admin avec cet email existe déjà'
      });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Si une image est uploadée, la prendre en compte
    const photo = req.file ? req.file.filename : '';

    const newAdmin = await Admin.create({
      username,
      fullname,
      email,
      phone,
      address,
      photo,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: 'Admin enregistré avec succès',
      data: newAdmin
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement :', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Fonction pour récupérer les informations de l'admin
const getAdminInfo = async (req, res) => {
  try {
    console.log('Tentative de récupération des informations admin');
    const admin = await Admin.findOne();
    console.log('Admin trouvé :', admin);

    if (!admin) {
      console.log('Aucun admin trouvé');
      return res.status(404).json({
        success: false,
        message: 'Admin non trouvé'
      });
    }

    // Construire l'objet de réponse : utiliser fullname ou username
    const adminData = {
      name: (admin.fullname && admin.fullname.trim() !== '') ? admin.fullname : admin.username,
      phone: admin.phone || '',
      email: admin.email,
      address: admin.address || '',
      photo: admin.photo || ''
    };

    console.log('Données admin envoyées :', adminData);
    res.status(200).json({
      success: true,
      data: adminData
    });
  } catch (error) {
    console.error('Erreur dans getAdminInfo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données admin'
    });
  }
};

exports.getAdminInfo = getAdminInfo;

// Fonction de connexion d'un admin
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Tentative de connexion avec:', { username, password });

    const admin = await Admin.findOne({ username });
    console.log('Admin trouvé:', admin);

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      console.log('Identifiants incorrects');
      return res.status(400).json({ success: false, message: '❌ Identifiants incorrects' });
    }

    // Créer un token JWT
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, message: '✅ Connexion réussie', token });
  } catch (err) {
    console.error('❌ Erreur connexion admin:', err);
    res.status(500).json({ success: false, message: '❌ Erreur serveur' });
  }
};

// Autres fonctions existantes (updateProfile, updatePassword, etc.) restent inchangées

exports.updateProfile = async (req, res) => {
  try {
    const adminId = req.admin.id; // Supposant que l'ID admin est stocké dans req.admin après authentification
    const updateData = {
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address
    };

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    const { currentPassword, newPassword } = req.body;

    // Vérifier l'ancien mot de passe
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour le mot de passe
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateAdminInfo = (req, res) => {
  // Une implémentation possible de la mise à jour des données
  const updatedData = req.body;
  res.json({ message: 'Informations mises à jour avec succès', data: updatedData });
};

// Mettre à jour la photo de profil
exports.updatePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune photo fournie'
      });
    }

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { photo: req.file.filename },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Photo mise à jour avec succès',
      photo: req.file.filename
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la photo'
    });
  }
};

module.exports = {
  registerAdmin: exports.registerAdmin,
  getAdminInfo: exports.getAdminInfo,
  updateAdminInfo: exports.updateAdminInfo,
  updateProfile: exports.updateProfile,
  updatePassword: exports.updatePassword,
  uploadAvatar: exports.uploadAvatar,
  loginAdmin: exports.loginAdmin,
  updatePhoto: exports.updatePhoto
};