const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schéma de l'administrateur
const adminSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    photo: {
        type: String,
        default: 'default-avatar.jpg'
    },
    role: {
        type: String,
        default: 'admin'
    }
}, {
    timestamps: true
});

// Middleware pour hasher le mot de passe avant sauvegarde
adminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Méthode pour vérifier le mot de passe
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);