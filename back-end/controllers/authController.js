const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 🔹 Inscription (Register)
exports.register = async (req, res) => {
    try {
        const { nom, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet e-mail est déjà utilisé' });
        }

        // Hash du mot de passe avant stockage
        const hashedPassword = await bcrypt.hash(password, 12);

        // Création et sauvegarde de l'utilisateur
        const newUser = new User({ nom, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Inscription réussie, vous pouvez vous connecter' });
    } catch (error) {
        console.error('Erreur dans register:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

// 🔹 Connexion (Login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        // Générer un token JWT sécurisé
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ token, userId: user._id, message: 'Connexion réussie' });
    } catch (error) {
        console.error('Erreur dans login:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};
