const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const path = require('path');
const bcrypt = require('bcrypt');
const enseignantRoutes = require('./routes/enseignantRoutes');
const eleveRoutes = require('./routes/eleveRoutes');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs').promises;

const Eleve = require('./models/Eleve');
const Admin = require('./models/Admin');

const app = express();
const port = process.env.PORT || 5002;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration CORS
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', enseignantRoutes);
app.use('/api', eleveRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => {
    console.error('❌ Erreur de connexion à MongoDB:', err);
    process.exit(1);
}); 

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Route d'inscription d'un élève
app.post('/save', async (req, res) => {
    try {
        console.log("📩 Données reçues:", req.body);

        const newEleve = new Eleve(req.body);
        await newEleve.save();

        res.status(201).json({ message: '✅ Élève enregistré avec succès' });
    } catch (err) {
        console.error('❌ Erreur validation:', err.errors);
        res.status(500).json({ message: '❌ Erreur serveur', errors: err.errors });
    }
});

// Route d'enregistrement de l'administrateur (à utiliser une seule fois)
app.post('/admin/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "❌ Nom d'utilisateur et mot de passe requis" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: '✅ Administrateur enregistré avec succès' });
    } catch (err) {
        console.error('❌ Erreur enregistrement admin:', err);
        res.status(500).json({ message: '❌ Erreur serveur' });
    }
});

// Route de connexion administrateur
app.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('👉 Tentative de connexion pour:', username);

        // Rechercher l'admin avec le username exact
        const admin = await Admin.findOne({ username: username });
        console.log('🔍 Recherche admin avec username:', username);

        if (!admin) {
            console.log('❌ Admin non trouvé');
            return res.status(400).json({ 
                success: false, 
                message: '❌ Identifiants incorrects' 
            });
        }

        // Vérifier le mot de passe
        const isValidPassword = await bcrypt.compare(password, admin.password);
        console.log('🔐 Vérification mot de passe');

        if (!isValidPassword) {
            console.log('❌ Mot de passe incorrect');
            return res.status(400).json({ 
                success: false, 
                message: '❌ Identifiants incorrects' 
            });
        }

        // Créer un token JWT avec les informations de l'admin
        const token = jwt.sign(
            { 
                id: admin._id,
                username: admin.username,
                fullname: admin.fullname,
                email: admin.email,
                role: admin.role
            },
            process.env.JWT_SECRET || 'votre_secret_jwt',
            { expiresIn: '1h' }
        );

        // Envoyer la réponse avec les informations de l'admin
        res.status(200).json({
            success: true,
            message: '✅ Connexion réussie',
            token,
            admin: {
                username: admin.username,
                fullname: admin.fullname,
                email: admin.email,
                phone: admin.phone,
                address: admin.address,
                photo: admin.photo,
                role: admin.role
            }
        });

    } catch (err) {
        console.error('❌ Erreur connexion admin:', err);
        res.status(500).json({ 
            success: false, 
            message: '❌ Erreur serveur' 
        });
    }
});

// Route de récupération des informations de l'admin
app.get('/admin/profile', async (req, res) => {
    try {
        // Vérification de la présence du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: '❌ Token manquant'
            });
        }

        // Extraction et vérification du token
        const token = authHeader.split(' ')[1];
        console.log('🔑 Token reçu:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
        console.log('✅ Token décodé:', decoded);

        // Recherche de l'admin
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: '❌ Admin non trouvé'
            });
        }

        // Envoi de la réponse
        res.status(200).json({
            success: true,
            admin: {
                username: admin.username,
                fullname: admin.fullname,
                email: admin.email,
                phone: admin.phone,
                address: admin.address,
                photo: admin.photo,
                role: admin.role
            }
        });
    } catch (err) {
        console.error('❌ Erreur récupération admin:', err);
        res.status(401).json({
            success: false,
            message: '❌ Token invalide'
        });
    }
});

// Route de mise à jour du profil admin
app.put('/admin/update-profile', async (req, res) => {
    try {
        const { fullname, email, phone, address } = req.body;

        // Trouver et mettre à jour l'admin
        const admin = await Admin.findOneAndUpdate(
            {}, // Premier admin trouvé
            {
                fullname,
                email,
                phone,
                address
            },
            { new: true }
        );

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: '❌ Admin non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: '✅ Profil mis à jour avec succès',
            admin: {
                username: admin.username,
                fullname: admin.fullname,
                email: admin.email,
                phone: admin.phone,
                address: admin.address,
                photo: admin.photo,
                role: admin.role
            }
        });

    } catch (err) {
        console.error('❌ Erreur mise à jour profil:', err);
        res.status(500).json({
            success: false,
            message: '❌ Erreur serveur'
        });
    }
});

// Route de mise à jour du mot de passe admin
app.post('/admin/update-password', async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Vérification des champs requis
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: '❌ Tous les champs sont requis'
            });
        }

        // Trouver l'admin
        const admin = await Admin.findOne();
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: '❌ Admin non trouvé'
            });
        }

        // Vérifier l'ancien mot de passe
        const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: '❌ Mot de passe actuel incorrect'
            });
        }

        // Hasher et mettre à jour le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({
            success: true,
            message: '✅ Mot de passe mis à jour avec succès'
        });

    } catch (err) {
        console.error('❌ Erreur mise à jour mot de passe:', err);
        res.status(500).json({
            success: false,
            message: '❌ Erreur serveur'
        });
    }
});

// Route de suppression de l'admin
app.delete('/admin/profile', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
        await Admin.findByIdAndDelete(decoded.id);
        res.status(200).json({
            success: true,
            message: '✅ Profil supprimé avec succès'
        });
    } catch (err) {
        console.error('❌ Erreur suppression admin:', err);
        res.status(500).json({
            success: false,
            message: '❌ Erreur serveur'
        });
    }
});

// Route temporaire pour voir les données admin (À SUPPRIMER EN PRODUCTION)
app.get('/admin/test-data', async (req, res) => {
    try {
        const admin = await Admin.findOne();
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: '❌ Aucun admin trouvé'
            });
        }

        res.status(200).json({
            success: true,
            admin: {
                username: admin.username,
                fullname: admin.fullname,
                email: admin.email,
                phone: admin.phone,
                address: admin.address,
                photo: admin.photo,
                role: admin.role
            }
        });
    } catch (err) {
        console.error('❌ Erreur récupération admin:', err);
        res.status(500).json({
            success: false,
            message: '❌ Erreur serveur'
        });
    }
});



// Démarrer le serveur
app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur le port ${port}`);
});
