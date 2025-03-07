const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const enseignantRoutes = require('./routes/enseignantRoutes');
const eleveRoutes = require('./routes/eleveRoutes');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');
const jwt = require('jsonwebtoken');

const Eleve = require('./models/Eleve');
const Admin = require('./models/Admin');

const app = express();
const port = process.env.PORT || 5002;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/uploads', express.static('uploads'));

// Utilisation des routes
app.use('/admin', adminRoutes);
app.use('/api', enseignantRoutes);
app.use('/api', eleveRoutes);
app.use('/api/events', eventRoutes);

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

const adminConfig = require('./config/admin');

// Route pour l'authentification admin
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    // Vérification des identifiants avec adminConfig
    if (username === adminConfig.username && password === adminConfig.password) {
        // Si les identifiants sont corrects
        res.json({
            success: true,
            message: 'Authentification réussie',
            user: {
                username: adminConfig.username,
                email: adminConfig.email,
                role: adminConfig.role
            }
        });
    } else {
        // Si les identifiants sont incorrects
        res.status(401).json({
            success: false,
            message: 'Nom d\'utilisateur ou mot de passe incorrect'
        });
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

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
