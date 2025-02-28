const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();
const enseignantRoutes = require('./routes/enseignantRoutes');
const eleveRoutes = require('./routes/eleveRoutes');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');

const Eleve = require('./models/Eleve');
const Admin = require('./models/Admin');

const app = express();
const port = process.env.PORT || 5002;

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use('/api', enseignantRoutes);
app.use('/api', eleveRoutes);
app.use('/api/events', eventRoutes);
// app.use('/api/admin', adminRoutes);
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisation des routes
// app.use('/admin', adminRoutes);

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

// Route de connexion administrateur
app.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(400).json({ success: false, message: '❌ Identifiants incorrects' });
        }

        res.status(200).json({ success: true, message: '✅ Connexion réussie' });
    } catch (err) {
        console.error('❌ Erreur connexion admin:', err);
        res.status(500).json({ success: false, message: '❌ Erreur serveur' });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur le port ${port}`);
});
