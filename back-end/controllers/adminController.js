const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function(req, file, cb) {
    cb(null, 'admin-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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


const getAdminInfo = (req, res) => {
  // Simuler la récupération des données de l'admin depuis une base de données
  const adminData = {
    name: 'Admin CICAF',
    phone: '+243 821 762 521',
    email: 'admin@cicaf.com',
    address: 'Mososo, Limete'
  };

  res.json(adminData);
};

const updateAdminInfo = (req, res) => {
  // Simuler la mise à jour des données de l'admin dans une base de données
  const updatedData = req.body;
  // Logique pour mettre à jour les données dans la base de données
  res.json({ message: 'Informations mises à jour avec succès', data: updatedData });
};

module.exports = {
  getAdminInfo,
  updateAdminInfo
};