const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schéma de l'administrateur
const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Méthode pour hacher le mot de passe avant de sauvegarder
AdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;